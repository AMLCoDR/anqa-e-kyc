package tests

import (
	"encoding/json"
	"strings"
	"testing"

	"github.com/anqaml/proto-bson/codec"
	pbt "github.com/anqaml/proto-bson/proto/testdata/v1"
	"go.mongodb.org/mongo-driver/bson"
)

const (
	tenant = "0c6521a7-de23-46d8-941b-8d2875386f75"
)

func TestEncodeDecodeIsSymmetric(t *testing.T) {

	pb := codec.Register(codec.ProtoField("doc"))

	work := &pbt.Work{
		Items: []*pbt.Item{
			&pbt.Item{
				Id: "i0",
				ItemType: &pbt.Item_Task{
					Task: &pbt.Task{
						Title:  "Write unit tests",
						Team:   4,
						Size:   10,
						Ready:  true,
						Status: pbt.Status_STATUS_DOING,
					},
				},
			},
			&pbt.Item{
				Id: "i1",
				ItemType: &pbt.Item_Info{
					Info: &pbt.Info{
						Description: "Information item",
						Status:      pbt.Status_STATUS_DONE,
					},
				},
			},
		},
	}

	b, err := pb.Marshal(work, codec.Tenant(tenant), codec.UpdatedBy("Add user"))
	if err != nil {
		t.Errorf("error encoding bson: %v", err)
	}

	var w pbt.Work
	if err := pb.Unmarshal(b, &w); err != nil {
		t.Errorf("error decoding bson: %v", err)
	}

	// Check some values
	if len(w.Items) != 2 {
		t.Errorf("unexpected number of work items. Expected 2, got %d", len(w.Items))
	}
	qt1 := w.Items[0].GetTask()
	if qt1.Team != 4 {
		t.Errorf("unexpected value for Team on second work item. Expected 4, got %d", qt1.Team)
	}
	if w.Items[1].Id != "i1" {
		t.Errorf("unexpected Id for second work item. Expected 'i1', got %s", w.Items[1].Id)
	}
	info := w.Items[1].GetInfo()
	if info.Description != "Information item" {
		t.Errorf("unexpected Description for second work item. Expected 'Information item, got %s", info.Description)
	}
}

func TestJSONPrefixIsApplied(t *testing.T) {

	item := &pbt.Item{
		Id: "i1",
		ItemType: &pbt.Item_Info{
			Info: &pbt.Info{
				Description: "Information item",
				Status:      pbt.Status_STATUS_DONE,
			},
		},
	}

	// Marshal to bson
	pb := codec.Register(codec.ProtoField("doc"))
	b, err := pb.Marshal(item)
	if err != nil {
		t.Errorf("error encoding bson: %v", err)
	}

	m := map[string]interface{}{}
	err = bson.Unmarshal(b, &m)
	if err != nil {
		t.Errorf("error decoding bson into generic map: %v", err)
	}

	j, err := json.Marshal(m)
	if err != nil {
		t.Errorf("error encoding json: %v", err)
	}

	sj := string(j)
	if !strings.Contains(sj, `"@description"`) {
		t.Errorf("Expected field label @description but it was not present")
	}
}
