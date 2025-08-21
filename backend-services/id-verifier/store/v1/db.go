package store

import (
	"context"
	_ "embed"
	"fmt"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"

	pb "github.com/anqaml/id-verifier/gen/proto/go/idverifier/v1"
	pbson "github.com/anqaml/proto-bson"
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
		pbson.Proto(&pb.IdVerifier{}),
		pbson.Audit("idverifier"),
	)
	if err != nil {
		return Store{}, fmt.Errorf("error connecting to database: %v", err)
	}

	return Store{
		cnn:  cnn,
		coll: cnn.Database.Collection("idverifier"),
	}, nil
}

// Create creates a new idverifier record
func (s *Store) Create(tenant, user string, p *pb.IdVerifier) (*pb.IdVerifier, error) {

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

	if qr.Limit == 0 {
		qr.Limit = 50
	}
	opt := options.FindOptions{
		Skip:  &qr.Offset,
		Limit: &qr.Limit,
		Sort:  bson.M{"idverifier.risk": -1},
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

// Get returns the idverifier specified by id.
func (s *Store) Get(tenant string, id string) (*pb.IdVerifier, error) {

	var p *pb.IdVerifier

	err := s.coll.FindOne(
		context.Background(),
		bson.M{"tenant": tenant, "idverifier.id": id},
	).Decode(&p)

	if err != nil && err != mongo.ErrNoDocuments {
		return &pb.IdVerifier{}, err
	}

	return p, nil
}

// Update applies an update to the specified idverifier record.
func (s *Store) Update(tenant, user string, p *pb.IdVerifier) error {

	b, err := s.cnn.Marshal(p, pbson.Tenant(tenant), pbson.UpdatedBy(user))
	if err != nil {
		return err
	}

	return s.coll.FindOneAndReplace(
		context.Background(),
		bson.M{"tenant": tenant, "idverifier.id": p.Id},
		b,
	).Err()
}

// Delete deletes an idverifier record
func (s *Store) Delete(tenant, user string, dr *pb.DeleteRequest) error {

	if _, err := s.coll.DeleteOne(
		context.Background(),
		bson.M{"tenant": tenant, "idverifier.id": dr.VerifierId},
	); err != nil {
		return err
	}

	return nil
}
