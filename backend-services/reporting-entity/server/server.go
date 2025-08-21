package server

import (
	"context"
	"log"
	"os"

	gw "github.com/grpc-ecosystem/grpc-gateway/v2/runtime"
	"github.com/nats-io/nats.go"
	"google.golang.org/grpc"

	"github.com/anqaml/go-svc/srv"
	pb2 "github.com/anqaml/reporting-entity/gen/proto/go/reportingentity/v2"
	v2 "github.com/anqaml/reporting-entity/handler/v2"
	s1 "github.com/anqaml/reporting-entity/store"
	pbs "go.buf.build/library/go-grpc/anqa/subscription/subscription/v1"
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

	nometa := srv.WithNoMDPath(
		"/reportingentity.v2.ReportingEntityService/Create",
		"/reportingentity.v2.ReportingEntityService/Get",
		"/reportingentity.v2.ReportingEntityService/Query",
	)

	server := srv.New("reporting-entity", h, nometa)
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

	sconn, err := grpc.Dial(srv.ResolveHost("subscription"), grpc.WithInsecure())
	if err != nil {
		return err
	}

	handler := v2.ReportingEntity{
		Store:   store,
		SubsCli: pbs.NewSubscriptionServiceClient(sconn),
	}

	pb2.RegisterReportingEntityServiceServer(grpcSrv, handler)
	pb2.RegisterReportingEntityServiceHandlerServer(ctx, httpMux, handler)

	return nil
}
