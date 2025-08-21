package store

import (
	"context"
	_ "embed"
	"fmt"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"

	"github.com/anqaml/go-svc/md"
	pbson "github.com/anqaml/proto-bson"
	pb "github.com/anqaml/reporting-entity/gen/proto/go/reportingentity/v2"
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
		pbson.Proto(&pb.ReportingEntity{}),
		pbson.Audit("reportingentity"),
	)
	if err != nil {
		return Store{}, fmt.Errorf("error connecting to database: %v", err)
	}

	return Store{
		cnn:  cnn,
		coll: cnn.Database.Collection("reportingentity"),
	}, nil
}

// Save creates or updates an reportingentity record
func (s *Store) Save(ctx context.Context, o *pb.ReportingEntity) error {
	tenant := o.Id
	user, err := md.Value(ctx, "x-token-c-user")
	if err != nil {
		return err
	}

	// ensure Id is not overwritten
	b, err := s.cnn.Marshal(o, pbson.Tenant(tenant), pbson.UpdatedBy(user))
	if err != nil {
		return err
	}

	opt := &options.ReplaceOptions{}

	if _, err := s.coll.ReplaceOne(
		context.Background(),
		bson.M{"tenant": tenant},
		b,
		opt.SetUpsert(true),
	); err != nil {
		return err
	}

	return nil
}

func (s *Store) Get(ctx context.Context) (*pb.ReportingEntity, error) {
	tenant, _, err := metadata(ctx)
	if err != nil {
		return &pb.ReportingEntity{}, err
	}

	var o *pb.ReportingEntity
	err = s.coll.FindOne(
		context.Background(),
		bson.M{"tenant": tenant},
	).Decode(&o)

	if err != nil && err != mongo.ErrNoDocuments {
		return &pb.ReportingEntity{}, err
	}
	return o, nil
}

func (s *Store) Fetch(qr *pb.QueryRequest) (*pb.QueryResponse, error) {

	filter := bson.M{}
	if qr.Limit == 0 {
		qr.Limit = 50
	}
	opt := options.FindOptions{
		Skip:  &qr.Offset,
		Limit: &qr.Limit,
	}

	mctx := context.Background()
	coll := s.coll

	cursor, err := coll.Find(mctx, filter, &opt)
	if err != nil {
		return &pb.QueryResponse{}, err
	}

	var rsp pb.QueryResponse
	if err := cursor.All(mctx, &rsp.Data); err != nil {
		return &pb.QueryResponse{}, err
	}

	// get count of all matching docs (ignore limit)
	if rsp.Matches, err = coll.CountDocuments(mctx, filter); err != nil {
		return &pb.QueryResponse{}, err
	}
	return &rsp, nil
}

// Delete deletes a record
func (s *Store) Delete(ctx context.Context) error {
	tenant, _, err := metadata(ctx)
	if err != nil {
		return err
	}

	if _, err := s.coll.DeleteOne(
		context.Background(),
		bson.M{"tenant": tenant},
	); err != nil {
		return err
	}

	return nil
}

func metadata(ctx context.Context) (tenant, user string, err error) {
	tenant, err = md.Value(ctx, "x-token-c-tenant")
	if err != nil {
		return
	}
	user, err = md.Value(ctx, "x-token-c-user")
	if err != nil {
		return
	}
	return
}
