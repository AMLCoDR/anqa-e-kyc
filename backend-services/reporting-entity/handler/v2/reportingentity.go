package v2

import (
	"context"
	"log"

	"github.com/google/uuid"
	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/metadata"
	"google.golang.org/grpc/status"

	"github.com/anqaml/go-svc/md"
	pb "github.com/anqaml/reporting-entity/gen/proto/go/reportingentity/v2"
	"github.com/anqaml/reporting-entity/store"
	pbs "go.buf.build/library/go-grpc/anqa/subscription/subscription/v1"
)

// ReportingEntitys creates a receiver for proto rpc methods
type ReportingEntity struct {
	Store   store.Store
	SubsCli pbs.SubscriptionServiceClient
	pb.UnimplementedReportingEntityServiceServer
}

// Create implements the proto Create rpc request and publishes an reporting entity.created event.
// Note that this service has a different pattern than usual: the context tenant is the
// machine-to-machine API context, NOT the tenant of the new org being created. The body
// of the message contains the new tenant.
func (o ReportingEntity) Create(ctx context.Context, req *pb.CreateRequest) (*pb.CreateResponse, error) {
	user, err := md.Value(ctx, "x-token-c-user")
	if err != nil {
		return &pb.CreateResponse{}, status.Errorf(codes.Aborted, "error: %v", err)
	}

	rpt := &pb.ReportingEntity{
		Id:           uuid.New().String(),
		Name:         req.OrgName,
		ContactName:  req.ContactName,
		ContactEmail: req.ContactEmail,
	}

	// Create the main reporting entity record
	if err := o.Store.Save(ctx, rpt); err != nil {
		return &pb.CreateResponse{}, status.Errorf(codes.Aborted, "error: %v", err)
	}

	// create tenant's subscription in background
	go func() {
		ctx = metadata.NewOutgoingContext(context.Background(),
			metadata.MD{
				"x-token-c-tenant": []string{rpt.Id},
				"x-token-c-user":   []string{user},
			},
		)
		subReq := &pbs.CreateRequest{
			AccountName:  req.OrgName,
			AccountEmail: req.ContactEmail,
		}
		if _, err = o.SubsCli.Create(ctx, subReq); err != nil {
			log.Printf("An error occurred while creating a subscription for %s: %v", rpt.Id, err)
		}
	}()

	return &pb.CreateResponse{
		ReportingEntity: rpt,
	}, nil
}

// Get implements the proto Get method
func (o ReportingEntity) Get(ctx context.Context, req *pb.GetRequest) (*pb.GetResponse, error) {
	org, err := o.Store.Get(ctx)
	if err != nil {
		return &pb.GetResponse{}, status.Errorf(codes.Aborted, "error: %v", err)
	}

	return &pb.GetResponse{
		ReportingEntity: org,
	}, err
}

// Query implements the proto Query method
func (o ReportingEntity) Query(ctx context.Context, req *pb.QueryRequest) (*pb.QueryResponse, error) {
	rsp, err := o.Store.Fetch(req)
	if err != nil {
		return &pb.QueryResponse{}, status.Errorf(codes.Aborted, "error: %v", err)
	}
	return rsp, err
}

// Update implements the proto Update method
func (o ReportingEntity) Update(ctx context.Context, req *pb.UpdateRequest) (*pb.UpdateResponse, error) {
	if err := o.Store.Save(ctx, req.ReportingEntity); err != nil {
		return &pb.UpdateResponse{}, status.Errorf(codes.Aborted, "error: %v", err)
	}
	return &pb.UpdateResponse{
		ReportingEntity: req.ReportingEntity,
	}, nil
}

// Delete implements the proto Delete method
func (o ReportingEntity) Delete(ctx context.Context, req *pb.DeleteRequest) (*pb.DeleteResponse, error) {

	if err := o.Store.Delete(ctx); err != nil {
		return &pb.DeleteResponse{}, status.Errorf(codes.Aborted, "error: %v", err)
	}

	// delete subscription
	octx, err := md.Outgoing(ctx)
	if err != nil {
		return &pb.DeleteResponse{}, status.Errorf(codes.Aborted, "error: %v", err)
	}

	if _, err = o.SubsCli.Delete(octx, &pbs.DeleteRequest{}); err != nil {
		return &pb.DeleteResponse{}, status.Errorf(codes.Aborted, "error: %v", err)
	}

	return &pb.DeleteResponse{}, nil
}
