package handler

import (
	"context"

	"github.com/google/uuid"
	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/status"

	"github.com/anqaml/go-svc/md"
	pb "github.com/anqaml/key-person/gen/proto/go/keyperson/v1"
	"github.com/anqaml/key-person/store/v1"
	pbv "go.buf.build/library/go-grpc/anqa/vc-issuer/vcissuer/v1"
)

// KeyPerson type creates a receiver for proto methods below
type KeyPerson struct {
	Store store.Store
	pb.UnimplementedKeyPersonServiceServer
}

func (kp KeyPerson) Create(ctx context.Context, req *pb.CreateRequest) (*pb.CreateResponse, error) {

	tenant, err := md.Value(ctx, "x-token-c-tenant")
	if err != nil {
		return &pb.CreateResponse{}, status.Errorf(codes.Aborted, "%v", err)
	}
	user, err := md.Value(ctx, "x-token-c-user")
	if err != nil {
		return &pb.CreateResponse{}, status.Errorf(codes.Aborted, "%v", err)
	}

	p := req.Person
	p.Id = uuid.New().String()

	rsp, err := kp.Store.Create(tenant, user, p)
	if err != nil {
		return &pb.CreateResponse{}, status.Errorf(codes.Aborted, "%v", err)
	}

	return &pb.CreateResponse{Person: rsp}, nil
}

func (kp KeyPerson) Query(ctx context.Context, req *pb.QueryRequest) (*pb.QueryResponse, error) {
	tenant, err := md.Value(ctx, "x-token-c-tenant")
	if err != nil {
		return &pb.QueryResponse{}, status.Errorf(codes.Aborted, "%v", err)
	}

	rsp, err := kp.Store.Fetch(tenant, req)
	if err != nil {
		return &pb.QueryResponse{}, status.Errorf(codes.Aborted, "%v", err)
	}

	return rsp, nil
}

func (kp KeyPerson) Get(ctx context.Context, req *pb.GetRequest) (*pb.GetResponse, error) {

	tenant, err := md.Value(ctx, "x-token-c-tenant")
	if err != nil {
		return &pb.GetResponse{}, status.Errorf(codes.Aborted, "%v", err)
	}

	ent, err := kp.Store.Get(tenant, req.PersonId)
	if err != nil {
		return &pb.GetResponse{}, status.Errorf(codes.Aborted, "%v", err)
	}

	return &pb.GetResponse{Person: ent}, nil
}

func (kp KeyPerson) Update(ctx context.Context, req *pb.UpdateRequest) (*pb.UpdateResponse, error) {

	tenant, err := md.Value(ctx, "x-token-c-tenant")
	if err != nil {
		return &pb.UpdateResponse{}, status.Errorf(codes.Aborted, "%v", err)
	}
	user, err := md.Value(ctx, "x-token-c-user")
	if err != nil {
		return &pb.UpdateResponse{}, status.Errorf(codes.Aborted, "%v", err)
	}
	ent := req.Person

	if err := kp.Store.Update(tenant, user, ent); err != nil {
		return &pb.UpdateResponse{}, status.Errorf(codes.Aborted, "%v", err)
	}

	return &pb.UpdateResponse{Person: ent}, nil
}

func (kp KeyPerson) SetRisk(ctx context.Context, req *pb.SetRiskRequest) (*pb.SetRiskResponse, error) {

	tenant, err := md.Value(ctx, "x-token-c-tenant")
	if err != nil {
		return &pb.SetRiskResponse{}, status.Errorf(codes.Aborted, "%v", err)
	}
	user, err := md.Value(ctx, "x-token-c-user")
	if err != nil {
		return &pb.SetRiskResponse{}, status.Errorf(codes.Aborted, "%v", err)
	}

	if err := kp.Store.UpdateRisk(tenant, user, req); err != nil {
		return &pb.SetRiskResponse{}, status.Errorf(codes.Aborted, "%v", err)
	}

	return &pb.SetRiskResponse{}, nil
}

func (kp KeyPerson) Delete(ctx context.Context, req *pb.DeleteRequest) (*pb.DeleteResponse, error) {

	tenant, err := md.Value(ctx, "x-token-c-tenant")
	if err != nil {
		return &pb.DeleteResponse{}, status.Errorf(codes.Aborted, "%v", err)
	}
	user, err := md.Value(ctx, "x-token-c-user")
	if err != nil {
		return &pb.DeleteResponse{}, status.Errorf(codes.Aborted, "%v", err)
	}

	if err := kp.Store.Delete(tenant, user, req); err != nil {
		return &pb.DeleteResponse{}, status.Errorf(codes.Aborted, "%v", err)
	}

	return &pb.DeleteResponse{}, nil
}

func (kp KeyPerson) Certify(ctx context.Context, req *pb.CertifyRequest) (*pb.CertifyResponse, error) {

	tenant, err := md.Value(ctx, "x-token-c-tenant")
	if err != nil {
		return &pb.CertifyResponse{}, status.Errorf(codes.Aborted, "%v", err)
	}
	user, err := md.Value(ctx, "x-token-c-user")
	if err != nil {
		return &pb.CertifyResponse{}, status.Errorf(codes.Aborted, "%v", err)
	}

	var cert *pbv.Credential

	if err := kp.Store.AddCertificate(tenant, user, req.PersonId, cert); err != nil {
		return &pb.CertifyResponse{}, status.Errorf(codes.Aborted, "%v", err)
	}

	return &pb.CertifyResponse{}, nil
}

func (kp KeyPerson) Decertify(ctx context.Context, req *pb.DecertifyRequest) (*pb.DecertifyResponse, error) {

	tenant, err := md.Value(ctx, "x-token-c-tenant")
	if err != nil {
		return &pb.DecertifyResponse{}, status.Errorf(codes.Aborted, "%v", err)
	}
	user, err := md.Value(ctx, "x-token-c-user")
	if err != nil {
		return &pb.DecertifyResponse{}, status.Errorf(codes.Aborted, "%v", err)
	}

	if err := kp.Store.RemoveCertificate(tenant, user, req); err != nil {
		return &pb.DecertifyResponse{}, status.Errorf(codes.Aborted, "%v", err)
	}

	return &pb.DecertifyResponse{}, nil
}
