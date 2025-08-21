package store

import (
	_ "embed"
	"encoding/json"

	pb "go.buf.build/library/go-grpc/anqa/customer-v1/customer/v1beta1"
	"google.golang.org/protobuf/encoding/protojson"
)

//go:embed customers.json
var jsonCusts []byte

func mockCustomers() ([]*pb.Customer, error) {

	var data struct {
		Customers []json.RawMessage
	}

	if err := json.Unmarshal(jsonCusts, &data); err != nil {
		return []*pb.Customer{}, err
	}

	// load entities
	var pbCusts []*pb.Customer

	for _, jsn := range data.Customers {
		var c pb.Customer
		if err := protojson.Unmarshal(jsn, &c); err != nil {
			return []*pb.Customer{}, err
		}
		pbCusts = append(pbCusts, &c)
	}

	return pbCusts, nil
}
