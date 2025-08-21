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
	pb "github.com/anqaml/subscription/gen/proto/go/subscription/v1"
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
		pbson.Proto(&pb.Subscription{}),
		pbson.Audit("subscription"),
	)
	if err != nil {
		return Store{}, fmt.Errorf("error connecting to database: %v", err)
	}

	return Store{
		cnn:  cnn,
		coll: cnn.Database.Collection("subscription"),
	}, nil
}

// Save creates or updates a subscription record
func (s *Store) Save(ctx context.Context, sbn *pb.Subscription) error {
	tenant, user, err := metadata(ctx)
	if err != nil {
		return err
	}

	b, err := s.cnn.Marshal(sbn, pbson.Tenant(tenant), pbson.UpdatedBy(user))
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

// Get fetches the tenant's subscription
func (s *Store) Get(ctx context.Context) (*pb.Subscription, error) {
	tenant, _, err := metadata(ctx)
	if err != nil {
		return &pb.Subscription{}, err
	}

	var sbn pb.Subscription
	err = s.coll.FindOne(
		context.Background(),
		bson.M{"tenant": tenant},
	).Decode(&sbn)

	if err != nil && err != mongo.ErrNoDocuments {
		return &pb.Subscription{}, err
	}
	return &sbn, nil
}

// Delete removes a subscription record
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
