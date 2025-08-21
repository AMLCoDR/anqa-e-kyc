package main

import (
	"context"
	"encoding/json"
	"log"
	"os"

	dz "github.com/anqaml/id-check/dz/v2"
	pb "github.com/anqaml/id-check/gen/proto/go/idcheck/v3"
	"github.com/anqaml/id-check/kyc"
	store "github.com/anqaml/id-check/store/v3"
	pbe "go.buf.build/library/go-grpc/anqa/entity/entity/v1"
	"google.golang.org/grpc"
	"google.golang.org/grpc/metadata"
)

func main() {
	log.Println("Migrating ID check records from v2 to v3")

	// Set up DB connection
	db, err := store.New(
		os.Getenv("MONGODB_USER"),
		os.Getenv("MONGODB_PWD"),
		os.Getenv("MONGODB_HOST"),
	)
	if err != nil {
		log.Fatalf("Error connecting to database: %v", err)
	}

	// Set up connection to entity service
	entConn, err := grpc.Dial(
		"entity.anqa.svc.cluster.local:8085",
		grpc.WithInsecure(),
	)
	if err != nil {
		log.Fatalf("Cannot connect to the entity service: %v", err)
	}
	entCli := pbe.NewEntityServiceClient(entConn)

	// Get all id-checks. Can get using v3 code since changes are additive.
	chk, err := db.DMFetch()
	if err != nil {
		log.Printf("Error after %d records\n", len(chk))
		log.Fatalf("Error retrieving records to migrate: %v", err)
	}
	log.Printf("Retrieved %d records to assess\n", len(chk))

	// Look for missing Msg, Matches, IdCheck and Person fields and populate. To make up for any
	// previous partial migrations, a full update is done if any of these fields are empty.
	nupdate := 0
	for _, c := range chk {
		if (c.Msg == "") || (len(c.Matches) == 0) || (c.IdCheck == nil) || (c.Person == nil) {
			log.Printf("%+v\n", c)

			// Get the associated tenant so we can call the entity service with it
			t, err := db.DMGetTenant(c.Id)
			if err != nil {
				log.Printf("Error getting tenant for ID check %s: %v", c.Id, err)
				continue
			}

			// Add person details by calling the entity service
			oCtx := metadata.NewOutgoingContext(context.Background(),
				metadata.MD{
					"x-token-c-tenant": []string{t},
				},
			)
			getRsp, err := entCli.Get(oCtx, &pbe.GetRequest{EntityId: c.EntityId})
			if err != nil {
				// Don't bail out here. It's possible an ID check remains for an entity that no longer exists.
				// Log and move on.
				log.Printf("Error trying to retrieve entity with ID %s: %v", c.EntityId, err)
				continue
			}
			ent := getRsp.Entity

			c.Person = &pb.Person{
				FirstName:  ent.GetPerson().FirstName,
				MiddleName: ent.GetPerson().MiddleName,
				LastName:   ent.GetPerson().LastName,
				BirthDate:  ent.GetPerson().BirthDate,
			}

			// Add IdCheck, Msg and Matches if possible
			switch c.IdType {
			case pb.IdType_ID_TYPE_PASSPORT:
				makePassport(c)
			case pb.IdType_ID_TYPE_LICENCE:
				makeLicence(c)
			case pb.IdType_ID_TYPE_ADDRESS:
				makeAddress(c)
			case pb.IdType_ID_TYPE_NATIONALID:
				makeNationalID(c)
			case pb.IdType_ID_TYPE_WATCHLIST:
				makeWatchlist(c)
			default:
				log.Printf("Unknown ID type %+v\n", c.IdType)
				continue
			}

			log.Printf("%+v\n", c)

			// Do the update
			if err = db.DMUpdate(c); err != nil {
				log.Printf("Update failed: %v", err)
				continue
			}
			nupdate++
		}
	}
	log.Printf("%d records updated\n", nupdate)
}

func makePassport(chk *pb.IdCheck) {
	var pd dz.PassportDetail
	if err := json.Unmarshal([]byte(chk.Detail), &pd); err == nil {
		chk.IdCheck = &pb.IdCheck_Passport{
			Passport: &pb.Passport{
				Number: pd.Data.PassportNo,
				Expiry: pd.Data.PassportExpiry,
			},
		}
	}
	r := protoToKyc(chk)
	dz.InterpretPassport(r)
	kycToProto(chk, r)
}

func makeLicence(chk *pb.IdCheck) {
	var ld dz.LicenceDetail
	if err := json.Unmarshal([]byte(chk.Detail), &ld); err == nil {
		chk.IdCheck = &pb.IdCheck_Licence{
			Licence: &pb.Licence{
				Number:  ld.Data.LicenceNo,
				Version: ld.Data.LicenceVersion,
			},
		}
	}
	r := protoToKyc(chk)
	dz.InterpretLicence(r)
	kycToProto(chk, r)
}

func makeAddress(chk *pb.IdCheck) {
	var ad dz.AddressDetail
	if err := json.Unmarshal([]byte(chk.Detail), &ad); err == nil {
		chk.IdCheck = &pb.IdCheck_Address{
			Address: &pb.Address{
				StreetName: ad.Data.Street, // This is as close as we can get. For data migration it's OK.
				Suburb:     ad.Data.Suburb,
				City:       ad.Data.City,
				Postcode:   ad.Data.PostCode,
			},
		}
	}
	r := protoToKyc(chk)
	dz.InterpretAddress(r)
	kycToProto(chk, r)
}

func makeNationalID(chk *pb.IdCheck) {
	var nd dz.NationalIdDetail
	if err := json.Unmarshal([]byte(chk.Detail), &nd); err == nil {
		chk.IdCheck = &pb.IdCheck_NationalId{
			NationalId: &pb.NationalId{
				Number: nd.Data.IdCardNo,
			},
		}
	}
	r := protoToKyc(chk)
	dz.InterpretNationalID(r)
	kycToProto(chk, r)
}

func makeWatchlist(chk *pb.IdCheck) {
	r := protoToKyc(chk)
	dz.InterpretWatchlist(r)
	kycToProto(chk, r)
}

func protoToKyc(chk *pb.IdCheck) *kyc.Result {
	return &kyc.Result{
		Detail: chk.Detail,
		Status: kyc.Status(chk.Status),
	}
}

func kycToProto(chk *pb.IdCheck, r *kyc.Result) {
	for l, v := range r.Matches {
		chk.Matches = append(chk.Matches, &pb.Match{
			Label: l,
			Match: v,
		})
	}
	chk.Msg = r.Msg
}
