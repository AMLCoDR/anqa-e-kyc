package handler

import (
	"context"

	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/status"

	"github.com/anqaml/go-svc/md"
	pb "github.com/anqaml/kyc-certifier/gen/proto/go/kyccertifier/v1"
	"github.com/anqaml/kyc-certifier/store/v1"
	pbc "go.buf.build/library/go-grpc/anqa/customer/customer/v1"
	pbv "go.buf.build/library/go-grpc/anqa/id-verifier/idverifier/v1"
	pbi "go.buf.build/library/go-grpc/anqa/identity/identity/v1"
)

// KycCertifier type creates a receiver for proto methods below
type KycCertifier struct {
	IdentSvc pbi.IdentityServiceClient
	CustSvc  pbc.CustomerServiceClient
	IdVerSvc   pbv.IdVerifierServiceClient
	Store    store.Store
	pb.UnimplementedKycCertifierServiceServer
}

func (kc KycCertifier) NewPerson(ctx context.Context, req *pb.NewPersonRequest) (*pb.NewPersonResponse, error) {
	octx, err := md.Outgoing(ctx)
	if err != nil {
		return &pb.NewPersonResponse{}, status.Errorf(codes.Aborted, "%v", err)
	}

	// create identity
	ireq := &pbi.CreateRequest{
		Identity: &pbi.Identity{
			Consented: req.Consented,
			Shareable: req.Shareable,
		},
	}
	irsp, err := kc.IdentSvc.Create(octx, ireq)
	if err != nil {
		return &pb.NewPersonResponse{}, status.Errorf(codes.Aborted, "%v", err)
	}

	// create or use existing customer
	var custID string
	switch req.Customer.(type) {
	case *pb.NewPersonRequest_Create:
		crsp, err := kc.CustSvc.Create(octx, &pbc.CreateRequest{})
		if err != nil {
			return &pb.NewPersonResponse{}, status.Errorf(codes.Aborted, "%v", err)
		}
		custID = crsp.Customer.Id
	case *pb.NewPersonRequest_CustomerId:
		custID = req.Customer.(*pb.NewPersonRequest_CustomerId).CustomerId
	default:
		return &pb.NewPersonResponse{}, status.Errorf(codes.OutOfRange, "req.Customer is not specified")
	}

	// add person to customer
	kpreq := &pbc.AddKeyPersonRequest{
		KeyPerson: &pbc.KeyPerson{
			IdentityId: irsp.Identity.Id,
			Customer:   &pbc.Customer{Id: custID},
		},
	}
	if _, err := kc.CustSvc.AddKeyPerson(octx, kpreq); err != nil {
		return &pb.NewPersonResponse{}, status.Errorf(codes.Aborted, "%v", err)
	}

	return &pb.NewPersonResponse{
		IdentityId: irsp.Identity.Id,
	}, nil
}

func (kc KycCertifier) VerifyId(ctx context.Context, req *pb.VerifyIdRequest) (*pb.VerifyIdResponse, error) {

	// octx, err := md.Outgoing(ctx)
	// if err != nil {
	// 	return &pb.VerifyIdResponse{}, status.Errorf(codes.Aborted, "%v", err)
	// }

	// vreq := &pbv.CreateRequest{
	// 	Verifier: &pbv.IdVerifier{},
	// }
	// vrsp, err := kc.IdVSvc.Create(octx, vreq)
	// if err != nil {
	// 	return &pb.VerifyIdResponse{}, status.Errorf(codes.Aborted, "%v", err)
	// }

	return &pb.VerifyIdResponse{}, nil
}
