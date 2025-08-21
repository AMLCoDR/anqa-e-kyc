package server

import (
	"context"
	"fmt"
	"net"
	"net/http"
	"os"
	"os/signal"
	"strconv"
	"syscall"

	gw "github.com/grpc-ecosystem/grpc-gateway/v2/runtime"
	instana "github.com/instana/go-sensor"
	"github.com/instana/go-sensor/instrumentation/instagrpc"
	"golang.org/x/net/http2"
	"golang.org/x/net/http2/h2c"
	"google.golang.org/grpc"
	"google.golang.org/grpc/reflection"

	"github.com/anqaml/go-svc/srv"
	pb1 "github.com/anqaml/key-person/gen/proto/go/keyperson/v1"
	v1 "github.com/anqaml/key-person/handler/v1"
	s1 "github.com/anqaml/key-person/store/v1"
)

// Server type is used by Server receiver methods
type Server struct {
	port     int
	dbServer string
	dbUser   string
	dbPwd    string
	ready    chan<- *bool
}

type Option func(*Server)

// New creates a new server instance
func New(port int, opts ...Option) *Server {

	s := Server{
		port:     port,
		dbServer: os.Getenv("MONGODB_HOST"),
		dbUser:   os.Getenv("MONGODB_USER"),
		dbPwd:    os.Getenv("MONGODB_PWD"),
	}

	// add options to server
	for _, opt := range opts {
		opt(&s)
	}

	return &s
}

// WithReadyChan allows the caller to supply channel to callback on
// when the server is ready
func WithReadyChan(ch chan<- *bool) Option {
	return func(s *Server) {
		s.ready = ch
	}
}

// Start connects to dependencies and starts the service
func (sr *Server) Start() error {
	sensor := instana.NewSensor("key-person")

	store, err := s1.New(sr.dbUser, sr.dbPwd, sr.dbServer)
	if err != nil {
		return err
	}

	handler := v1.KeyPerson{Store: store}

	ctx, stop := signal.NotifyContext(context.Background(), os.Interrupt, syscall.SIGTERM)
	defer stop()

	// grpc
	grpcSrv := grpc.NewServer(
		grpc.UnaryInterceptor(instagrpc.UnaryServerInterceptor(sensor)),
	)
	defer grpcSrv.GracefulStop()

	pb1.RegisterKeyPersonServiceServer(grpcSrv, handler)
	reflection.Register(grpcSrv)

	// http gateway - map all http headers to grpc context
	hm := gw.WithIncomingHeaderMatcher(func(key string) (string, bool) {
		return key, true
	})
	httpMux := gw.NewServeMux(hm)
	pb1.RegisterKeyPersonServiceHandlerServer(ctx, httpMux, handler)

	// set up multi-protocol server
	mux := srv.HTTPGrpcMux(httpMux, grpcSrv)
	httpSrv := &http.Server{
		Handler: h2c.NewHandler(mux, &http2.Server{}),
	}

	// listen and serve
	lis, err := net.Listen("tcp", ":"+strconv.Itoa(sr.port))
	if err != nil {
		return err
	}

	if sr.ready != nil {
		ready := true
		sr.ready <- &ready
	}

	fmt.Println("Service started") // used by vscode launch.json
	if err := httpSrv.Serve(lis); err != http.ErrServerClosed {
		return err
	}

	return nil
}
