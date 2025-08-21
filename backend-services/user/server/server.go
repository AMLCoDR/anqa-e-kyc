package server

import (
	"context"
	"log"
	"os"

	gw "github.com/grpc-ecosystem/grpc-gateway/v2/runtime"
	"github.com/nats-io/nats.go"
	"google.golang.org/grpc"

	"github.com/anqaml/go-svc/srv"
	"github.com/anqaml/user/ac"
	"github.com/anqaml/user/auth0"
	pb1 "github.com/anqaml/user/gen/proto/go/user/v1"
	v1 "github.com/anqaml/user/handler/v1"
	s1 "github.com/anqaml/user/store"
	pbr "go.buf.build/library/go-grpc/anqa/reporting-entity/reportingentity/v2"
)

// Handlers is used to implement the srv.HandlerRegisterer interface
type Handlers struct {}

type Option func(*Handlers)

// Serve starts the gRPC server and HTTP gateway
func Serve(opts ...Option) {
	h := &Handlers{}
	// for _, opt := range opts {
	// 	opt(h)
	// }

	server := srv.New("user", h, srv.WithNoMDPath("/user.v1.UserService/SignUp"))
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

	acmpgn := ac.New("https://anqaml.api-us1.com/api/3/", os.Getenv("AC_TOKEN"))
	auth0 := auth0.New(
		os.Getenv("AUTH0_CLIENTID"),
		os.Getenv("AUTH0_SECRET"),
		os.Getenv("AUTH0_DOMAIN"),
	)

	rconn, err := grpc.Dial(srv.ResolveHost("reporting-entity"), grpc.WithInsecure())
	if err != nil {
		return err
	}

	handler := &v1.Users{
		Store:  store,
		Ac:     acmpgn,
		IDM:    auth0,
		OrgCli: pbr.NewReportingEntityServiceClient(rconn),
		Broker: encConn,
	}

	pb1.RegisterUserServiceServer(grpcSrv, handler)
	pb1.RegisterUserServiceHandlerServer(ctx, httpMux, handler)

	return nil
}
