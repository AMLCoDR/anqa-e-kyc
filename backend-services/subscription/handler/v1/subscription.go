package v1

import (
	"context"
	"fmt"
	"strconv"

	"github.com/stripe/stripe-go/v72"
	"github.com/stripe/stripe-go/v72/billingportal/session"
	"github.com/stripe/stripe-go/v72/customer"
	"github.com/stripe/stripe-go/v72/price"
	"github.com/stripe/stripe-go/v72/product"
	"github.com/stripe/stripe-go/v72/sub"

	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/status"

	"github.com/anqaml/go-svc/md"
	pb "github.com/anqaml/subscription/gen/proto/go/subscription/v1"
	"github.com/anqaml/subscription/store"
)

// Subscriptions type creates a receiver for proto rpc methods below
type Subscription struct {
	Store store.Store
	pb.UnimplementedSubscriptionServiceServer
}

var planKeys = map[pb.PlanType]string{
	pb.PlanType_PLAN_TYPE_STARTER:      "starter_monthly",
	pb.PlanType_PLAN_TYPE_PROFESSIONAL: "professional_monthly",
	pb.PlanType_PLAN_TYPE_PREMIUM:      "premium_monthly",
}

const trialDays = 21

// Create registers the an org as a Stripe customer and records the trial start
func (s Subscription) Create(ctx context.Context, req *pb.CreateRequest) (*pb.CreateResponse, error) {

	// make sure we don't create a duplicate subscription
	ex, err := s.Store.Get(ctx)
	if err != nil {
		return &pb.CreateResponse{}, status.Errorf(codes.Aborted, "error: %v", err)
	}
	if ex != nil && ex.StripeCustId != "" {
		return &pb.CreateResponse{}, status.Errorf(codes.AlreadyExists, "subscription already exists for tenant")
	}

	// metatdata
	tenant, err := md.Value(ctx, "x-token-c-tenant")
	if err != nil {
		return &pb.CreateResponse{}, status.Errorf(codes.Aborted, "error: %v", err)
	}
	md := map[string]string{
		"tenant": tenant,
	}

	// create customer
	cp := &stripe.CustomerParams{
		Name:  &req.AccountName,
		Email: &req.AccountEmail,
	}
	cp.Metadata = md

	stripeCust, err := customer.New(cp)
	if err != nil {
		return &pb.CreateResponse{}, status.Errorf(codes.Aborted, "error: %v", err)
	}

	// get price using Stripe plan key
	if req.PlanType == pb.PlanType_PLAN_TYPE_UNSPECIFIED {
		req.PlanType = pb.PlanType_PLAN_TYPE_PREMIUM
	}

	planKey := planKeys[req.PlanType]
	pp := &stripe.PriceListParams{
		LookupKeys: []*string{stripe.String(planKey)},
	}
	pl := price.List(pp)
	if !pl.Next() {
		return &pb.CreateResponse{}, fmt.Errorf("error looking up price with key: %s", planKey)
	}
	prc := pl.Current().(*stripe.Price)

	// subscribe customer to trial of premium plan
	sp := &stripe.SubscriptionParams{
		Customer: &stripeCust.ID,
		Items: []*stripe.SubscriptionItemsParams{{
			Plan: stripe.String(prc.ID),
		}},
		TrialPeriodDays: stripe.Int64(trialDays),
	}
	sp.Metadata = md

	stripeSbn, err := sub.New(sp)
	if err != nil {
		return &pb.CreateResponse{}, status.Errorf(codes.Aborted, "error: %v", err)
	}

	// get plan quotas
	stripePlan := stripeSbn.Items.Data[0].Plan
	if stripePlan == nil {
		return &pb.CreateResponse{}, status.Error(codes.NotFound, "empty subscription")
	}
	prod, err := product.Get(stripePlan.Product.ID, nil)
	if err != nil {
		return &pb.CreateResponse{}, status.Errorf(codes.Aborted, "error: %v", err)
	}
	checks, err := strconv.Atoi(prod.Metadata["id_checks"])
	if err != nil {
		checks = 0
	}
	txns, err := strconv.Atoi(prod.Metadata["transactions"])
	if err != nil {
		txns = 0
	}

	// save locally
	sbn := &pb.Subscription{
		StripeCustId: stripeCust.ID,
		StripeSubnId: stripeSbn.ID,
		Status:       pb.Status_STATUS_TRIAL,
		Plan: &pb.Subscription_Plan{
			Type: req.PlanType,
			Quota: &pb.Subscription_Plan_Quota{
				IdChecks:     int32(checks),
				Transactions: int32(txns),
			},
		},
	}

	if err := s.Store.Save(ctx, sbn); err != nil {
		return &pb.CreateResponse{}, status.Errorf(codes.Aborted, "error: %v", err)
	}

	return &pb.CreateResponse{}, nil
}

// GetPlan returns information about the organisation's current plan and quota
func (s Subscription) Get(ctx context.Context, req *pb.GetRequest) (*pb.GetResponse, error) {

	// get org's Stripe subscription
	sbn, err := s.Store.Get(ctx)
	if err != nil {
		return &pb.GetResponse{}, status.Errorf(codes.Aborted, "error: %v", err)
	}

	return &pb.GetResponse{
		Subscription: sbn,
	}, nil
}

// AccessPortal is used to create a Stripe customer portal session so users can access and update
// plan and billing information
func (s Subscription) AccessPortal(ctx context.Context, req *pb.AccessPortalRequest) (*pb.AccessPortalResponse, error) {

	// get org's Stripe subscription
	sbn, err := s.Store.Get(ctx)
	if err != nil {
		return &pb.AccessPortalResponse{}, status.Errorf(codes.Aborted, "error: %v", err)
	}

	// get web origin
	origin, err := md.Value(ctx, "origin")
	if err != nil {
		return &pb.AccessPortalResponse{}, status.Errorf(codes.Aborted, "error: %v", err)
	}

	// create portal session
	params := &stripe.BillingPortalSessionParams{
		Customer:  &sbn.StripeCustId,
		ReturnURL: stripe.String(origin + req.ReturnPath),
	}

	ssn, err := session.New(params)
	if err != nil {
		return &pb.AccessPortalResponse{}, status.Errorf(codes.Aborted, "error: %v", err)
	}

	return &pb.AccessPortalResponse{
		Url: ssn.URL,
	}, nil
}

// Delete deletes a customer from Stripe cancelling their subscription and soft deletes from SQL
func (s Subscription) Delete(ctx context.Context, req *pb.DeleteRequest) (*pb.DeleteResponse, error) {

	sbn, err := s.Store.Get(ctx)
	if err != nil {
		return &pb.DeleteResponse{}, status.Errorf(codes.Aborted, "error: %v", err)
	}

	// delete customer from Stripe
	c, err := customer.Del(sbn.StripeCustId, nil)
	if err != nil || !c.Deleted {
		return &pb.DeleteResponse{}, status.Errorf(codes.Aborted, "error: %v", err)
	}

	// delete subscription from database
	err = s.Store.Delete(ctx)
	if err != nil {
		return &pb.DeleteResponse{}, status.Errorf(codes.Aborted, "error: %v", err)
	}

	return &pb.DeleteResponse{}, nil
}
