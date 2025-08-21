package v1

import (
	"context"

	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/metadata"
	"google.golang.org/grpc/status"

	"github.com/anqaml/go-svc/md"
	pb "github.com/anqaml/subscription/gen/proto/go/subscription/v1"
	"github.com/anqaml/subscription/store"
)

// Webhooks type creates a receiver for proto rpc methods below
type Webhook struct {
	Store store.Store
	pb.UnimplementedWebhookServiceServer
}

// Customer processes Stripe customer events subscribed to
func (w Webhook) Customer(ctx context.Context, req *pb.CustomerRequest) (*pb.CustomerResponse, error) {

	verified, err := md.Value(ctx, "x-stripe-verified")
	if err != nil {
		return &pb.CustomerResponse{},
			status.Errorf(codes.Aborted, "error getting signature verification header: %v", err)
	}
	if verified == "" {
		return &pb.CustomerResponse{},
			status.Errorf(codes.Aborted, "signature verification is missing: %v", err)
	}

	return &pb.CustomerResponse{}, nil
}

// Subscription handles Stripe subscription events subscribed to
func (w Webhook) Subscription(ctx context.Context, req *pb.SubscriptionRequest) (*pb.SubscriptionResponse, error) {

	verified, err := md.Value(ctx, "x-stripe-verified")
	if err != nil {
		return &pb.SubscriptionResponse{},
			status.Errorf(codes.Aborted, "error getting signature verification header: %v", err)
	}
	if verified == "" {
		return &pb.SubscriptionResponse{},
			status.Errorf(codes.Aborted, "signature verification is missing: %v", err)
	}

	// respond to Stripe subscription event
	switch req.Type {
	case "customer.subscription.created":
		// create subscription
	case "customer.subscription.updated":
		// update subscription
	case "customer.subscription.deleted":
		// cancel subscription
	case "customer.subscription.trial_will_end":
		w.trialWillEnd(req)
	}

	// save status change
	if err := w.updateStatus(req); err != nil {
		return &pb.SubscriptionResponse{}, status.Errorf(codes.Aborted, "error: %v", err)
	}

	return &pb.SubscriptionResponse{}, nil
}

func (w Webhook) updateStatus(req *pb.SubscriptionRequest) error {

	ctx := metadata.NewIncomingContext(
		context.Background(),
		metadata.MD{
			"x-token-c-tenant": []string{req.Data.Object.Metadata.Tenant},
			"x-token-c-user":   []string{"Stripe Webhook"},
		},
	)

	// get locally stored attributes
	sbn, err := w.Store.Get(ctx)
	if err != nil {
		return err
	}
	if sbn.StripeCustId == "" {
		return nil
	}

	// save status changes
	switch req.Data.Object.Status {
	case "trialing":
		sbn.Status = pb.Status_STATUS_TRIAL
	case "active":
		sbn.Status = pb.Status_STATUS_ACTIVE
	default: // incomplete, incomplete_expired, past_due, canceled, or unpaid.
		sbn.Status = pb.Status_STATUS_INACTIVE
	}

	return w.Store.Save(ctx, sbn)
}

func (w Webhook) trialWillEnd(req *pb.SubscriptionRequest) error {

	// send trial end notification

	//req.Data.Object.TrialEnd == 1614563037

	return nil
}
