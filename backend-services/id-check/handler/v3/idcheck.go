package v3

import (
	"context"
	"log"
	"strings"

	"github.com/google/uuid"
	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/status"
	"google.golang.org/protobuf/types/known/timestamppb"

	"github.com/anqaml/go-svc/md"
	dz2 "github.com/anqaml/id-check/dz/v2"
	"github.com/anqaml/go-svc/flg"
	pb "github.com/anqaml/id-check/gen/proto/go/idcheck/v3"
	"github.com/anqaml/id-check/kyc"
	store "github.com/anqaml/id-check/store/v3"
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
		return &pb.CheckResponse{}, status.Errorf(codes.FailedPrecondition, "error creating cotext: %v", err)
	}

	tnt, err := md.Value(ctx, "x-token-c-tenant")
	if err != nil {
		return &pb.CheckResponse{}, status.Errorf(codes.FailedPrecondition, "error creating cotext: %v", err)
	}

	tm := ic.FlagCli.Evaluate(ctx, "trial")
	if tm {
		tnt = trialTenant
	}
	interp := ic.FlagCli.Evaluate(ctx, "id-check-v-3")
	// create verifier
	vfr, err := dz2.NewVerifier(
		kyc.WithTenant(tnt),
		kyc.WithTrialMode(tm),
		kyc.WithInterpretResult(interp),
	)
	if err != nil {
		return &pb.CheckResponse{}, status.Errorf(codes.Aborted, "error: %v", err)
	}

	// verify ID
	// TODO: Do we really need Identifier interface to get person details now that we're
	// not pulling it from entity service? Hard to read what's going on.
	res, err := vfr.Verify(person{Req: req}, proof(req))
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
		Msg:       res.Msg,
		Matches:   unpackMatches(res.Matches),
		Person: &pb.Person{
			FirstName:  req.Person.FirstName,
			MiddleName: req.Person.MiddleName,
			LastName:   req.Person.LastName,
			BirthDate:  req.Person.BirthDate,
		},
	}
	unpackProof(idCheck, req)

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

type person struct {
	Req *pb.CheckRequest
}

func (p person) Identity() *kyc.Identity {
	return &kyc.Identity{
		FirstName:   p.Req.Person.FirstName,
		MiddleName:  p.Req.Person.MiddleName,
		LastName:    p.Req.Person.LastName,
		DateOfBirth: p.Req.Person.BirthDate,
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
		return &pb.DeleteResponse{}, status.Errorf(codes.Aborted, "error: %v", err)
	}
	return &pb.DeleteResponse{}, nil
}

func unpackMatches(matches map[string]bool) []*pb.Match {
	var pbi []*pb.Match
	for l, v := range matches {
		i := pb.Match{
			Label: l,
			Match: v,
		}
		pbi = append(pbi, &i)
	}
	return pbi
}

func unpackProof(idc *pb.IdCheck, req *pb.CheckRequest) {
	switch checkType(req) {
	case pb.IdType_ID_TYPE_PASSPORT:
		idc.IdCheck = &pb.IdCheck_Passport{
			Passport: &pb.Passport{
				Number: redact(req.GetPassport().Number, 4, 0),
				Expiry: redact(req.GetPassport().Expiry, 4, 0),
			},
		}
	case pb.IdType_ID_TYPE_LICENCE:
		idc.IdCheck = &pb.IdCheck_Licence{
			Licence: &pb.Licence{
				Number:  redact(req.GetLicence().Number, 4, 0),
				Version: redact(req.GetLicence().Version, 1, 0),
			},
		}
	case pb.IdType_ID_TYPE_ADDRESS:
		idc.IdCheck = &pb.IdCheck_Address{
			Address: &pb.Address{
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
		}
	case pb.IdType_ID_TYPE_NATIONALID:
		idc.IdCheck = &pb.IdCheck_NationalId{
			NationalId: &pb.NationalId{
				Number: redact(req.GetNationalId().Number, 12, 0),
			},
		}
	case pb.IdType_ID_TYPE_WATCHLIST:
		idc.IdCheck = &pb.IdCheck_Watchlist{}
	}
}

func redact(s string, start int, end int) string {
	if start >= len(s) || end >= len(s) || (start+end) >= len(s) {
		return s
	}
	return strings.Replace(s, s[start:len(s)-end], strings.Repeat("X", len(s)-(start+end)), 1)
}
