package server

import (
	"context"
	"log"
	"os"

	gw "github.com/grpc-ecosystem/grpc-gateway/v2/runtime"
	"google.golang.org/grpc"

	pb1 "github.com/anqaml/customer/gen/proto/go/customer/v1"
	v1 "github.com/anqaml/customer/handler/v1"
	s1 "github.com/anqaml/customer/store/v1"
	"github.com/anqaml/go-svc/srv"
)

// Handlers is used to implement the srv.HandlerRegisterer interface
type Handlers struct{}

type Option func(*Handlers)

// New creates a new server instance
func Serve(opts ...Option) {
	h := &Handlers{}
	// for _, opt := range opts {
	// 	opt(h)
	// }

	svr := srv.New("customer", h)
	if err := svr.Start(); err != nil {
		log.Fatalf("error starting server: %v", err)
	}
}

// Register handler with grpc server and http gateway
func (s *Handlers) RegisterHandlers(ctx context.Context, grpcSrv *grpc.Server, httpMux *gw.ServeMux) error {
	store, err := s1.New(
		os.Getenv("MONGODB_USER"),
		os.Getenv("MONGODB_PWD"),
		os.Getenv("MONGODB_HOST"),
	)
	if err != nil {
		return err
	}

	handler := v1.Customer{Store: store}
	pb1.RegisterCustomerServiceServer(grpcSrv, handler)
	pb1.RegisterCustomerServiceHandlerServer(ctx, httpMux, handler)

	return nil
}
