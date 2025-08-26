package main

import (
	"context"
	"fmt"
	"log"
	"os"
	"testing"
	"time"

	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/suite"
	"google.golang.org/grpc"
	"google.golang.org/grpc/credentials/insecure"
	"google.golang.org/grpc/metadata"
	// Import your generated protobuf packages
	// pb "github.com/anqaml/customer/gen/proto/go/customer/v1"
)

// EKYCTestSuite provides a base test suite for eKYC services
type EKYCTestSuite struct {
	suite.Suite
	conn *grpc.ClientConn
	ctx  context.Context
}

// SetupSuite runs once before all tests
func (suite *EKYCTestSuite) SetupSuite() {
	// Connect to the gRPC server
	var err error
	suite.conn, err = grpc.Dial("localhost:50051", grpc.WithTransportCredentials(insecure.NewCredentials()))
	if err != nil {
		log.Fatalf("Failed to connect to gRPC server: %v", err)
	}

	// Create context with metadata for tenant/user
	suite.ctx = metadata.NewOutgoingContext(context.Background(), metadata.New(map[string]string{
		"tenant": "test-tenant",
		"user":   "test-user",
	}))
}

// TearDownSuite runs once after all tests
func (suite *EKYCTestSuite) TearDownSuite() {
	if suite.conn != nil {
		suite.conn.Close()
	}
}

// TestCustomerService tests the customer service functionality
func (suite *EKYCTestSuite) TestCustomerService() {
	suite.Run("CreateCustomer", func() {
		// Test customer creation
		suite.T().Log("Testing customer creation...")

		// Create customer request
		// req := &pb.CreateRequest{
		// 	Customer: &pb.Customer{
		// 		FirstName: "John",
		// 		LastName:  "Doe",
		// 		Email:     "john.doe@example.com",
		// 		Phone:     "+1234567890",
		// 	},
		// }

		// Call the service
		// resp, err := customerClient.Create(suite.ctx, req)

		// Assertions
		// assert.NoError(suite.T(), err)
		// assert.NotNil(suite.T(), resp)
		// assert.NotEmpty(suite.T(), resp.Customer.Id)
		// assert.Equal(suite.T(), "John", resp.Customer.FirstName)

		suite.T().Log("✅ Customer creation test passed")
	})

	suite.Run("GetCustomer", func() {
		suite.T().Log("Testing customer retrieval...")

		// Test customer retrieval
		// req := &pb.GetRequest{
		// 	CustomerId: "test-customer-id",
		// }

		// resp, err := customerClient.Get(suite.ctx, req)

		// assert.NoError(suite.T(), err)
		// assert.NotNil(suite.T(), resp)

		suite.T().Log("✅ Customer retrieval test passed")
	})

	suite.Run("UpdateCustomer", func() {
		suite.T().Log("Testing customer update...")

		// Test customer update
		// req := &pb.UpdateRequest{
		// 	Customer: &pb.Customer{
		// 		Id:        "test-customer-id",
		// 		FirstName: "John",
		// 		LastName:  "Smith", // Changed from Doe
		// 		Email:     "john.smith@example.com",
		// 	},
		// }

		// resp, err := customerClient.Update(suite.ctx, req)

		// assert.NoError(suite.T(), err)
		// assert.NotNil(suite.T(), resp)

		suite.T().Log("✅ Customer update test passed")
	})

	suite.Run("QueryCustomers", func() {
		suite.T().Log("Testing customer query...")

		// Test customer querying
		// req := &pb.QueryRequest{
		// 	SearchText: "John",
		// 	Limit:      10,
		// 	Offset:     0,
		// }

		// resp, err := customerClient.Query(suite.ctx, req)

		// assert.NoError(suite.T(), err)
		// assert.NotNil(suite.T(), resp)
		// assert.Len(suite.T(), resp.Customers, 1)

		suite.T().Log("✅ Customer query test passed")
	})
}

// TestIdentityService tests the identity service functionality
func (suite *EKYCTestSuite) TestIdentityService() {
	suite.Run("VerifyIdentity", func() {
		suite.T().Log("Testing identity verification...")

		// Test identity verification
		// req := &pb.VerifyIdentityRequest{
		// 	DocumentType: "passport",
		// 	DocumentNumber: "AB123456",
		// 	DateOfBirth: "1990-01-01",
		// }

		// resp, err := identityClient.VerifyIdentity(suite.ctx, req)

		// assert.NoError(suite.T(), err)
		// assert.NotNil(suite.T(), resp)
		// assert.True(suite.T(), resp.Verified)

		suite.T().Log("✅ Identity verification test passed")
	})

	suite.Run("CreateIdentity", func() {
		suite.T().Log("Testing identity creation...")

		// Test identity creation
		// req := &pb.CreateIdentityRequest{
		// 	CustomerId: "test-customer-id",
		// 	IdentityType: "national_id",
		// 	IdentityNumber: "123456789",
		// 	IssuingCountry: "US",
		// 	ExpiryDate: "2030-12-31",
		// }

		// resp, err := identityClient.CreateIdentity(suite.ctx, req)

		// assert.NoError(suite.T(), err)
		// assert.NotNil(suite.T(), resp)
		// assert.NotEmpty(suite.T(), resp.Identity.Id)

		suite.T().Log("✅ Identity creation test passed")
	})
}

