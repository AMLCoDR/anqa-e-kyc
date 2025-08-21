package v1

import (
	"context"
	_ "embed"
	"fmt"
	"log"

	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/status"

	pbc "go.buf.build/library/go-grpc/anqa/customer-v1/customer/v1beta1"
	pbd "go.buf.build/library/go-grpc/anqa/document/document/v1"
	pbe "go.buf.build/library/go-grpc/anqa/entity/entity/v1"
	pbi "go.buf.build/library/go-grpc/anqa/id-check/idcheck/v3"
	pbins "go.buf.build/library/go-grpc/anqa/insight/insight/v2"
	pbr "go.buf.build/library/go-grpc/anqa/rules-engine/rulesengine/v1"
	pbt "go.buf.build/library/go-grpc/anqa/transaction/transaction/v1"

	"github.com/anqaml/go-svc/md"
	pb "github.com/anqaml/mock-data/gen/proto/go/mockdata/v1"
	"github.com/anqaml/mock-data/store"
)

//go:embed SourceOfFundsAndWealthGuidelines.pdf
var docFile []byte

// MockData type creates a receiver for proto rpc methods below
type MockData struct {
	Store    store.Store
	CustSvc  pbc.CustomerServiceClient
	DocSvc   pbd.DocumentServiceClient
	EntSvc   pbe.EntityServiceClient
	TxnSvc   pbt.TransactionServiceClient
	IDSvc    pbi.IdCheckServiceClient
	RulesSvc pbr.RulesEngineServiceClient
	pb.UnimplementedMockDataServiceServer
}

// Create adds a set of hard-coded transactions to the database for the tenant supplied in the context
func (m MockData) Create(ctx context.Context, req *pb.CreateRequest) (*pb.CreateResponse, error) {
	rsp, err := m.Exists(ctx, &pb.ExistsRequest{})
	if err != nil {
		return &pb.CreateResponse{}, status.Errorf(codes.Aborted, "error while checking sample data exists: %v", err)
	}
	if rsp.Mock {
		return &pb.CreateResponse{}, nil //status.Error(codes.OK, "")
	}

	octx, err := md.Outgoing(ctx)
	if err != nil {
		return &pb.CreateResponse{}, status.Errorf(codes.Aborted, "error: %v", err)
	}

	// add mock customers
	custIDMap, err := m.addCustomers(octx)
	if err != nil {
		return &pb.CreateResponse{}, status.Errorf(codes.Aborted, "error: %v", err)
	}

	// load documentation
	go func() {
		if err := m.loadDocs(octx, custIDMap); err != nil {
			log.Printf("An error occurred while loading documentation: %v", err)
		}
	}()

	// add mock transactions (in background)
	go func() {
		if err := m.addTransactions(octx, custIDMap); err != nil {
			log.Printf("An error occurred while loading mock transactions: %v", err)
		}
	}()

	return &pb.CreateResponse{}, nil
}

func (m MockData) addCustomers(octx context.Context) (map[string]string, error) {

	custs, err := m.Store.Customers()
	if err != nil {
		return nil, fmt.Errorf("an error occurred while fetching mock customers: %v", err)
	}

	// add customers
	custMap := make(map[string]string)

	for _, c := range custs {
		added, err := m.CustSvc.Add(octx, &pbc.AddRequest{Customer: c})
		if err != nil {
			return nil, err
		}

		// map placeholder id to actual id
		if added != nil {
			custMap[c.Id] = added.Customer.Id
		}
	}

	idMap := make(map[string]string)

	ents, rels, chks, err := m.Store.Entities()
	if err != nil {
		return nil, fmt.Errorf("an error occurred while fetching mock customer entities: %v", err)
	}

	// add entities
	for _, e := range ents {
		e.CustomerId = custMap[e.CustomerId]
		added, err := m.EntSvc.Add(octx, &pbe.AddRequest{Entity: e})
		if err != nil {
			return nil, err
		}

		// map placeholder id to actual id
		if added != nil {
			idMap[e.Id] = added.Entity.Id
		}
	}

	// link related entities
	for _, r := range rels {
		r.SourceEntity.Id = idMap[r.SourceEntity.Id]
		r.TargetEntity.Id = idMap[r.TargetEntity.Id]

		if _, err := m.EntSvc.Link(octx, &pbe.LinkRequest{Relationship: r}); err != nil {
			return nil, err
		}
	}

	// TODO: Reinstate when id checks are working
	// add ID checks
	for _, c := range chks {
		c.EntityId = idMap[c.EntityId]
		// if c.EntityId != "" {
		// _, err := m.IDSvc.Check(octx, c)
		// if err != nil {
		// 	return nil, err
		// }
		// }
	}

	// trigger insight generation
	if _, err := m.RulesSvc.Run(octx, &pbr.RunRequest{Entity: pbins.Entity_ENTITY_CUSTOMER}); err != nil {
		return nil, fmt.Errorf("error running customer rules: %v", err)
	}

	return idMap, nil
}

