package store

import (
	"context"
	_ "embed"
	"fmt"
	"time"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"

	"github.com/anqaml/go-svc/md"
	pb "github.com/anqaml/identity/gen/proto/go/identity/v1"
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
		pbson.Proto(&pb.Identity{}),
		pbson.Audit("identity"),
	)
	if err != nil {
		return Store{}, fmt.Errorf("error connecting to database: %v", err)
	}

	return Store{
		cnn:  cnn,
		coll: cnn.Database.Collection("identity"),
	}, nil
}

// Create creates a new identity record
func (s *Store) Create(ctx context.Context, p *pb.Identity) (*pb.Identity, error) {
	tenant, user, err := metadata(ctx)
	if err != nil {
		return nil, err
	}

	b, err := s.cnn.Marshal(p, pbson.Tenant(tenant), pbson.UpdatedBy(user))
	if err != nil {
		return nil, err
	}

	_, err = s.coll.InsertOne(context.Background(), b)
	return p, err
}

// Fetch queries the collection using parameters in QueryRequest. It returns a paged
// result set (using Offset and Limit) and the total number of matches found.
func (s *Store) Fetch(ctx context.Context, qr *pb.QueryRequest) (*pb.QueryResponse, error) {
	tenant, _, err := metadata(ctx)
	if err != nil {
		return &pb.QueryResponse{}, err
	}

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
		Sort:  bson.M{"identity.risk": -1},
	}

	cursor, err := s.coll.Find(context.Background(), filter, &opt)
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

// Get returns the identity specified by id.
func (s *Store) Get(ctx context.Context, id string) (*pb.Identity, error) {
	tenant, _, err := metadata(ctx)
	if err != nil {
		return nil, err
	}

	var p *pb.Identity

	err = s.coll.FindOne(
		context.Background(),
		bson.M{"tenant": tenant, "identity.id": id},
	).Decode(&p)

	if err != nil && err != mongo.ErrNoDocuments {
		return &pb.Identity{}, err
	}

	return p, nil
}

// Update applies an update to the specified identity record.
func (s *Store) Update(ctx context.Context, p *pb.Identity) error {
	tenant, user, err := metadata(ctx)
	if err != nil {
		return err
	}

	b, err := s.cnn.Marshal(p, pbson.Tenant(tenant), pbson.UpdatedBy(user))
	if err != nil {
		return err
	}

	return s.coll.FindOneAndReplace(
		context.Background(),
		bson.M{"tenant": tenant, "identity.id": p.Id},
		b,
	).Err()
}

// Delete deletes an identity record
func (s *Store) Delete(ctx context.Context, dr *pb.DeleteRequest) error {
	tenant, _, err := metadata(ctx)
	if err != nil {
		return err
	}

	if _, err := s.coll.DeleteOne(
		context.Background(),
		bson.M{"tenant": tenant, "identity.id": dr.IdentityId},
	); err != nil {
		return err
	}

	return nil
}

func (s *Store) AddAlias(ctx context.Context, aar *pb.AddAliasRequest) error {
	tenant, user, err := metadata(ctx)
	if err != nil {
		return err
	}

	_, err = s.coll.UpdateOne(
		context.Background(),
		bson.M{"tenant": tenant, "identity.id": aar.IdentityId},
		// TODO: Find a way to simplify setting updatedAt, updatedBy fields
		bson.M{
			"$set": bson.M{
				"updatedBy": user,
				"updatedAt": time.Now().Unix() * 1000,
			},
			"$push": bson.M{
				// TODO: Update proto-bson to just serialise proto messages (exclude the wrapper)
				"identity.alias": bson.M{
					"id":         aar.Alias.Id,
					"givenNames": aar.Alias.GivenNames,
					"lastName":   aar.Alias.FamilyName,
				},
			},
		},
	)

	return err
}

func (s *Store) RemoveAlias(ctx context.Context, rar *pb.RemoveAliasRequest) error {
	tenant, user, err := metadata(ctx)
	if err != nil {
		return err
	}

	_, err = s.coll.UpdateOne(
		context.Background(),
		bson.M{"tenant": tenant, "identity.id": rar.IdentityId},
		bson.M{
			"$set": bson.M{
				"updatedBy": user,
				"updatedAt": time.Now().Unix() * 1000,
			},
			"$pull": bson.M{
				"identity.alias": bson.M{"id": rar.AliasId},
			},
		},
	)

	return err
}

func (s *Store) AddCredential(ctx context.Context, acr *pb.AddCredentialRequest) error {
	tenant, user, err := metadata(ctx)
	if err != nil {
		return err
	}

	// marshal credential message
	credByt, err := pbson.MarshalProto(acr.Credential)
	if err != nil {
		return err
	}

	_, err = s.coll.UpdateOne(
		context.Background(),
		bson.M{"tenant": tenant, "identity.id": acr.IdentityId},
		bson.M{
			"$set": bson.M{
				"updatedBy": user,
				"updatedAt": time.Now().Unix() * 1000,
			},
			"$push": bson.M{
				"identity.credential": bson.RawValue{
					Type:  bson.TypeEmbeddedDocument,
					Value: credByt,
				},
			},
		},
	)

	return err
}

func (s *Store) RemoveCredential(ctx context.Context, rcr *pb.RemoveCredentialRequest) error {
	tenant, user, err := metadata(ctx)
	if err != nil {
		return err
	}

	_, err = s.coll.UpdateOne(
		context.Background(),
		bson.M{"tenant": tenant, "identity.id": rcr.IdentityId},
		bson.M{
			"$set": bson.M{
				"updatedBy": user,
				"updatedAt": time.Now().Unix() * 1000,
			},
			"$pull": bson.M{
				"identity.credential": bson.M{"id": rcr.CredentialId},
			},
		},
	)

	return err
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
