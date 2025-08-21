package server

import (
	"context"
	"log"
	"os"

	gw "github.com/grpc-ecosystem/grpc-gateway/v2/runtime"
	"google.golang.org/grpc"

	"github.com/anqaml/go-svc/srv"
	pb1 "github.com/anqaml/id-verifier/gen/proto/go/idverifier/v1"
	v1 "github.com/anqaml/id-verifier/handler/v1"
	s1 "github.com/anqaml/id-verifier/store/v1"
)

// Handlers is used to implement the srv.HandlerRegisterer interface
type Handlers struct{}

type Option func(*Handlers)

// Serve starts the gRPC server and HTTP gateway
func Serve(opts ...Option) {
	h := &Handlers{}
	// for _, opt := range opts {
	// 	opt(h)
	// }

	server := srv.New("id-verifier", h)
	if err := server.Start(); err != nil {
		log.Fatalf("error starting server: %v", err)
	}
}

// Register handler with grpc server and http gateway
func (h *Handlers) RegisterHandlers(ctx context.Context, grpcSrv *grpc.Server, httpMux *gw.ServeMux) error {
	store, err := s1.New(
		os.Getenv("MONGODB_USER"),
		os.Getenv("MONGODB_PWD"),
		os.Getenv("MONGODB_HOST"),
	)
	if err != nil {
		return err
	}

	handler := v1.IdVerifier{Store: store}
	pb1.RegisterIdVerifierServiceServer(grpcSrv, handler)
	pb1.RegisterIdVerifierServiceHandlerServer(ctx, httpMux, handler)

	return nil
}
