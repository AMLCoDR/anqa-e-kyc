package store

import (
	"context"
	_ "embed"
	"fmt"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"

	pb "github.com/anqaml/customer-v1/gen/proto/go/customer/v1beta1"
	"github.com/anqaml/go-svc/md"
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
		pbson.Proto(&pb.Customer{}),
		pbson.Audit("customer"),
	)
	if err != nil {
		return Store{}, fmt.Errorf("error connecting to database: %v", err)
	}

	return Store{
		cnn:  cnn,
		coll: cnn.Database.Collection("customer"),
	}, nil
}

// Add creates a new customer record
func (s *Store) Add(ctx context.Context, c *pb.Customer) (*pb.Customer, error) {
	tenant, user, err := metadata(ctx)
	if err != nil {
		return &pb.Customer{}, err
	}

	b, err := s.cnn.Marshal(c, pbson.Tenant(tenant), pbson.UpdatedBy(user))
	if err != nil {
		return nil, err
	}
	_, err = s.coll.InsertOne(context.Background(), b)

	return c, err
}

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

	switch qr.Risk.(type) {
	case *pb.QueryRequest_Value:
		if qr.GetValue() == pb.Risk_RISK_UNSPECIFIED {
			// undefined needs to include records where risk is not set
			filter = bson.M{"$and": bson.A{filter,
				bson.M{"$or": bson.A{
					bson.M{"customer.risk": int(qr.GetValue())},
					bson.M{"customer.risk": bson.D{{Key: "$exists", Value: false}}}},
				},
			}}
		} else {
			filter = bson.M{"$and": bson.A{filter, bson.M{"customer.risk": int(qr.GetValue())}}}
		}
	default:
		// qr.Risk is not set so don't query
	}

	// pagination
	if qr.Limit == 0 {
		qr.Limit = 50
	}
	opt := options.FindOptions{
		Skip:  &qr.Offset,
		Limit: &qr.Limit,
		Sort:  bson.M{"customer.risk": -1},
	}

	mctx := context.Background()
	cursor, err := s.coll.Find(mctx, filter, &opt)
	if err != nil {
		return &pb.QueryResponse{}, err
	}

	var rsp pb.QueryResponse
	if err := cursor.All(mctx, &rsp.Data); err != nil {
		return &pb.QueryResponse{}, err
	}

	// get count of all matching docs (ignore limit)
	if rsp.Matches, err = s.coll.CountDocuments(mctx, filter);err != nil {
		return &pb.QueryResponse{}, err
	}

	return &rsp, nil
}

func (s *Store) Get(ctx context.Context, id string) (*pb.Customer, error) {
	tenant, _, err := metadata(ctx)
	if err != nil {
		return &pb.Customer{}, err
	}

	var c *pb.Customer
	err = s.coll.FindOne(
		context.Background(),
		bson.M{"tenant": tenant, "customer.id": id},
	).Decode(&c)

	if err != nil && err != mongo.ErrNoDocuments {
		return &pb.Customer{}, err
	}

	return c, nil
}

// Update creates a new customer record
func (s *Store) Update(ctx context.Context, c *pb.Customer) error {
	tenant, user, err := metadata(ctx)
	if err != nil {
		return err
	}

	b, err := s.cnn.Marshal(c, pbson.Tenant(tenant), pbson.UpdatedBy(user))
	if err != nil {
		return err
	}

	return s.coll.FindOneAndReplace(
		context.Background(),
		bson.M{"tenant": tenant, "customer.id": c.Id},
		b,
	).Err()
}

// UpdateRisk updates a customer's aggregate risk score
func (s *Store) UpdateRisk(ctx context.Context, srr *pb.SetRiskRequest) error {
	tenant, _, err := metadata(ctx)
	if err != nil {
		return err
	}

	_, err = s.coll.UpdateOne(
		context.Background(),
		bson.M{"tenant": tenant, "customer.id": srr.CustomerId},
		bson.M{"$set": bson.M{"customer.risk": srr.Risk}},
	)
	return err
}

// Delete deletes an customer record
func (s *Store) Delete(ctx context.Context, dr *pb.DeleteRequest) error {
	tenant, _, err := metadata(ctx)
	if err != nil {
		return err
	}

	if _, err := s.coll.DeleteOne(
		context.Background(),
		bson.M{"tenant": tenant, "customer.id": dr.CustomerId},
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
