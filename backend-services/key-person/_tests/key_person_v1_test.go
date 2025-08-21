package tests

import (
	_ "embed"
	"encoding/json"
	"log"
	"strconv"
	"testing"
	"time"

	"google.golang.org/grpc"
	"google.golang.org/protobuf/encoding/protojson"

	pb "github.com/anqaml/key-person/gen/proto/go/keyperson/v1"
)

//go:embed testdata-v1.json
var jsonTestData []byte

type v1 struct {
	People []*pb.Person
}

func TestV1(t *testing.T) {

	v := &v1{}
	v.loadData(t)

	// run tests
	t.Run("Create", v.Create)
	time.Sleep(2 * time.Second)

	t.Run("SetRisk", v.SetRisk)
	t.Run("Get", v.Get)
	t.Run("QuerySearch", v.QuerySearch)
	t.Run("QueryRisk", v.QueryRisk)
	t.Run("Update", v.Update)

	t.Cleanup(func() {
		t.Run("Delete", v.Delete)
		t.Run("Check", v.Check)
	})
}

func (v *v1) Create(t *testing.T) {
	ctx := makeContext()
	cli := v.makeClient()

	for i, e := range v.People {
		rsp, err := cli.Create(ctx, &pb.CreateRequest{Person: e})
		if err != nil {
			t.Fatalf("Error creating entity: %v", err)
		}
		if rsp.Person.Id == "" {
			t.Errorf("KeyPerson not created")
		}

		v.People[i].Id = rsp.Person.Id
	}
}

func (v *v1) SetRisk(t *testing.T) {
	ctx := makeContext()
	cli := v.makeClient()

	entID := v.People[0].Id

	req := pb.SetRiskRequest{
		PersonId: entID,
		Risk:     pb.Risk_RISK_HIGH,
	}

	if _, err := cli.SetRisk(ctx, &req); err != nil {
		t.Fatalf("Error setting entity risk: %v", err)
	}
}

func (v *v1) Get(t *testing.T) {
	ctx := makeContext()
	cli := v.makeClient()

	req := pb.GetRequest{
		PersonId: v.People[0].Id,
		Degrees:  1,
	}

	rsp, err := cli.Get(ctx, &req)
	if err != nil || rsp == nil {
		t.Fatalf("Error fetching person: %v", err)
	}

	// retain updated entity for later
	p := rsp.Person
	v.People[0] = p

	if p.FamilyName != "Lamar" {
		t.Errorf("Unexpected company name, want: \"Lamar\", got: %s.", p.FamilyName)
	}
	// test for values set earlier
	if p.Risk != pb.Risk_RISK_HIGH {
		t.Errorf("Unexpected risk, want %v, got %v", pb.Risk_RISK_HIGH, p.Risk)
	}
}

func (v *v1) QuerySearch(t *testing.T) {
	ctx := makeContext()
	cli := v.makeClient()

	req := pb.QueryRequest{
		SearchText: "Yang",
	}

	rsp, err := cli.Query(ctx, &req)
	if err != nil || rsp == nil {
		t.Fatalf("Error querying with search: %v", err)
	}

	if len(rsp.Cursor) == 0 {
		t.Fatal("No results returned")
	}
	if int(rsp.Matches) != len(rsp.Cursor) {
		t.Errorf("Matches does not equal the number of results. Wanted %d, got %d.", len(rsp.Cursor), rsp.Matches)
	}
	if rsp.Cursor[0].FamilyName != "Yang" {
		t.Errorf("Unexpected person returned. Wanted %s, got %s", "Yang", rsp.Cursor[0].FamilyName)
	}
}

func (v *v1) QueryRisk(t *testing.T) {
	ctx := makeContext()
	cli := v.makeClient()

	req := pb.QueryRequest{
		Risk: &pb.QueryRequest_Value{Value: pb.Risk_RISK_HIGH},
	}

	rsp, err := cli.Query(ctx, &req)
	if err != nil {
		t.Fatalf("Error querying by risk: %v", err)
	}

	if len(rsp.Cursor) == 0 {
		t.Fatal("No results returned")
	}
	if rsp.Cursor[0].FamilyName != v.People[0].FamilyName {
		t.Errorf("Unexpected person returned. Wanted %s, got %s", v.People[0].FamilyName, rsp.Cursor[0].FamilyName)
	}
}

func (v *v1) Update(t *testing.T) {
	ctx := makeContext()
	cli := v.makeClient()

	upd := v.People[0]
	upd.GivenNames = "GivenNames"
	upd.FamilyName = "FamilyName"

	if _, err := cli.Update(ctx, &pb.UpdateRequest{Person: upd}); err != nil {
		t.Fatalf("Error updating entity: %v", err)
	}

	rsp, err := cli.Get(ctx, &pb.GetRequest{PersonId: upd.Id})
	if err != nil || rsp == nil {
		t.Fatalf("Error fetching entity: %v", err)
	}
	p := rsp.Person

	if p.GivenNames != "GivenNames" {
		t.Errorf("Unexpected last name, want: \"%s\", got: %s.", "GivenNames", p.GivenNames)
	}
	if p.FamilyName != "FamilyName" {
		t.Errorf("Unexpected last name, want: \"%s\", got: %s.", "FamilyName", p.FamilyName)
	}
}

func (v *v1) Delete(t *testing.T) {
	ctx := makeContext()
	cli := v.makeClient()

	for _, p := range v.People {
		if _, err := cli.Delete(ctx, &pb.DeleteRequest{PersonId: p.Id}); err != nil {
			t.Errorf("Error cleaning up entity %d", 1)
		}
	}

	// if _, err := ent.Delete(ctx, &pb.DeleteRequest{
	// 	DeleteBy: &pb.DeleteRequest_PersonId{PersonId: ""},
	// }); err != nil {
	// 	t.Errorf("Error cleaning up entity %d", 1)
	// }

	// if _, err := ent.Delete(ctx, &pb.DeleteRequest{
	// 	DeleteBy: &pb.DeleteRequest_PersonId{PersonId: ""},
	// }); err != nil {
	// 	t.Errorf("Error cleaning up entity %d", 2)
	// }
}

func (v *v1) Check(t *testing.T) {
	ctx := makeContext()
	cli := v.makeClient()

	rsp, err := cli.Query(ctx, &pb.QueryRequest{})
	if err != nil {
		t.Fatalf("Error querying entity data: %v", err)
	}

	if rsp.Matches != 0 {
		t.Errorf("Cleanup failed, %d records not deleted", rsp.Matches)
	}
}

// load test data
func (v *v1) loadData(t *testing.T) {

	var people []json.RawMessage

	if err := json.Unmarshal(jsonTestData, &people); err != nil {
		t.Fatalf("Error unmarshalling JSON: %v", err)
	}

	for _, jsn := range people {
		var p pb.Person
		if err := protojson.Unmarshal(jsn, &p); err != nil {
			t.Fatalf("Error unmarshalling person JSON into proto person: %v", err)
		}
		v.People = append(v.People, &p)
	}
}

func (v *v1) makeClient() pb.KeyPersonServiceClient {

	conn, err := grpc.Dial("[::]:"+strconv.Itoa(port), grpc.WithInsecure())
	if err != nil {
		log.Fatalf("Error dialing server: %v", err)
	}

	return pb.NewKeyPersonServiceClient(conn)
}
