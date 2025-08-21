package handler

import (
	"context"

	"github.com/google/uuid"
	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/status"

	"github.com/anqaml/go-svc/md"
	pb "github.com/anqaml/id-verifier/gen/proto/go/idverifier/v1"
	"github.com/anqaml/id-verifier/store/v1"
)

// IdVerifier type creates a receiver for proto methods below
type IdVerifier struct {
	Store store.Store
	pb.UnimplementedIdVerifierServiceServer
}

// Create implements the proto Create request. See proto/entity for more detail.
func (i IdVerifier) Create(ctx context.Context, req *pb.CreateRequest) (*pb.CreateResponse, error) {

	tenant, err := md.Value(ctx, "x-token-c-tenant")
	if err != nil {
		return &pb.CreateResponse{}, status.Errorf(codes.Aborted, "%v", err)
	}
	user, err := md.Value(ctx, "x-token-c-user")
	if err != nil {
		return &pb.CreateResponse{}, status.Errorf(codes.Aborted, "%v", err)
	}

	p := req.Verifier
	p.Id = uuid.New().String()

	rsp, err := i.Store.Create(tenant, user, p)
	if err != nil {
		return &pb.CreateResponse{}, status.Errorf(codes.Aborted, "%v", err)
	}

	return &pb.CreateResponse{Verifier: rsp}, nil
}

// Get implements the proto Get request. See proto/entity for more detail.
func (i IdVerifier) Query(ctx context.Context, req *pb.QueryRequest) (*pb.QueryResponse, error) {
	tenant, err := md.Value(ctx, "x-token-c-tenant")
	if err != nil {
		return &pb.QueryResponse{}, status.Errorf(codes.Aborted, "%v", err)
	}

	rsp, err := i.Store.Fetch(tenant, req)
	if err != nil {
		return &pb.QueryResponse{}, status.Errorf(codes.Aborted, "%v", err)
	}

	return rsp, nil
}

// Get implements the proto Get icc request. See proto/entity for more detail.
func (i IdVerifier) Get(ctx context.Context, req *pb.GetRequest) (*pb.GetResponse, error) {

	tenant, err := md.Value(ctx, "x-token-c-tenant")
	if err != nil {
		return &pb.GetResponse{}, status.Errorf(codes.Aborted, "%v", err)
	}

	rsp, err := i.Store.Get(tenant, req.VerifierId)
	if err != nil {
		return &pb.GetResponse{}, status.Errorf(codes.Aborted, "%v", err)
	}

	return &pb.GetResponse{Verifier: rsp}, nil
}

// Add implements the proto Add request. See proto/entity for more detail.
func (i IdVerifier) Update(ctx context.Context, req *pb.UpdateRequest) (*pb.UpdateResponse, error) {

	tenant, err := md.Value(ctx, "x-token-c-tenant")
	if err != nil {
		return &pb.UpdateResponse{}, status.Errorf(codes.Aborted, "%v", err)
	}
	user, err := md.Value(ctx, "x-token-c-user")
	if err != nil {
		return &pb.UpdateResponse{}, status.Errorf(codes.Aborted, "%v", err)
	}
	id := req.Verifier

	if err := i.Store.Update(tenant, user, id); err != nil {
		return &pb.UpdateResponse{}, status.Errorf(codes.Aborted, "%v", err)
	}

	return &pb.UpdateResponse{Verifier: id}, nil
}

// Delete implements the proto Delete service. See proto/entity for more detail.
func (i IdVerifier) Delete(ctx context.Context, req *pb.DeleteRequest) (*pb.DeleteResponse, error) {

	tenant, err := md.Value(ctx, "x-token-c-tenant")
	if err != nil {
		return &pb.DeleteResponse{}, status.Errorf(codes.Aborted, "%v", err)
	}
	user, err := md.Value(ctx, "x-token-c-user")
	if err != nil {
		return &pb.DeleteResponse{}, status.Errorf(codes.Aborted, "%v", err)
	}

	if err := i.Store.Delete(tenant, user, req); err != nil {
		return &pb.DeleteResponse{}, status.Errorf(codes.Aborted, "%v", err)
	}

	return &pb.DeleteResponse{}, nil
}
