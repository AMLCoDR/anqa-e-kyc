package handler

import (
	"context"

	"github.com/google/uuid"
	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/status"

	pb "github.com/anqaml/customer-v1/gen/proto/go/customer/v1beta1"
	"github.com/anqaml/customer-v1/store/v1"
)

// Customer type creates a receiver for proto methods below
type Customer struct {
	Store store.Store
	pb.UnimplementedCustomerServiceServer
}

// Add implements the proto Add request. See proto/customer for more detail.
func (e Customer) Add(ctx context.Context, req *pb.AddRequest) (*pb.AddResponse, error) {
	ent := req.Customer
	ent.Id = uuid.New().String()

	rsp, err := e.Store.Add(ctx, ent)
	if err != nil {
		return &pb.AddResponse{}, status.Errorf(codes.Aborted, "error: %v", err)
	}

	return &pb.AddResponse{Customer: rsp}, nil
}

// Get implements the proto Get request. See proto/customer for more detail.
func (e Customer) Query(ctx context.Context, req *pb.QueryRequest) (*pb.QueryResponse, error) {
	rsp, err := e.Store.Fetch(ctx, req)
	if err != nil {
		return &pb.QueryResponse{}, status.Errorf(codes.Aborted, "error: %v", err)
	}
	return rsp, nil
}

// Get implements the proto Get icc request. See proto/customer for more detail.
func (e Customer) Get(ctx context.Context, req *pb.GetRequest) (*pb.GetResponse, error) {
	ent, err := e.Store.Get(ctx, req.CustomerId)
	if err != nil {
		return &pb.GetResponse{}, status.Errorf(codes.Aborted, "error: %v", err)
	}
	return &pb.GetResponse{Customer: ent}, nil
}

// Add implements the proto Add request. See proto/customer for more detail.
func (e Customer) Update(ctx context.Context, req *pb.UpdateRequest) (*pb.UpdateResponse, error) {
	ent := req.Customer
	if err := e.Store.Update(ctx, ent); err != nil {
		return &pb.UpdateResponse{}, status.Errorf(codes.Aborted, "error: %v", err)
	}
	return &pb.UpdateResponse{Customer: ent}, nil
}

// SetRisk implements the proto SetRisk rpc request. See proto/customer for more detail.
func (e Customer) SetRisk(ctx context.Context, req *pb.SetRiskRequest) (*pb.SetRiskResponse, error) {
	if err := e.Store.UpdateRisk(ctx, req); err != nil {
		return &pb.SetRiskResponse{}, status.Errorf(codes.Aborted, "error: %v", err)
	}
	return &pb.SetRiskResponse{}, nil
}

// Delete implements the proto Delete service. See proto/customer for more detail.
func (e Customer) Delete(ctx context.Context, req *pb.DeleteRequest) (*pb.DeleteResponse, error) {
	if err := e.Store.Delete(ctx, req); err != nil {
		return &pb.DeleteResponse{}, status.Errorf(codes.Aborted, "error: %v", err)
	}
	return &pb.DeleteResponse{}, nil
}
