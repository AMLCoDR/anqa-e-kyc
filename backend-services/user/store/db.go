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
	pb "github.com/anqaml/user/gen/proto/go/user/v1"
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
		pbson.Proto(&pb.User{}),
		pbson.Audit("user"), // cfg sets: audit?
	)
	if err != nil {
		return Store{}, fmt.Errorf("error connecting to database: %v", err)
	}

	return Store{
		cnn:  cnn,
		coll: cnn.Database.Collection("user"),
	}, nil
}

// Save creates or updates a user record
func (s *Store) Save(ctx context.Context, u *pb.User) error {
	tenant, user, err := metadata(ctx)
	if err != nil {
		return err
	}

	b, err := s.cnn.Marshal(u, pbson.Tenant(tenant), pbson.UpdatedBy(user))
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

// Get fetches the specified user
func (s *Store) Get(ctx context.Context) (*pb.User, error) {
	tenant, _, err := metadata(ctx)
	if err != nil {
		return &pb.User{}, err
	}

	var u pb.User
	err = s.coll.FindOne(
		context.Background(),
		bson.M{"tenant": tenant},
	).Decode(&u)

	if err != nil && err != mongo.ErrNoDocuments {
		return &pb.User{}, err
	}
	return &u, nil
}

// Delete removes a user record
func (s *Store) Delete(ctx context.Context, userID string) error {
	tenant, _, err := metadata(ctx)
	if err != nil {
		return err
	}

	if _, err := s.coll.DeleteOne(
		context.Background(),
		bson.M{"tenant": tenant, "user.id": userID},
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
