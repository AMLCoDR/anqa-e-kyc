package server

import (
	"context"
	"log"
	"os"

	gw "github.com/grpc-ecosystem/grpc-gateway/v2/runtime"
	"github.com/nats-io/nats.go"
	"google.golang.org/grpc"

	pb1 "github.com/anqaml/customer-v1/gen/proto/go/customer/v1beta1"
	v1 "github.com/anqaml/customer-v1/handler/v1beta1"
	s1 "github.com/anqaml/customer-v1/store/v1"
	"github.com/anqaml/go-svc/srv"
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

	server := srv.New("customer-v1", h)
	if err := server.Start(); err != nil {
		log.Fatalf("error starting server: %v", err)
	}
}

// Register handler with grpc server and http gateway
func (h *Handlers) RegisterHandlers(ctx context.Context, grpcSrv *grpc.Server, httpMux *gw.ServeMux, encConn *nats.EncodedConn) error {
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
