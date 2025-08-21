package server

import (
	"context"
	"log"

	gw "github.com/grpc-ecosystem/grpc-gateway/v2/runtime"
	"github.com/nats-io/nats.go"
	"google.golang.org/grpc"

	"github.com/anqaml/go-svc/srv"
	pb1 "github.com/anqaml/mock-data/gen/proto/go/mockdata/v1"
	v1 "github.com/anqaml/mock-data/handler/v1"
	"github.com/anqaml/mock-data/store"
	pbc "go.buf.build/library/go-grpc/anqa/customer-v1/customer/v1beta1"
	pbd "go.buf.build/library/go-grpc/anqa/document/document/v1"
	pbe "go.buf.build/library/go-grpc/anqa/entity/entity/v1"
	pbi "go.buf.build/library/go-grpc/anqa/id-check/idcheck/v3"
	pbr "go.buf.build/library/go-grpc/anqa/rules-engine/rulesengine/v1"
	pbt "go.buf.build/library/go-grpc/anqa/transaction/transaction/v1"
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

	server := srv.New("mock-data", h)
	if err := server.Start(); err != nil {
		log.Fatalf("error starting server: %v", err)
	}
}

// Register handler with grpc server and http gateway
func (h *Handlers) RegisterHandlers(ctx context.Context, grpcSrv *grpc.Server, httpMux *gw.ServeMux, encConn *nats.EncodedConn) error {

	cconn, err := grpc.Dial(srv.ResolveHost("customer-v1"), grpc.WithInsecure())
	if err != nil {
		return err
	}
	dconn, err := grpc.Dial(srv.ResolveHost("document"), grpc.WithInsecure())
	if err != nil {
		return err
	}
	econn, err := grpc.Dial(srv.ResolveHost("entity"), grpc.WithInsecure())
	if err != nil {
		return err
	}
	iconn, err := grpc.Dial(srv.ResolveHost("id-check"), grpc.WithInsecure())
	if err != nil {
		return err
	}
	rconn, err := grpc.Dial(srv.ResolveHost("rules-engine"), grpc.WithInsecure())
	if err != nil {
		return err
	}
	tconn, err := grpc.Dial(srv.ResolveHost("transaction"), grpc.WithInsecure())
	if err != nil {
		return err
	}

	handler := v1.MockData{
		Store:    store.New(),
		CustSvc:  pbc.NewCustomerServiceClient(cconn),
		DocSvc:   pbd.NewDocumentServiceClient(dconn),
		EntSvc:   pbe.NewEntityServiceClient(econn),
		IDSvc:    pbi.NewIdCheckServiceClient(iconn),
		RulesSvc: pbr.NewRulesEngineServiceClient(rconn),
		TxnSvc:   pbt.NewTransactionServiceClient(tconn),
	}

	pb1.RegisterMockDataServiceServer(grpcSrv, handler)
	pb1.RegisterMockDataServiceHandlerServer(ctx, httpMux, handler)

	return nil
}