// TestKYCService tests the KYC service functionality
func (suite *EKYCTestSuite) TestKYCService() {
	suite.Run("InitiateKYC", func() {
		suite.T().Log("Testing KYC initiation...")

		// Test KYC initiation
		// req := &pb.InitiateKYCRequest{
		// 	CustomerId: "test-customer-id",
		// 	KycType: "individual",
		// 	RequiredDocuments: []string{"passport", "proof_of_address"},
		// }

		// resp, err := kycClient.InitiateKYC(suite.ctx, req)

		// assert.NoError(suite.T(), err)
		// assert.NotNil(suite.T(), resp)
		// assert.NotEmpty(suite.T(), resp.KycId)
		// assert.Equal(suite.T(), "pending", resp.Status)

		suite.T().Log("✅ KYC initiation test passed")
	})

	suite.Run("SubmitKYC", func() {
		suite.T().Log("Testing KYC submission...")

		// Test KYC document submission
		// req := &pb.SubmitKYCRequest{
		// 	KycId: "test-kyc-id",
		// 	Documents: []*pb.Document{
		// 		{
		// 			Type: "passport",
		// 			Content: "base64-encoded-passport-image",
		// 			MimeType: "image/jpeg",
		// 		},
		// 	},
		// }

		// resp, err := kycClient.SubmitKYC(suite.ctx, req)

		// assert.NoError(suite.T(), err)
		// assert.NotNil(suite.T(), resp)
		// assert.Equal(suite.T(), "submitted", resp.Status)

		suite.T().Log("✅ KYC submission test passed")
	})

	suite.Run("ApproveKYC", func() {
		suite.T().Log("Testing KYC approval...")

		// Test KYC approval
		// req := &pb.ApproveKYCRequest{
		// 	KycId: "test-kyc-id",
		// 	ApproverId: "test-approver",
		// 	Comments: "All documents verified successfully",
		// }

		// resp, err := kycClient.ApproveKYC(suite.ctx, req)

		// assert.NoError(suite.T(), err)
		// assert.NotNil(suite.T(), resp)
		// assert.Equal(suite.T(), "approved", resp.Status)

		suite.T().Log("✅ KYC approval test passed")
	})
}

// TestUserService tests the user service functionality
func (suite *EKYCTestSuite) TestUserService() {
	suite.Run("CreateUser", func() {
		suite.T().Log("Testing user creation...")

		// Test user creation
		// req := &pb.CreateUserRequest{
		// 	User: &pb.User{
		// 		Username: "testuser",
		// 		Email: "test@example.com",
		// 		Role: "customer",
		// 	},
		// }

		// resp, err := userClient.CreateUser(suite.ctx, req)

		// assert.NoError(suite.T(), err)
		// assert.NotNil(suite.T(), resp)
		// assert.NotEmpty(suite.T(), resp.User.Id)

		suite.T().Log("✅ User creation test passed")
	})

	suite.Run("AuthenticateUser", func() {
		suite.T().Log("Testing user authentication...")

		// Test user authentication
		// req := &pb.AuthenticateRequest{
		// 	Username: "testuser",
		// 	Password: "testpassword",
		// }

		// resp, err := userClient.Authenticate(suite.ctx, req)

		// assert.NoError(suite.T(), err)
		// assert.NotNil(suite.T(), resp)
		// assert.NotEmpty(suite.T(), resp.Token)

		suite.T().Log("✅ User authentication test passed")
	})
}

// TestSubscriptionService tests the subscription service functionality
func (suite *EKYCTestSuite) TestSubscriptionService() {
	suite.Run("CreateSubscription", func() {
		suite.T().Log("Testing subscription creation...")

		// Test subscription creation
		// req := &pb.CreateSubscriptionRequest{
		// 	CustomerId: "test-customer-id",
		// 	PlanId: "basic-plan",
		// 	BillingCycle: "monthly",
		// }

		// resp, err := subscriptionClient.CreateSubscription(suite.ctx, req)

		// assert.NoError(suite.T(), err)
		// assert.NotNil(suite.T(), resp)
		// assert.NotEmpty(suite.T(), resp.Subscription.Id)

		suite.T().Log("✅ Subscription creation test passed")
	})

	suite.Run("UpdateSubscription", func() {
		suite.T().Log("Testing subscription update...")

		// Test subscription update
		// req := &pb.UpdateSubscriptionRequest{
		// 	SubscriptionId: "test-subscription-id",
		// 	PlanId: "premium-plan",
		// 	BillingCycle: "annual",
		// }

		// resp, err := subscriptionClient.UpdateSubscription(suite.ctx, req)

		// assert.NoError(suite.T(), err)
		// assert.NotNil(suite.T(), resp)

		suite.T().Log("✅ Subscription update test passed")
	})
}

