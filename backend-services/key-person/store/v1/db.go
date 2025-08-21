package store

import (
	"context"
	_ "embed"
	"fmt"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"

	pb "github.com/anqaml/key-person/gen/proto/go/keyperson/v1"
	pbson "github.com/anqaml/proto-bson"
	pbv "go.buf.build/library/go-grpc/anqa/vc-issuer/vcissuer/v1"
)

// Store creates a receiver for data access methods.
type Store struct {
	cnn  *pbson.Connection
	coll *mongo.Collection
}

//go:embed config.yaml
var cfg string

// New creates a Store reference for use by handler(s)
func New(user, pwd, host string) (Store, error) {

	cnn, err := pbson.Connect(
		pbson.User(user),
		pbson.Password(pwd),
		pbson.Host(host),
		pbson.Configure(cfg),
		pbson.Proto(&pb.Person{}),
		pbson.Audit("keyperson"), // cfg sets: audit?
	)
	if err != nil {
		return Store{}, fmt.Errorf("error connecting to database: %v", err)
	}

	return Store{
		cnn:  cnn,
		coll: cnn.Database.Collection("keyperson"),
	}, nil
}

// Create creates a new keyperson record
func (s *Store) Create(tenant, user string, p *pb.Person) (*pb.Person, error) {

	b, err := s.cnn.Marshal(p, pbson.Tenant(tenant), pbson.UpdatedBy(user))
	if err != nil {
		return nil, err
	}

	_, err = s.coll.InsertOne(context.Background(), b)
	return p, err
}

// Fetch queries the collection using parameters in QueryRequest. It returns a paged
// result set (using Offset and Limit) and the total number of matches found.
func (s *Store) Fetch(tenant string, qr *pb.QueryRequest) (*pb.QueryResponse, error) {

	filter := bson.M{"tenant": tenant}

	if qr.SearchText != "" {
		filter = bson.M{"$and": bson.A{filter,
			bson.M{"$text": bson.M{"$search": qr.SearchText}},
		}}
	}

	switch qr.Risk.(type) {
	case *pb.QueryRequest_Value:
		if qr.GetValue() == pb.Risk_RISK_UNSPECIFIED {
			// undefined needs to include records where risk is not set
			filter = bson.M{"$and": bson.A{filter,
				bson.M{"$or": bson.A{
					bson.M{"person.risk": int(qr.GetValue())},
					bson.M{"person.risk": bson.D{{Key: "$exists", Value: false}}}},
				},
			}}
		} else {
			filter = bson.M{"$and": bson.A{filter, bson.M{"person.risk": int(qr.GetValue())}}}
		}
	default:
		// qr.Risk is not set so don't query
	}

	if qr.SourceRef != "" {
		filter = bson.M{"$and": bson.A{filter, bson.M{"person.sourceRef": qr.SourceRef}}}
	}

	if qr.Limit == 0 {
		qr.Limit = 50
	}
	opt := options.FindOptions{
		Skip:  &qr.Offset,
		Limit: &qr.Limit,
		Sort:  bson.M{"person.risk": -1},
	}
	ctx := context.Background()
	cursor, err := s.coll.Find(ctx, filter, &opt)
	if err != nil {
		return &pb.QueryResponse{}, err
	}

	// unpack results
	var rsp pb.QueryResponse
	if err := cursor.All(context.Background(), &rsp.Cursor); err != nil {
		return &pb.QueryResponse{}, err
	}

	// count of all matching docs
	if rsp.Matches, err = s.coll.CountDocuments(ctx, filter); err != nil {
		return &pb.QueryResponse{}, err
	}

	return &rsp, nil
}

// Get returns the keyperson specified by id.
func (s *Store) Get(tenant string, id string) (*pb.Person, error) {

	var p *pb.Person

	err := s.coll.FindOne(
		context.Background(),
		bson.M{"tenant": tenant, "person.id": id},
	).Decode(&p)

	if err != nil && err != mongo.ErrNoDocuments {
		return &pb.Person{}, err
	}

	return p, nil
}

// Update applies an update to the specified keyperson record.
func (s *Store) Update(tenant, user string, p *pb.Person) error {

	b, err := s.cnn.Marshal(p, pbson.Tenant(tenant), pbson.UpdatedBy(user))
	if err != nil {
		return err
	}

	return s.coll.FindOneAndReplace(
		context.Background(),
		bson.M{"tenant": tenant, "person.id": p.Id},
		b,
	).Err()
}

// UpdateRisk updates a customer's aggregate risk score
func (s *Store) UpdateRisk(tenant, user string, srr *pb.SetRiskRequest) error {

	_, err := s.coll.UpdateOne(
		context.Background(),
		bson.M{"tenant": tenant, "person.id": srr.PersonId},
		bson.M{"$set": bson.M{"person.risk": srr.Risk}},
	)

	return err
}

// Delete deletes an keyperson record
func (s *Store) Delete(tenant, user string, dr *pb.DeleteRequest) error {

	if _, err := s.coll.DeleteOne(
		context.Background(),
		bson.M{"tenant": tenant, "person.id": dr.PersonId},
	); err != nil {
		return err
	}

	return nil
}

func (s *Store) AddCertificate(tenant, user, personId string, c *pbv.Credential) error {

	certByt, err := pbson.MarshalProto(c)
	if err != nil {
		return err
	}
	_, err = s.coll.UpdateOne(
		context.Background(),
		bson.M{"tenant": tenant, "person.id": personId},
		bson.M{"$set": bson.M{
			"person.certificate": bson.RawValue{
				Type:  bson.TypeEmbeddedDocument,
				Value: certByt,
			},
		}},
	)

	return err
}

func (s *Store) RemoveCertificate(tenant, user string, dr *pb.DecertifyRequest) error {

	_, err := s.coll.UpdateOne(
		context.Background(),
		bson.M{"tenant": tenant, "person.id": dr.PersonId},
		bson.M{"$unset": bson.M{"person.certificate": ""}},
	)

	return err
}
