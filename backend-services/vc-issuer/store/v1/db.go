package store

import (
	"context"
	_ "embed"
	"fmt"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"

	pbson "github.com/anqaml/proto-bson"
	pb "github.com/anqaml/vc-issuer/gen/proto/go/vcissuer/v1"
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
		pbson.Proto(&pb.Credential{}),
		pbson.Audit("vcissuer"), // cfg sets: audit?
	)
	if err != nil {
		return Store{}, fmt.Errorf("error connecting to database: %v", err)
	}

	return Store{
		cnn:  cnn,
		coll: cnn.Database.Collection("vcissuer"),
	}, nil
}

func (s *Store) Create(tenant, user string, c *pb.Credential)  error {

	// b, err := bson.Marshal(p)
	b, err := s.cnn.Marshal(c, pbson.Tenant(tenant), pbson.UpdatedBy(user))
	if err != nil {
		return  err
	}

	_, err = s.coll.InsertOne(context.Background(), b)
	return  err
}

func (s *Store) Fetch(tenant string, qr *pb.QueryRequest) (*pb.QueryResponse, error) {

	filter := bson.M{"tenant": tenant}

	if qr.Tag != "" {
		filter = bson.M{"$and": bson.A{filter,
			bson.M{"$text": bson.M{"$search": qr.Tag}},
		}}
	}
	if qr.Type != "" {
		filter = bson.M{"$and": bson.A{filter, bson.M{"person.sourceRef": qr.Type}}}
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

func (s *Store) Get(tenant string, id string) (*pb.Credential, error) {

	var c *pb.Credential

	err := s.coll.FindOne(
		context.Background(),
		bson.M{"tenant": tenant, "credential.id": id},
	).Decode(&c)

	if err != nil && err != mongo.ErrNoDocuments {
		return &pb.Credential{}, err
	}

	return c, nil
}

func (s *Store) Verify(tenant, user string, dr *pb.VerifyRequest) error {

	if _, err := s.coll.DeleteOne(
		context.Background(),
		bson.M{"tenant": tenant, "credential.id": dr.Credential.Id},
	); err != nil {
		return err
	}

	return nil
}
