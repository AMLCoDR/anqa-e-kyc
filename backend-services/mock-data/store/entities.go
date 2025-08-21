package store

import (
	_ "embed"
	"encoding/json"

	"google.golang.org/protobuf/encoding/protojson"

	pb "go.buf.build/library/go-grpc/anqa/entity/entity/v1"
	pbi "go.buf.build/library/go-grpc/anqa/id-check/idcheck/v3"
)

//go:embed entities.json
var jsonEnts []byte

func mockEntities() ([]*pb.Entity, []*pb.Relationship, []*pbi.CheckRequest, error) {

	type idCheck struct {
		Id     string
		Type   pbi.IdType
		Data   json.RawMessage
		Person pbi.Person
	}

	// load data
	var data struct {
		Entities      []json.RawMessage
		Relationships []json.RawMessage
		IdChecks      []json.RawMessage
	}

	if err := json.Unmarshal(jsonEnts, &data); err != nil {
		return []*pb.Entity{}, []*pb.Relationship{}, []*pbi.CheckRequest{}, err
	}

	// load entities
	var pbEnts []*pb.Entity
	entIndex := make(map[string]int)

	var i int
	for _, jsn := range data.Entities {
		var e pb.Entity
		if err := protojson.Unmarshal(jsn, &e); err != nil {
			return []*pb.Entity{}, []*pb.Relationship{}, []*pbi.CheckRequest{}, err
		}
		pbEnts = append(pbEnts, &e)
		entIndex[e.Id] = i
		i++
	}

	// load relationships
	var pbRels []*pb.Relationship

	for _, jsn := range data.Relationships {
		var r pb.Relationship
		if err := protojson.Unmarshal(jsn, &r); err != nil {
			return []*pb.Entity{}, []*pb.Relationship{}, []*pbi.CheckRequest{}, err
		}
		pbRels = append(pbRels, &r)
	}

	// load id check requests
	var pbChks []*pbi.CheckRequest

	for _, jsn := range data.IdChecks {
		var c idCheck
		if err := json.Unmarshal(jsn, &c); err != nil {
			return []*pb.Entity{}, []*pb.Relationship{}, []*pbi.CheckRequest{}, err
		}

		e := pbEnts[entIndex[c.Id]]
		req := &pbi.CheckRequest{
			EntityId: c.Id,
			Person: &pbi.Person{
				FirstName:  e.GetPerson().FirstName,
				MiddleName: e.GetPerson().MiddleName,
				LastName:   e.GetPerson().LastName,
				BirthDate:  e.GetPerson().BirthDate,
			},
		}

		switch c.Type {
		case pbi.IdType_ID_TYPE_PASSPORT:
			var t pbi.Passport
			if err := json.Unmarshal(c.Data, &t); err != nil {
				return []*pb.Entity{}, []*pb.Relationship{}, []*pbi.CheckRequest{}, err
			}
			req.IdCheck = &pbi.CheckRequest_Passport{
				Passport: &t,
			}
		case pbi.IdType_ID_TYPE_LICENCE:
			var t pbi.Licence
			if err := json.Unmarshal(c.Data, &t); err != nil {
				return []*pb.Entity{}, []*pb.Relationship{}, []*pbi.CheckRequest{}, err
			}
			req.IdCheck = &pbi.CheckRequest_Licence{
				Licence: &t,
			}
		case pbi.IdType_ID_TYPE_ADDRESS:
			var t pbi.Address
			if err := json.Unmarshal(c.Data, &t); err != nil {
				return []*pb.Entity{}, []*pb.Relationship{}, []*pbi.CheckRequest{}, err
			}
			req.IdCheck = &pbi.CheckRequest_Address{
				Address: &t,
			}
		case pbi.IdType_ID_TYPE_NATIONALID:
			var t pbi.NationalId
			if err := json.Unmarshal(c.Data, &t); err != nil {
				return []*pb.Entity{}, []*pb.Relationship{}, []*pbi.CheckRequest{}, err
			}
			req.IdCheck = &pbi.CheckRequest_NationalId{
				NationalId: &t,
			}
		case pbi.IdType_ID_TYPE_WATCHLIST:
			req.IdCheck = &pbi.CheckRequest_Watchlist{
				Watchlist: &pbi.Watchlist{},
			}
		}

		pbChks = append(pbChks, req)
	}

	return pbEnts, pbRels, pbChks, nil
}
