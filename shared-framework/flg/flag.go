package flag

import (
	"context"
	"log"

	"google.golang.org/grpc"
	"google.golang.org/protobuf/proto"
	"gopkg.in/launchdarkly/go-sdk-common.v2/lduser"
	"gopkg.in/launchdarkly/go-sdk-common.v2/ldvalue"
	"gopkg.in/launchdarkly/go-server-sdk.v5/interfaces"

	"github.com/anqaml/go-svc/md"
)

type FlagFunc func(context.Context, proto.Message) (proto.Message, error)
type Variation interface{}

type binding struct {
	flag string
	fns  map[Variation]FlagFunc
}

// look up:
//  1. info.FullMethod
//  2. user variation (for flag)

type Client struct {
	ldClient interfaces.LDClientInterface
	bindings map[string]binding
}

// NewClient creates an instance of the feature-flagging framework client.
// The client simplifies access to LaunchDarkly feature flags as well as centralising
// toggle-point management.
func NewClient(cli interfaces.LDClientInterface) *Client {
	return &Client{
		ldClient: cli,
		bindings: make(map[string]binding),
	}
}

// Method provides an interface for binding a specific method to a feature flag variation.
// Linking a method to flag state means code does not need to be conditionally toggled
// directly.
type Method func(c *Client, flag string) error

// BoolMethod allows the caller to bind a method to the specified flag variation.
// The method provided needs to implement
func BoolMethod(path string, variation bool, fn FlagFunc) Method {
	return func(c *Client, flag string) error {

		b, ok := c.bindings[path]
		if !ok {
			b = binding{
				fns: make(map[Variation]FlagFunc),
			}
		}

		b.flag = flag
		b.fns[variation] = fn
		c.bindings[path] = b

		return nil
	}
}

// Register links flag state with the method(s) that implement
// the functionality for the state
func (c *Client) RegisterMethod(flag string, methods ...Method) error {

	for _, m := range methods {
		if err := m(c, flag); err != nil {
			return err
		}
	}

	return nil
}

func (c *Client) Interceptor() grpc.UnaryServerInterceptor {
	return func(ctx context.Context, req interface{}, info *grpc.UnaryServerInfo, handler grpc.UnaryHandler) (interface{}, error) {
		or, ok := c.bindings[info.FullMethod]
		if ok {
			userVar := true
			// if or.Flag == ld.Flag {

			// }
			return or.fns[userVar](ctx, req.(proto.Message))
		}
		return handler(ctx, req)
	}
}

// Evaluate provides a straightforward method to evaluate a feature flag directly without the need
// to register methods, etc..
func (c *Client) Evaluate(ctx context.Context, flag string) bool {

	tenant, err := md.Value(ctx, "x-token-c-tenant")
	if err != nil {
		log.Printf("Error evaluating flag %s for tenant: %v", flag, err)
		return false
	}
	userID, err := md.Value(ctx, "x-token-c-user")
	if err != nil {
		log.Printf("Error evaluating flag %s for user: %v", flag, err)
		return false
	}

	user := lduser.NewUserBuilder(userID).
		Custom("tenant", ldvalue.String(tenant)).
		Build()

	state, err := c.ldClient.BoolVariation(flag, user, false)
	if err != nil {
		log.Printf("Error calling LaunchDarkly client: %v", err)
		return false
	}

	return state
}
