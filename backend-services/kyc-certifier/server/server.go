package server

import (
	"context"
	"log"
	"os"

	gw "github.com/grpc-ecosystem/grpc-gateway/v2/runtime"
	"google.golang.org/grpc"

	"github.com/anqaml/go-svc/srv"
	pb1 "github.com/anqaml/kyc-certifier/gen/proto/go/kyccertifier/v1"
	v1 "github.com/anqaml/kyc-certifier/handler/v1"
	s1 "github.com/anqaml/kyc-certifier/store/v1"
	pbc "go.buf.build/library/go-grpc/anqa/customer/customer/v1"
	pbi "go.buf.build/library/go-grpc/anqa/identity/identity/v1"
)

// Handlers is used to implement the srv.HandlerRegisterer interface
type Handlers struct{}

type Option func(*Handlers)

// Serve starts the gRPC server and HTTP gateway
func Serve(opts ...Option) {
	h := &Handlers{}
	for _, opt := range opts {
		opt(h)
	}

	server := srv.New("kyc-verifier", h)
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

	cconn, err := grpc.Dial(srv.ResolveHost("customer"), grpc.WithInsecure())
	if err != nil {
		return err
	}
	iconn, err := grpc.Dial(srv.ResolveHost("identity"), grpc.WithInsecure())
	if err != nil {
		return err
	}

	handler := v1.KycCertifier{
		CustSvc:  pbc.NewCustomerServiceClient(cconn),
		IdentSvc: pbi.NewIdentityServiceClient(iconn),
		// IdVerSvc: pbv.NewIdVerifierServiceClient(vconn),
		Store: store,
	}

	pb1.RegisterKycCertifierServiceServer(grpcSrv, handler)
	pb1.RegisterKycCertifierServiceHandlerServer(ctx, httpMux, handler)

	return nil
}
