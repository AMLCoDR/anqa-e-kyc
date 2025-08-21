package server

import (
	"context"
	"log"
	"os"

	gw "github.com/grpc-ecosystem/grpc-gateway/v2/runtime"
	"github.com/nats-io/nats.go"
	"google.golang.org/grpc"

	flag "github.com/anqaml/go-svc/flg"
	"github.com/anqaml/go-svc/srv"
	pb2 "github.com/anqaml/id-check/gen/proto/go/idcheck/v2"
	pb3 "github.com/anqaml/id-check/gen/proto/go/idcheck/v3"
	h2 "github.com/anqaml/id-check/handler/v2"
	h3 "github.com/anqaml/id-check/handler/v3"
	s2 "github.com/anqaml/id-check/store/v2"
	s3 "github.com/anqaml/id-check/store/v3"
	pbe "go.buf.build/library/go-grpc/anqa/entity/entity/v1"
)

// Handlers is used to implement the srv.HandlerRegisterer interface
type Handlers struct {
	flag *flag.Client
}

type Option func(*Handlers)

// Serve starts the gRPC server and HTTP gateway
func Serve(opts ...Option) {
	h := &Handlers{}
	for _, opt := range opts {
		opt(h)
	}

	server := srv.New("id-check", h)
	if err := server.Start(); err != nil {
		log.Printf("error starting server: %v", err)
	}
}

// WithFlagClient takes a LaunchDarkly client to be used by the server
func WithFlagClient(cli *flag.Client) Option {
	return func(h *Handlers) {
		h.flag = cli
	}
}

// Register handler with grpc server and http gateway
func (h *Handlers) RegisterHandlers(ctx context.Context, grpcSrv *grpc.Server, httpMux *gw.ServeMux, encConn *nats.EncodedConn) error {
	store2, err := s2.New(
		os.Getenv("MONGODB_USER"),
		os.Getenv("MONGODB_PWD"),
		os.Getenv("MONGODB_HOST"),
	)
	if err != nil {
		return err
	}

	store3, err := s3.New(
		os.Getenv("MONGODB_USER"),
		os.Getenv("MONGODB_PWD"),
		os.Getenv("MONGODB_HOST"),
	)
	if err != nil {
		return err
	}

	econn, err := grpc.Dial(srv.ResolveHost("entity"), grpc.WithInsecure())
	if err != nil {
		return err
	}
	entCli := pbe.NewEntityServiceClient(econn)

	handler2 := h2.IDChecks{
		Store:   store2,
		EntCli:  entCli,
		FlagCli: h.flag,
	}
	handler3 := h3.IDChecks{
		Store:   store3,
		EntCli:  entCli,
		FlagCli: h.flag,
	}

	pb2.RegisterIdCheckServiceServer(grpcSrv, handler2)
	pb3.RegisterIdCheckServiceServer(grpcSrv, handler3)
	pb2.RegisterIdCheckServiceHandlerServer(ctx, httpMux, handler2)
	pb3.RegisterIdCheckServiceHandlerServer(ctx, httpMux, handler3)

	return nil
}
