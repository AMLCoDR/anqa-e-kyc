package v2

import (
	"context"
	"log"

	"github.com/google/uuid"
	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/status"
	"google.golang.org/protobuf/types/known/timestamppb"

	flag "github.com/anqaml/go-svc/flg"
	"github.com/anqaml/go-svc/md"
	dz2 "github.com/anqaml/id-check/dz/v2"
	pb "github.com/anqaml/id-check/gen/proto/go/idcheck/v2"
	"github.com/anqaml/id-check/kyc"
	store "github.com/anqaml/id-check/store/v2"
	pbe "go.buf.build/library/go-grpc/anqa/entity/entity/v1"
)

const (
	ModeUnknown int = iota - 1
	ModeOff
	ModeTrial
	ModeLive

	trialTenant = "67ca3e58-9536-4a70-b30e-6d8c15f87234"
)

// IDChecks type creates a receiver for proto icc methods below
type IDChecks struct {
	Store   store.Store
	EntCli  pbe.EntityServiceClient
	FlagCli *flag.Client
	pb.UnimplementedIdCheckServiceServer
}

// Check implements the proto Check icc method. See proto/idcheck for more detail.
func (ic IDChecks) Check(ctx context.Context, req *pb.CheckRequest) (*pb.CheckResponse, error) {

	// check user's access permission
	key := "id-check"
	checkType := checkType(req)
	if checkType == pb.IdType_ID_TYPE_WATCHLIST {
		key = "watchlist"
	}
	if ok := ic.FlagCli.Evaluate(ctx, key); !ok {
		return &pb.CheckResponse{}, status.Error(codes.PermissionDenied, "user does not have access to this feature")
	}

	// get individual's details
	oCtx, err := md.Outgoing(ctx)
	if err != nil {
		return &pb.CheckResponse{}, status.Errorf(codes.Aborted, "error: %v", err)
	}

	getRsp, err := ic.EntCli.Get(oCtx, &pbe.GetRequest{EntityId: req.EntityId})
	if err != nil {
		return &pb.CheckResponse{}, status.Errorf(codes.Aborted, "error: %v", err)
	}
	ent := getRsp.Entity

	if ent.GetPerson() == nil {
		log.Println("Error: provided entity is not a person")
		return &pb.CheckResponse{}, status.Error(codes.FailedPrecondition, "entity is not a person")
	}

	tnt, err := md.Value(ctx, "x-token-c-tenant")
	if err != nil {
		return &pb.CheckResponse{}, status.Errorf(codes.Aborted, "error: %v", err)
	}

	tm := ic.FlagCli.Evaluate(ctx, "trial")
	if tm {
		tnt = trialTenant
	}

	// create verifier
	vfr, err := dz2.NewVerifier(
		kyc.WithTenant(tnt),
		kyc.WithTrialMode(tm),
	)
	if err != nil {
		return &pb.CheckResponse{}, status.Errorf(codes.Aborted, "error: %v", err)
	}

	// verify ID
	res, err := vfr.Verify(ident{Entity: ent}, proof(req))
	if err != nil {
		return &pb.CheckResponse{}, status.Errorf(codes.Aborted, "error: %v", err)
	}

	idCheck := &pb.IdCheck{
		Id:        uuid.New().String(),
		EntityId:  req.EntityId,
		IdType:    checkType,
		Verified:  res.Verified,
		Status:    pb.Status(res.Status),
		Detail:    res.Detail,
		UpdatedAt: timestamppb.Now(),
	}

	if err := ic.Store.Add(ctx, idCheck); err != nil {
		return &pb.CheckResponse{}, status.Errorf(codes.Aborted, "error: %v", err)
	}

	// update entity id check status in background
	go func() {
		var status pbe.Status
		switch idCheck.Status {
		case pb.Status_STATUS_UNCHECKED:
			status = pbe.Status_STATUS_UNSPECIFIED
		case pb.Status_STATUS_FULL_MATCH:
			status = pbe.Status_STATUS_OK
		default:
			status = pbe.Status_STATUS_ISSUE
		}

		if idCheck.IdType == pb.IdType_ID_TYPE_WATCHLIST {
			req := &pbe.SetEddStatusRequest{
				EntityId: req.EntityId,
				Status:   status,
			}
			if _, err := ic.EntCli.SetEddStatus(oCtx, req); err != nil {
				log.Printf("Error updating customer's EDD status: %v", err)
			}
		} else {
			req := &pbe.SetIdStatusRequest{
				EntityId: req.EntityId,
				Status:   status,
			}
			if _, err := ic.EntCli.SetIdStatus(oCtx, req); err != nil {
				log.Printf("Error updating customer's ID check status: %v", err)
			}
		}
	}()

	return &pb.CheckResponse{IdCheck: idCheck}, nil
}

