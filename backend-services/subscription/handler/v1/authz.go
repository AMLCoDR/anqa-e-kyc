package v1

import (
	"context"
	"fmt"

	core "github.com/envoyproxy/go-control-plane/envoy/config/core/v3"
	pb "github.com/envoyproxy/go-control-plane/envoy/service/auth/v3"
	"github.com/stripe/stripe-go/v72/webhook"

	"google.golang.org/genproto/googleapis/rpc/code"
	"google.golang.org/genproto/googleapis/rpc/status"
	"google.golang.org/protobuf/types/known/wrapperspb"
)

// Authz type creates a receiver for proto rpc methods below
type Authz struct {
	CustSecret string
	SubnSecret string
}

// Check processes Stripe customer events subscribed to
func (a Authz) Check(ctx context.Context, req *pb.CheckRequest) (*pb.CheckResponse, error) {
	http := req.Attributes.Request.Http

	var secret string
	if http.Headers[":path"] == "/subscription/v1/webhook/subscription" {
		secret = a.SubnSecret
	} else if http.Headers[":path"] == "/subscription/v1/webhook/customer" {
		secret = a.CustSecret
	}

	_, err := webhook.ConstructEvent(http.RawBody, http.Headers["stripe-signature"], secret)
	if err != nil {
		// reject request
		return &pb.CheckResponse{
			Status: &status.Status{
				Code:    int32(code.Code_PERMISSION_DENIED),
				Message: fmt.Sprintf("Issue validating request: %v", err),
			},
		}, nil
	}

	// accept request
	return &pb.CheckResponse{
		HttpResponse: &pb.CheckResponse_OkResponse{
			OkResponse: &pb.OkHttpResponse{
				Headers: []*core.HeaderValueOption{
					{
						Append: &wrapperspb.BoolValue{Value: false},
						Header: &core.HeaderValue{Key: "x-stripe-verified", Value: "true"},
					},
				},
			},
		},
		Status: &status.Status{
			Code: int32(code.Code_OK),
		},
	}, nil
}