func (m MockData) loadDocs(octx context.Context, custIDMap map[string]string) error {

	for _, id := range custIDMap {
		ur := &pbd.UploadRequest{
			File: docFile,
			Document: &pbd.Document{
				Name:  "SourceOfFundsAndWealthGuidelines.pdf",
				Title: "Source of Funds",
				Scope: "entity/" + id,
			},
		}

		// upload document
		if _, err := m.DocSvc.Upload(octx, ur); err != nil {
			return fmt.Errorf("error adding document: %v", err)
		}
	}

	return nil
}

func (m MockData) addTransactions(octx context.Context, custIDMap map[string]string) error {

	txns, err := m.Store.Transactions()
	if err != nil {
		return fmt.Errorf("error fetching mock transactions: %v", err)
	}

	for _, t := range txns {
		t.CustomerNumber = custIDMap[t.CustomerNumber]
		if _, err = m.TxnSvc.Add(octx, &pbt.AddRequest{Transaction: t}); err != nil {
			return fmt.Errorf("error adding transaction %v: %v", t, err)
		}
	}

	// trigger insight generation
	if _, err := m.RulesSvc.Run(octx, &pbr.RunRequest{Entity: pbins.Entity_ENTITY_TRANSACTION}); err != nil {
		return fmt.Errorf("error running transaction rules: %v", err)
	}

	return nil
}

// Exists determines whether both mock and/or "user" data exists for tenant
func (m MockData) Exists(ctx context.Context, req *pb.ExistsRequest) (*pb.ExistsResponse, error) {

	octx, err := md.Outgoing(ctx)
	if err != nil {
		return &pb.ExistsResponse{}, status.Errorf(codes.Aborted, "error: %v", err)
	}

	// check for mock transactions
	trsp, err := m.TxnSvc.Query(octx, &pbt.QueryRequest{SourceRef: "mock", Limit: 1})
	if err != nil {
		return &pb.ExistsResponse{},
			status.Errorf(codes.Aborted, "error querying for transactions: %v", err)
	}

	matches := trsp.Matches

	// query all transactions
	trsp, err = m.TxnSvc.Query(octx, &pbt.QueryRequest{Limit: 1})
	if err != nil {
		return &pb.ExistsResponse{}, status.Errorf(codes.Aborted, "error: %v", err)
	}

	rsp := pb.ExistsResponse{
		Mock: (matches > 0),
		User: (matches != trsp.Matches),
	}

	// check for customers
	if !rsp.Mock && !rsp.User {
		crsp, err := m.EntSvc.Query(octx, &pbe.QueryRequest{SourceRef: "mock", Limit: 1})
		if err != nil {
			return &pb.ExistsResponse{}, status.Errorf(codes.Aborted, "error: %v", err)
		}

		matches = crsp.Matches

		crsp, err = m.EntSvc.Query(octx, &pbe.QueryRequest{Limit: 1})
		if err != nil {
			return &pb.ExistsResponse{}, status.Errorf(codes.Aborted, "error: %v", err)
		}

		rsp.Mock = (matches > 0)
		rsp.User = (matches != crsp.Matches)
	}

	rsp.Exists = (rsp.Mock || rsp.User)

	return &rsp, nil
}

// Delete removes the set of test transactions from the database for the tenant supplied in the context
func (m MockData) Delete(ctx context.Context, req *pb.DeleteRequest) (*pb.DeleteResponse, error) {
	octx, err := md.Outgoing(ctx)
	if err != nil {
		return &pb.DeleteResponse{}, status.Errorf(codes.Aborted, "error: %v", err)
	}

	// transactions
	if _, err := m.TxnSvc.Delete(octx, &pbt.DeleteRequest{SourceRef: "mock"}); err != nil {
		return &pb.DeleteResponse{}, status.Errorf(codes.Aborted, "error: %v", err)
	}

	// customers
	if err := m.deleteCustomers(octx); err != nil {
		return &pb.DeleteResponse{}, status.Errorf(codes.Aborted, "error: %v", err)
	}

	return &pb.DeleteResponse{}, nil
}

func (m MockData) deleteCustomers(octx context.Context) error {

	ersp, err := m.EntSvc.Query(octx, &pbe.QueryRequest{SourceRef: "mock"})
	if err != nil {
		return err
	}

	for _, e := range ersp.Data {
		if _, err := m.EntSvc.Delete(octx, &pbe.DeleteRequest{EntityId: e.Id}); err != nil {
			return err
		}

		// customers
		if e.CustomerId != "" {
			if _, err := m.CustSvc.Delete(octx, &pbc.DeleteRequest{CustomerId: e.CustomerId}); err != nil {
				return err
			}
		}

		// id checks
		if _, err := m.IDSvc.Delete(octx, &pbi.DeleteRequest{EntityId: e.Id}); err != nil {
			return err
		}
	}

	return nil
}
