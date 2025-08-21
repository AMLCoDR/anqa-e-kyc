package handler

import (
	"context"

	"github.com/google/uuid"
	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/status"

	pb "github.com/anqaml/identity/gen/proto/go/identity/v1"
	"github.com/anqaml/identity/store/v1"
)

// Identity type creates a receiver for proto methods below
type Identity struct {
	Store store.Store
	pb.UnimplementedIdentityServiceServer
}

func (i Identity) Create(ctx context.Context, req *pb.CreateRequest) (*pb.CreateResponse, error) {

	p := req.Identity
	p.Id = uuid.New().String()

	rsp, err := i.Store.Create(ctx, p)
	if err != nil {
		return &pb.CreateResponse{}, status.Errorf(codes.Aborted, "%v", err)
	}

	return &pb.CreateResponse{Identity: rsp}, nil
}

func (i Identity) Query(ctx context.Context, req *pb.QueryRequest) (*pb.QueryResponse, error) {

	rsp, err := i.Store.Fetch(ctx, req)
	if err != nil {
		return &pb.QueryResponse{}, status.Errorf(codes.Aborted, "%v", err)
	}

	return rsp, nil
}

func (i Identity) Get(ctx context.Context, req *pb.GetRequest) (*pb.GetResponse, error) {

	rsp, err := i.Store.Get(ctx, req.IdentityId)
	if err != nil {
		return &pb.GetResponse{}, status.Errorf(codes.Aborted, "%v", err)
	}

	return &pb.GetResponse{Identity: rsp}, nil
}

func (i Identity) Update(ctx context.Context, req *pb.UpdateRequest) (*pb.UpdateResponse, error) {

	ident := req.Identity

	if err := i.Store.Update(ctx, ident); err != nil {
		return &pb.UpdateResponse{}, status.Errorf(codes.Aborted, "%v", err)
	}

	return &pb.UpdateResponse{Identity: ident}, nil
}

func (i Identity) Delete(ctx context.Context, req *pb.DeleteRequest) (*pb.DeleteResponse, error) {

	if err := i.Store.Delete(ctx, req); err != nil {
		return &pb.DeleteResponse{}, status.Errorf(codes.Aborted, "%v", err)
	}

	return &pb.DeleteResponse{}, nil
}

func (i Identity) AddAlias(ctx context.Context, req *pb.AddAliasRequest) (*pb.AddAliasResponse, error) {

	req.Alias.Id = uuid.New().String()

	if err := i.Store.AddAlias(ctx, req); err != nil {
		return &pb.AddAliasResponse{}, status.Errorf(codes.Aborted, "%v", err)
	}

	return &pb.AddAliasResponse{}, nil
}

func (i Identity) RemoveAlias(ctx context.Context, req *pb.RemoveAliasRequest) (*pb.RemoveAliasResponse, error) {

	if err := i.Store.RemoveAlias(ctx, req); err != nil {
		return &pb.RemoveAliasResponse{}, status.Errorf(codes.Aborted, "%v", err)
	}

	return &pb.RemoveAliasResponse{}, nil
}

func (i Identity) AddCredential(ctx context.Context, req *pb.AddCredentialRequest) (*pb.AddCredentialResponse, error) {

	if err := i.Store.AddCredential(ctx, req); err != nil {
		return &pb.AddCredentialResponse{}, status.Errorf(codes.Aborted, "%v", err)
	}

	return &pb.AddCredentialResponse{}, nil
}

func (i Identity) RemoveCredential(ctx context.Context, req *pb.RemoveCredentialRequest) (*pb.RemoveCredentialResponse, error) {

	if err := i.Store.RemoveCredential(ctx, req); err != nil {
		return &pb.RemoveCredentialResponse{}, status.Errorf(codes.Aborted, "%v", err)
	}

	return &pb.RemoveCredentialResponse{}, nil
}
