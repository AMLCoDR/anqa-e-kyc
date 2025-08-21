package handler

import (
	"context"

	pb "github.com/anqaml/vc-issuer/gen/proto/go/vcissuer/v1"
	"github.com/anqaml/vc-issuer/mattr"
	"github.com/anqaml/vc-issuer/store/v1"
	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/status"
)

// VcIssuer type creates a receiver for proto methods below
type VcIssuer struct {
	Store store.Store
	Mattr *mattr.Mattr
	pb.UnimplementedVcIssuerServiceServer
}

func (vi VcIssuer) Create(ctx context.Context, req *pb.CreateRequest) (*pb.CreateResponse, error) {
	// tenant, err := md.Value(ctx, "x-token-c-tenant")
	// if err != nil {
	// 	return &pb.CreateResponse{}, status.Errorf(codes.Aborted, "%v", err)
	// }

	// user, err := md.Value(ctx, "x-token-c-user")
	// if err != nil {
	// 	return &pb.CreateResponse{}, status.Errorf(codes.Aborted, "%v", err)
	// }

	cred, err := vi.Mattr.CreateCredential(req)
	if err != nil {
		return &pb.CreateResponse{}, status.Errorf(codes.Aborted, "%v", err)
	}

	// if err = vi.Store.Create(tenant, user, cred); err != nil {
	// 	return &pb.CreateResponse{}, status.Errorf(codes.Aborted, "%v", err)
	// }

	return &pb.CreateResponse{
		Credential: cred,
	}, nil
}

func (vi VcIssuer) Query(ctx context.Context, req *pb.QueryRequest) (*pb.QueryResponse, error) {
	// tenant, err := md.Value(ctx, "x-token-c-tenant")
	// if err != nil {
	// 	return &pb.QueryResponse{}, status.Errorf(codes.Aborted, "%v", err)
	// }

	ls, err := vi.Mattr.ListCredentials(req.Tag)
	if err != nil {
		return &pb.QueryResponse{}, status.Errorf(codes.Aborted, "%v", err)
	}

	// rsp, err := vi.Store.Fetch(tenant, req)
	// if err != nil {
	// 	return &pb.QueryResponse{}, status.Errorf(codes.Aborted, "%v", err)
	// }

	// return rsp, nil
	return ls, nil
}

func (vi VcIssuer) Get(ctx context.Context, req *pb.GetRequest) (*pb.GetResponse, error) {

	// tenant, err := md.Value(ctx, "x-token-c-tenant")
	// if err != nil {
	// 	return &pb.GetResponse{}, status.Errorf(codes.Aborted, "%v", err)
	// }

	cred, err := vi.Mattr.GetCredential(req.CredentialId)
	if err != nil {
		return &pb.GetResponse{}, status.Errorf(codes.Aborted, "%v", err)
	}

	// ent, err := vi.Store.Get(tenant, req.PersonId)
	// if err != nil {
	// 	return &pb.GetResponse{}, status.Errorf(codes.Aborted, "%v", err)
	// }

	// return &pb.GetResponse{Person: ent}, nil
	return &pb.GetResponse{Credential: cred}, nil
}

func (vi VcIssuer) Delete(ctx context.Context, req *pb.DeleteRequest) (*pb.DeleteResponse, error) {

	// tenant, err := md.Value(ctx, "x-token-c-tenant")
	// if err != nil {
	// 	return &pb.UpdateResponse{}, status.Errorf(codes.Aborted, "%v", err)
	// }

	if err := vi.Mattr.DeleteCredential(req.CredentialId); err != nil {
		return &pb.DeleteResponse{}, status.Errorf(codes.Aborted, "%v", err)
	}
	// user, err := md.Value(ctx, "x-token-c-user")
	// if err != nil {
	// 	return &pb.DeleteResponse{}, status.Errorf(codes.Aborted, "%v", err)
	// }
	// ent := req.Person

	// if err := vi.Store.Update(tenant, user, ent); err != nil {
	// 	return &pb.UpdateResponse{}, status.Errorf(codes.Aborted, "%v", err)
	// }

	// return &pb.DeleteResponse{Person: ent}, nil
	return &pb.DeleteResponse{}, nil
}

func (vi VcIssuer) Verify(ctx context.Context, req *pb.VerifyRequest) (*pb.VerifyResponse, error) {

	// tenant, err := md.Value(ctx, "x-token-c-tenant")
	// if err != nil {
	// 	return &pb.UpdateResponse{}, status.Errorf(codes.Aborted, "%v", err)
	// }
	// user, err := md.Value(ctx, "x-token-c-user")
	// if err != nil {
	// 	return &pb.UpdateResponse{}, status.Errorf(codes.Aborted, "%v", err)
	// }
	// ent := req.Person

	// if err := vi.Store.Update(tenant, user, ent); err != nil {
	// 	return &pb.UpdateResponse{}, status.Errorf(codes.Aborted, "%v", err)
	// }

	// return &pb.UpdateResponse{Person: ent}, nil
	return &pb.VerifyResponse{}, nil
}
