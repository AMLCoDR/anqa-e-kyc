package v2

import (
	"context"
	_ "embed"
	"fmt"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"

	"github.com/anqaml/go-svc/md"
	pb "github.com/anqaml/id-check/gen/proto/go/idcheck/v2"
	pbson "github.com/anqaml/proto-bson"
)

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
		pbson.Proto(&pb.IdCheck{}),
		pbson.Audit("idcheck"),
	)
	if err != nil {
		return Store{}, fmt.Errorf("error connecting to database: %v", err)
	}

	return Store{
		cnn:  cnn,
		coll: cnn.Database.Collection("idcheck"),
	}, nil
}

// Add saves the results of an id check
func (s Store) Add(ctx context.Context, ic *pb.IdCheck) error {
	tenant, user, err := metadata(ctx)
	if err != nil {
		return err
	}

	b, err := s.cnn.Marshal(ic, pbson.Tenant(tenant), pbson.UpdatedBy(user))
	if err != nil {
		return err
	}

	_, err = s.coll.InsertOne(context.Background(), b)
	return err
}

// Get retrieves the latest id checks (one for each type) for the specified person
func (s Store) Get(ctx context.Context, gr *pb.GetRequest) (*pb.GetResponse, error) {
	tenant, _, err := metadata(ctx)
	if err != nil {
		return &pb.GetResponse{}, err
	}

	pipe := mongo.Pipeline{
		{{Key: "$match", Value: bson.M{
			"tenant":           bson.M{"$eq": tenant},
			"idCheck.entityId": bson.M{"$eq": gr.EntityId},
		}}},
		{{Key: "$sort", Value: bson.M{"idCheck.updatedAt": -1}}},
		{{Key: "$group", Value: bson.M{
			"_id":  "$idCheck.idType",
			"root": bson.M{"$first": "$$ROOT"},
		}}},
	}

	mctx := context.Background()
	cursor, err := s.coll.Aggregate(mctx, pipe)
	if err != nil {
		return &pb.GetResponse{}, err
	}

	var rsp pb.GetResponse
	for cursor.Next(mctx) {
		var ic pb.IdCheck
		if err = s.cnn.Unmarshal(cursor.Current.Lookup("root").Document(), &ic); err != nil {
			return &pb.GetResponse{}, err
		}
		rsp.Checks = append(rsp.Checks, &ic)
	}

	return &rsp, nil
}

// Delete an entity's id checks
func (s Store) Delete(ctx context.Context, dr *pb.DeleteRequest) error {
	tenant, _, err := metadata(ctx)
	if err != nil {
		return err
	}

	_, err = s.coll.DeleteMany(
		context.Background(),
		bson.M{"tenant": tenant, "idCheck.entityId": dr.EntityId},
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
