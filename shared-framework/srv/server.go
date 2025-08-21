package srv

import (
	"context"
	"fmt"
	"net"
	"net/http"
	"os"
	"os/signal"
	"strconv"
	"strings"
	"syscall"

	grpc_middleware "github.com/grpc-ecosystem/go-grpc-middleware"
	gw "github.com/grpc-ecosystem/grpc-gateway/v2/runtime"
	instana "github.com/instana/go-sensor"
	"github.com/instana/go-sensor/instrumentation/instagrpc"
	"github.com/nats-io/nats.go"
	"github.com/nats-io/nats.go/encoders/protobuf"
	"github.com/nats-io/nkeys"
	"golang.org/x/net/http2"
	"golang.org/x/net/http2/h2c"
	"google.golang.org/grpc"
	"google.golang.org/grpc/reflection"
)

type Registerer interface {
	RegisterHandlers(ctx context.Context, grpcSrv *grpc.Server, httpMux *gw.ServeMux, encConn *nats.EncodedConn) error
	// RegisterSubscribers(encConn *nats.EncodedConn) error
}

// Server type is used by Server receiver methods
type Server struct {
	service    string
	port       int
	nomd       []string
	registerer Registerer
}

// Option configures how we set up the connection.
type Option func(*Server)

// New creates a new server instance
func New(svc string, hr Registerer, opts ...Option) *Server {
	// set defaults
	s := Server{
		service:    svc,
		port:       9443,
		registerer: hr,
	}
	// apply options
	for _, opt := range opts {
		opt(&s)
	}

	// TODO: add keys to kubernetes secret
	os.Setenv("NATS_USERJWT", "eyJ0eXAiOiJKV1QiLCJhbGciOiJlZDI1NTE5LW5rZXkifQ.eyJqdGkiOiJVTVkySEdCVTNBQVJYUloyNUtLR1JWUFlSTFdTUlpDNVJNVExEWkk3TlVMTEdUU01TSUhBIiwiaWF0IjoxNjMwOTE5MjUzLCJpc3MiOiJBRFJNQUNFUTROTVBZUVQyTUlBWVZPNVJEV1RBUDU1S1JaVVk1QU9NTVVEVzdERUVFSVczUzZTTSIsIm5hbWUiOiJBdmlkIiwic3ViIjoiVUNJVUtEUU5RVjNVUkE1QllDVVBPV0tZSklLNVdORjdYQzVPRTJRSkhaNkJTSFVYNUtWNjJRWlQiLCJuYXRzIjp7InB1YiI6e30sInN1YiI6e30sInN1YnMiOi0xLCJkYXRhIjotMSwicGF5bG9hZCI6LTEsInR5cGUiOiJ1c2VyIiwidmVyc2lvbiI6Mn19.cXuyQNOeBqN_GN2iVTYkj7_4RtkigDoES5ZO9WGCl2OoGo44Wd9QWJNp7nKn9tmi6wP6M2h4KdYFqV15xESgAw")
	os.Setenv("NATS_NKEYSEED", "SUAF3WM6W6AEINEQM74JSHRE46OWSZ26GBTONYNFGXPNIL5KVGZAC2XMAM")

	return &s
}

func WithPort(p int) Option {
	return func(s *Server) {
		s.port = p
	}
}
func WithNoMDPath(paths ...string) Option {
	return func(s *Server) {
		s.nomd = paths
	}
}

// Start connects to dependencies and starts the service
func (s *Server) Start() error {
	// tracing
	instana.InitSensor(instana.DefaultOptions())
	sensor := instana.NewSensor(s.service)

	ctx, stop := signal.NotifyContext(context.Background(), os.Interrupt, syscall.SIGTERM)
	defer stop()

	// http gateway
	hm := gw.WithIncomingHeaderMatcher(func(key string) (string, bool) {
		return key, true
	})
	httpMux := gw.NewServeMux(hm)

	// grpc
	grpcSrv := grpc.NewServer(
		grpc.UnaryInterceptor(
			grpc_middleware.ChainUnaryServer(
				instagrpc.UnaryServerInterceptor(sensor),
				UnaryMetadataInterceptor(s.nomd...),
				UnaryValidationInterceptor(),
			),
		),
	)
	defer grpcSrv.GracefulStop()
	reflection.Register(grpcSrv)

	// make multi-protocol server
	mux := httpGrpcMux(httpMux, grpcSrv)
	httpSrv := &http.Server{
		Handler: h2c.NewHandler(mux, &http2.Server{}),
	}

	// nats ngs
	userCB := func() (string, error) {
		return os.Getenv("NATS_USERJWT"), nil
	}
	sigCB := func(nonce []byte) ([]byte, error) {
		kp, err := nkeys.ParseDecoratedNKey([]byte(os.Getenv("NATS_NKEYSEED")))
		if err != nil {
			return nil, err
		}
		sig, _ := kp.Sign(nonce)
		if err != nil {
			return nil, err
		}
		return sig, nil
	}

	nc, err := nats.Connect("connect.ngs.global", nats.UserJWT(userCB, sigCB))
	if err != nil {
		return fmt.Errorf("issue connnecting to NATS: %v", err)
	}
	encConn, err := nats.NewEncodedConn(nc, protobuf.PROTOBUF_ENCODER)
	if err != nil {
		return fmt.Errorf("issue creating NATS encoded connection: %v", err)
	}
	defer nc.Drain()

	// register client handlers
	if err := s.registerer.RegisterHandlers(ctx, grpcSrv, httpMux, encConn); err != nil {
		return err
	}
	// // register event subscribers
	// if err := s.registerer.RegisterSubscribers(encConn); err != nil {
	// 	return err
	// }

	// listen and serve
	lis, err := net.Listen("tcp", ":"+strconv.Itoa(s.port))
	if err != nil {
		return err
	}

	fmt.Println("Service started")
	if err := httpSrv.Serve(lis); err != http.ErrServerClosed {
		return err
	}
	return nil
}

// Use request protocol and content type to determine which server will be used to handle the request.
func httpGrpcMux(httpHandler http.Handler, grpcServer *grpc.Server) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		if r.ProtoMajor == 2 && strings.Contains(r.Header.Get("Content-Type"), "application/grpc") {
			grpcServer.ServeHTTP(w, r)
		} else {
			httpHandler.ServeHTTP(w, r)
		}
	})
}

func ResolveHost(svcName string) string {
	envName := strings.ToUpper(svcName)
	envName = strings.ReplaceAll(envName, "-", "_")
	return net.JoinHostPort(os.Getenv(envName+"_SERVICE_HOST"), os.Getenv(envName+"_SERVICE_PORT"))
}