type ident struct {
	Entity *pbe.Entity
}

func (id ident) Identity() *kyc.Identity {
	return &kyc.Identity{
		FirstName:   id.Entity.GetPerson().FirstName,
		MiddleName:  id.Entity.GetPerson().MiddleName,
		LastName:    id.Entity.GetPerson().LastName,
		DateOfBirth: id.Entity.GetPerson().BirthDate,
	}
}

func proof(req *pb.CheckRequest) kyc.ProofOption {
	switch req.IdCheck.(type) {
	case *pb.CheckRequest_Passport:
		return kyc.WithPassport(
			&kyc.Passport{
				Number: req.GetPassport().Number,
				Expiry: req.GetPassport().Expiry,
			},
		)
	case *pb.CheckRequest_Licence:
		return kyc.WithLicence(
			&kyc.Licence{
				Number:  req.GetLicence().Number,
				Version: req.GetLicence().Version,
			},
		)
	case *pb.CheckRequest_Address:
		return kyc.WithAddress(
			&kyc.Address{
				UnitNumber:   req.GetAddress().UnitNumber,
				StreetNumber: req.GetAddress().StreetNumber,
				StreetName:   req.GetAddress().StreetName,
				StreetType:   req.GetAddress().StreetType,
				Suburb:       req.GetAddress().Suburb,
				City:         req.GetAddress().City,
				Region:       req.GetAddress().Region,
				Postcode:     req.GetAddress().Postcode,
				Country:      req.GetAddress().Country,
			},
		)
	case *pb.CheckRequest_NationalId:
		return kyc.WithNationalID(
			&kyc.NationalID{
				Number: req.GetNationalId().Number,
			},
		)
	case *pb.CheckRequest_Watchlist:
		return kyc.WithWatchlist(&kyc.Watchlist{})
	default:
		return nil //, status.Error(codes.FailedPrecondition, "no check specified")
	}
}

func checkType(req *pb.CheckRequest) pb.IdType {
	switch req.IdCheck.(type) {
	case *pb.CheckRequest_Passport:
		return pb.IdType_ID_TYPE_PASSPORT
	case *pb.CheckRequest_Licence:
		return pb.IdType_ID_TYPE_LICENCE
	case *pb.CheckRequest_Address:
		return pb.IdType_ID_TYPE_ADDRESS
	case *pb.CheckRequest_NationalId:
		return pb.IdType_ID_TYPE_NATIONALID
	case *pb.CheckRequest_Watchlist:
		return pb.IdType_ID_TYPE_WATCHLIST
	default:
		return 0
	}
}

// Get implements the proto Get icc request. See proto/idcheck for more detail.
func (ic IDChecks) Get(ctx context.Context, req *pb.GetRequest) (*pb.GetResponse, error) {
	rsp, err := ic.Store.Get(ctx, req)
	if err != nil {
		return &pb.GetResponse{}, status.Errorf(codes.Aborted, "error: %v", err)
	}
	return rsp, nil
}

// Delete implements the proto Delete service. See proto/idcheck for more detail.
func (ic IDChecks) Delete(ctx context.Context, req *pb.DeleteRequest) (*pb.DeleteResponse, error) {
	if err := ic.Store.Delete(ctx, req); err != nil {
		log.Printf("Error deleting id checks: %v", err)
		return &pb.DeleteResponse{}, status.Errorf(codes.Aborted, "error: %v", err)
	}
	return &pb.DeleteResponse{}, nil
}
