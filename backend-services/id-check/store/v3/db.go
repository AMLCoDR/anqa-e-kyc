package v3

import (
	"context"
	_ "embed"
	"fmt"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"

	"github.com/anqaml/go-svc/md"
	pb "github.com/anqaml/id-check/gen/proto/go/idcheck/v3"
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
	return nil
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

// DMFetch retrieves all ID checks for all tenants
// TODO: Remove this function after data migration is complete. Not needed for normal operation.
func (s Store) DMFetch() ([]*pb.IdCheck, error) {
	ctx := context.Background()
	cursor, err := s.coll.Find(ctx, bson.M{})
	if err != nil {
		return []*pb.IdCheck{}, err
	}

	var rsp []*pb.IdCheck

	for cursor.Next(ctx) {
		var ic pb.IdCheck
		if err = s.cnn.Unmarshal(cursor.Current, &ic); err != nil {
			return rsp, err
		}
		rsp = append(rsp, &ic)
	}

	return rsp, nil
}

// DMUpdate updates the new portions of idcheck documents to upgrade from v2 to v3 proto.
// Only new portions are touched.
// TODO: Remove this function after data migration.
func (s Store) DMUpdate(c *pb.IdCheck) error {

	update := bson.M{}
	p := c.GetPerson()
	if p != nil {
		update["idCheck.person"] = p
	}
	m := c.GetMsg()
	if m != "" {
		update["idCheck.msg"] = m
	}
	mx := c.GetMatches()
	if len(mx) > 0 {
		update["idCheck.matches"] = mx
	}

	switch c.IdType {
	case pb.IdType_ID_TYPE_PASSPORT:
		ps := c.GetPassport()
		if ps != nil {
			update["idCheck.passport"] = ps
		}
	case pb.IdType_ID_TYPE_LICENCE:
		li := c.GetLicence()
		if li != nil {
			update["idCheck.licence"] = li
		}
	case pb.IdType_ID_TYPE_ADDRESS:
		ad := c.GetAddress()
		if ad != nil {
			update["idCheck.address"] = ad
		}
	case pb.IdType_ID_TYPE_NATIONALID:
		ni := c.GetNationalId()
		if ni != nil {
			update["idCheck.nationalId"] = ni
		}
	case pb.IdType_ID_TYPE_WATCHLIST:
		wl := c.GetWatchlist()
		if wl != nil {
			update["idCheck.watchlist"] = wl
		}
	}

	_, err := s.coll.UpdateOne(
		context.Background(),
		bson.M{"idCheck.id": c.Id},
		bson.M{"$set": update},
	)

	return err
}

// DMGetTenant gets the tenant ID for the given id check.
// TODO: Remove this function after data migration
func (s Store) DMGetTenant(id string) (string, error) {
	var t struct {
		Tenant string
	}
	err := s.coll.FindOne(context.Background(), bson.M{"idCheck.id": id}).Decode(&t)
	if err != nil {
		return "", err
	}
	return t.Tenant, nil
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
