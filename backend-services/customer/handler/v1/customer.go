package handler

import (
	"context"

	"github.com/google/uuid"
	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/status"

	pb "github.com/anqaml/customer/gen/proto/go/customer/v1"
	"github.com/anqaml/customer/store/v1"
)

// Customer type creates a receiver for proto methods below
type Customer struct {
	Store store.Store
	pb.UnimplementedCustomerServiceServer
}

func (c Customer) Create(ctx context.Context, req *pb.CreateRequest) (*pb.CreateResponse, error) {
	cust := req.Customer
	cust.Id = uuid.New().String()

	rsp, err := c.Store.Create(ctx, cust)
	if err != nil {
		return &pb.CreateResponse{}, status.Errorf(codes.Aborted, "%v", err)
	}
	return &pb.CreateResponse{Customer: rsp}, nil
}

func (c Customer) Query(ctx context.Context, req *pb.QueryRequest) (*pb.QueryResponse, error) {
	rsp, err := c.Store.Fetch(ctx, req)
	if err != nil {
		return &pb.QueryResponse{}, status.Errorf(codes.Aborted, "%v", err)
	}
	return rsp, nil
}

func (c Customer) Get(ctx context.Context, req *pb.GetRequest) (*pb.GetResponse, error) {
	cust, err := c.Store.Get(ctx, req.CustomerId)
	if err != nil {
		return &pb.GetResponse{}, status.Errorf(codes.Aborted, "%v", err)
	}
	return &pb.GetResponse{Customer: cust}, nil
}

func (c Customer) Update(ctx context.Context, req *pb.UpdateRequest) (*pb.UpdateResponse, error) {
	cust := req.Customer
	if err := c.Store.Update(ctx, cust); err != nil {
		return &pb.UpdateResponse{}, status.Errorf(codes.Aborted, "%v", err)
	}
	return &pb.UpdateResponse{Customer: cust}, nil
}

func (c Customer) SetRisk(ctx context.Context, req *pb.SetRiskRequest) (*pb.SetRiskResponse, error) {
	if err := c.Store.UpdateRisk(ctx, req); err != nil {
		return &pb.SetRiskResponse{}, status.Errorf(codes.Aborted, "%v", err)
	}

	return &pb.SetRiskResponse{}, nil
}

func (c Customer) Delete(ctx context.Context, req *pb.DeleteRequest) (*pb.DeleteResponse, error) {
	if err := c.Store.Delete(ctx, req); err != nil {
		return &pb.DeleteResponse{}, status.Errorf(codes.Aborted, "%v", err)
	}
	return &pb.DeleteResponse{}, nil
}

func (c Customer) AddKeyPerson(ctx context.Context, req *pb.AddKeyPersonRequest) (*pb.AddKeyPersonResponse, error) {
	// if err := c.Store.Delete(ctx, req); err != nil {
	// 	return &pb.AddKeyPersonResponse{}, status.Errorf(codes.Aborted, "%v", err)
	// }
	return &pb.AddKeyPersonResponse{}, nil
}

func (c Customer) RemoveKeyPerson(ctx context.Context, req *pb.RemoveKeyPersonRequest) (*pb.RemoveKeyPersonResponse, error) {
	// if err := c.Store.Delete(ctx, req); err != nil {
	// 	return &pb.RemoveKeyPersonResponse{}, status.Errorf(codes.Aborted, "%v", err)
	// }
	return &pb.RemoveKeyPersonResponse{}, nil
}