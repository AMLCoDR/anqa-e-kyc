package server

import (
	"context"
	"log"
	"os"

	auth "github.com/envoyproxy/go-control-plane/envoy/service/auth/v3"
	gw "github.com/grpc-ecosystem/grpc-gateway/v2/runtime"
	"github.com/nats-io/nats.go"
	"github.com/stripe/stripe-go/v72"
	"google.golang.org/grpc"

	"github.com/anqaml/go-svc/srv"
	pb1 "github.com/anqaml/subscription/gen/proto/go/subscription/v1"
	v1 "github.com/anqaml/subscription/handler/v1"
	s1 "github.com/anqaml/subscription/store"
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

	nometa := srv.WithNoMDPath(
		"/envoy.service.auth.v3.Authorization/Check",
		"/subscription.v1.WebhookService/Customer",
		"/subscription.v1.WebhookService/Subscription",
	)
	server := srv.New("subscription", h, nometa)
	if err := server.Start(); err != nil {
		log.Fatalf("error starting server: %v", err)
	}
}

// Register handler with grpc server and http gateway
func (h *Handlers) RegisterHandlers(ctx context.Context, grpcSrv *grpc.Server, httpMux *gw.ServeMux, encConn *nats.EncodedConn) error {

	stripe.Key = os.Getenv("STRIPE_KEY")
	store, err := s1.New(
		os.Getenv("MONGODB_USER"),
		os.Getenv("MONGODB_PWD"),
		os.Getenv("MONGODB_HOST"),
	)
	if err != nil {
		return err
	}

	subHandler := v1.Subscription{Store: store}
	whHandler := &v1.Webhook{Store: store}
	authHandler := &v1.Authz{
		CustSecret: os.Getenv("STRIPE_WHSEC_CUST"),
		SubnSecret: os.Getenv("STRIPE_WHSEC_SUBN"),
	}

	pb1.RegisterSubscriptionServiceServer(grpcSrv, &subHandler)
	pb1.RegisterWebhookServiceServer(grpcSrv, whHandler)
	auth.RegisterAuthorizationServer(grpcSrv, authHandler)
	pb1.RegisterSubscriptionServiceHandlerServer(ctx, httpMux, subHandler)
	pb1.RegisterWebhookServiceHandlerServer(ctx, httpMux, whHandler)

	return nil
}
