package v1

import (
	"context"

	"github.com/nats-io/nats.go"
	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/metadata"
	"google.golang.org/grpc/status"

	"github.com/anqaml/go-svc/md"
	"github.com/anqaml/user/ac"
	"github.com/anqaml/user/auth0"
	pb "github.com/anqaml/user/gen/proto/go/user/v1"
	"github.com/anqaml/user/store"
	pbr "go.buf.build/library/go-grpc/anqa/reporting-entity/reportingentity/v2"
)

// Users creates a receiver for proto rpc methods
type Users struct {
	Store  store.Store
	IDM    *auth0.Auth0
	Ac     *ac.ActiveCampaign
	OrgCli pbr.ReportingEntityServiceClient
	Broker *nats.EncodedConn
	pb.UnimplementedUserServiceServer
}

// SignUp implements the proto Add rpc request.
func (u Users) SignUp(ctx context.Context, req *pb.SignUpRequest) (*pb.SignUpResponse, error) {

	// create organisation
	octx := metadata.NewOutgoingContext(context.Background(), metadata.MD{})
	orgRsp, err := u.OrgCli.Create(octx, &pbr.CreateRequest{
		OrgName:      req.OrgName,
		ContactName:  req.Name,
		ContactEmail: req.Email,
	})
	if err != nil {
		return &pb.SignUpResponse{}, status.Errorf(codes.Aborted, "error: %v", err)
	}

	tenant := orgRsp.ReportingEntity.Id

	// add to IDM
	auth0ID, err := u.IDM.AddUser(tenant, req)
	if err != nil {
		return &pb.SignUpResponse{},
			status.Errorf(codes.Aborted, "error adding user %s to IDM: %v", req.Email, err)
	}

	// add user to "Owner" role
	if err = u.IDM.AssignRole(tenant, auth0.RoleOwner, auth0ID); err != nil {
		return &pb.SignUpResponse{},
			status.Errorf(codes.Aborted, "error adding user %s to role Owner: %v", req.Email, err)
	}

	// add to Active Campaign in background
	go func() {
		u.Ac.AddContact(req)
	}()

	user := &pb.User{
		Auth0Id: auth0ID,
		Email:   req.Email,
		Name:    req.Name,
	}

	// publish "USER.signedup" event
	msg := &pb.SignUpMsg{
		Tenant: tenant,
		User:   user,
	}

	if err := u.Broker.Publish("USER.signedup", msg); err != nil {
		return &pb.SignUpResponse{},
			status.Errorf(codes.Aborted, "error publishing \"USER.signedup\" event: %v", err)
	}

	// // save to db
	// rsp, err := u.Store.Save(*tenant, user)
	// if err != nil {
	// 	return rsp, err
	// }

	return &pb.SignUpResponse{}, nil
}

// Add implements the proto Add rpc request.
func (u Users) Add(ctx context.Context, req *pb.AddRequest) (*pb.AddResponse, error) {

	tenant, err := md.Value(ctx, "x-token-c-tenant")
	if err != nil {
		return &pb.AddResponse{}, status.Errorf(codes.Aborted, "error: %v", err)
	}

	// add to IDM, getting IDM id
	auth0ID, err := u.IDM.AddUser(tenant, &pb.SignUpRequest{
		Email: req.User.Email,
		Name:  req.User.Name,
	})
	if err != nil {
		return &pb.AddResponse{},
			status.Errorf(codes.Aborted, "error adding user %s to IDM: %v", req.User.Email, err)
	}

	// // save to db
	// rsp, err := u.Store.Save(*tenant, user)
	// if err != nil {
	// return &pb.AddResponse{},
	// 	status.Errorf(codes.Aborted, "error adding user %s to IDM: %v", req.User.Email, err)
	// }

	return &pb.AddResponse{
		User: &pb.User{
			Auth0Id: auth0ID,
			Email:   req.User.Email,
			Name:    req.User.Name,
		},
	}, nil
}

// Query implements the proto Query rpc request
func (u Users) Query(ctx context.Context, req *pb.QueryRequest) (*pb.QueryResponse, error) {

	tenant, err := md.Value(ctx, "x-token-c-tenant")
	if err != nil {
		return &pb.QueryResponse{}, status.Errorf(codes.Aborted, "error: %v", err)
	}

	rsp, err := u.IDM.ListUsers(tenant)
	if err != nil {
		return &pb.QueryResponse{},
			status.Errorf(codes.Aborted, "error retrieving users from IDM: %v", err)
	}

	// rsp, err := u.Store.Fetch(*tenant)
	// if err != nil {
	// 	status.Errorf(codes.Aborted, "error retrieving users: %v", err)
	// }

	return rsp, err
}

// Get implements the proto Get rpc request
func (u Users) Get(ctx context.Context, req *pb.GetRequest) (*pb.GetResponse, error) {

	return &pb.GetResponse{}, status.Error(codes.Unimplemented, "Get not implemented")

	// rsp, err := u.Store.Get(ctx, req)
	// if err != nil {
	// 	return &pb.UpdateResponse{}, status.Errorf(codes.Aborted, "error retrieving user %s: %v", req.Auth0Id, err)
	// }

	// return rsp, err
}

// Update implements the proto Update rpc request
func (u Users) Update(ctx context.Context, req *pb.UpdateRequest) (*pb.UpdateResponse, error) {

	return &pb.UpdateResponse{}, status.Error(codes.Unimplemented, "Update not implemented")

	// _, err = u.Store.Save(ctx, req)
	// if err != nil {
	// 	return &pb.UpdateResponse{}, status.Errorf(codes.Aborted, "error updating user %s: %v", req.Id, err)
	// }

	// return &pb.UpdateResponse{}, nil
}

// Delete implements the proto Delete rpc request
func (u Users) Delete(ctx context.Context, req *pb.DeleteRequest) (*pb.DeleteResponse, error) {

	tenant, err := md.Value(ctx, "x-token-c-tenant")
	if err != nil {
		return &pb.DeleteResponse{}, status.Errorf(codes.Aborted, "error: %v", err)
	}

	if err := u.IDM.DeleteUser(tenant, req); err != nil {
		return &pb.DeleteResponse{},
			status.Errorf(codes.Aborted, "error deleting user %d from IDM: %v", req.Auth0Id, err)
	}

	// if err := u.Store.Delete(*tenant, req); err != nil {
	// 	return &pb.DeleteResponse{}, status.Errorf(codes.Aborted, "error: %v", err)
	// }

	return &pb.DeleteResponse{}, nil
}