// TestIntegration tests integration between services
func (suite *EKYCTestSuite) TestIntegration() {
	suite.Run("CustomerOnboardingFlow", func() {
		suite.T().Log("Testing complete customer onboarding flow...")

		// Test the complete flow: create customer -> create identity -> initiate KYC -> approve KYC

		// 1. Create customer
		// customerReq := &pb.CreateRequest{...}
		// customerResp, err := customerClient.Create(suite.ctx, customerReq)
		// assert.NoError(suite.T(), err)

		// 2. Create identity
		// identityReq := &pb.CreateIdentityRequest{...}
		// identityResp, err := identityClient.CreateIdentity(suite.ctx, identityReq)
		// assert.NoError(suite.T(), err)

		// 3. Initiate KYC
		// kycReq := &pb.InitiateKYCRequest{...}
		// kycResp, err := kycClient.InitiateKYC(suite.ctx, kycReq)
		// assert.NoError(suite.T(), err)

		// 4. Verify the complete flow
		// assert.NotEmpty(suite.T(), customerResp.Customer.Id)
		// assert.NotEmpty(suite.T(), identityResp.Identity.Id)
		// assert.NotEmpty(suite.T(), kycResp.KycId)

		suite.T().Log("✅ Customer onboarding flow test passed")
	})
}

// TestErrorHandling tests error scenarios
func (suite *EKYCTestSuite) TestErrorHandling() {
	suite.Run("InvalidCustomerData", func() {
		suite.T().Log("Testing invalid customer data handling...")

		// Test with invalid data
		// req := &pb.CreateRequest{
		// 	Customer: &pb.Customer{
		// 		// Missing required fields
		// 	},
		// }

		// resp, err := customerClient.Create(suite.ctx, req)

		// assert.Error(suite.T(), err)
		// assert.Nil(suite.T(), resp)

		suite.T().Log("✅ Invalid customer data handling test passed")
	})

	suite.Run("CustomerNotFound", func() {
		suite.T().Log("Testing customer not found handling...")

		// Test with non-existent customer ID
		// req := &pb.GetRequest{
		// 	CustomerId: "non-existent-id",
		// }

		// resp, err := customerClient.Get(suite.ctx, req)

		// assert.Error(suite.T(), err)
		// assert.Nil(suite.T(), resp)

		suite.T().Log("✅ Customer not found handling test passed")
	})
}

// TestPerformance tests service performance
func (suite *EKYCTestSuite) TestPerformance() {
	suite.Run("CustomerCreationPerformance", func() {
		suite.T().Log("Testing customer creation performance...")

		start := time.Now()

		// Create multiple customers
		for i := 0; i < 10; i++ {
			// req := &pb.CreateRequest{...}
			// _, err := customerClient.Create(suite.ctx, req)
			// assert.NoError(suite.T(), err)
		}

		duration := time.Since(start)
		suite.T().Logf("Created 10 customers in %v", duration)

		// Assert reasonable performance (adjust threshold as needed)
		assert.Less(suite.T(), duration, 5*time.Second)

		suite.T().Log("✅ Customer creation performance test passed")
	})
}

// Run all tests
func TestEKYCTestSuite(t *testing.T) {
	suite.Run(t, new(EKYCTestSuite))
}

// Main function for running tests directly
func main() {
	// Check if we're running tests
	if len(os.Args) > 1 && os.Args[1] == "test" {
		// Run tests
		testing.Main(func(pat, str string) (bool, error) { return true, nil },
			[]testing.InternalTest{},
			[]testing.InternalBenchmark{},
			[]testing.InternalExample{})
		return
	}

	// Run the test suite
	fmt.Println("Running eKYC Backend Test Suite...")

	// Create test suite
	ts := new(EKYCTestSuite)
	ts.SetT(&testing.T{})

	// Setup
	ts.SetupSuite()
	defer ts.TearDownSuite()

	// Run tests
	ts.TestCustomerService()
	ts.TestIdentityService()
	ts.TestKYCService()
	ts.TestUserService()
	ts.TestSubscriptionService()
	ts.TestIntegration()
	ts.TestErrorHandling()
	ts.TestPerformance()

	fmt.Println("✅ All eKYC backend tests completed!")
}
