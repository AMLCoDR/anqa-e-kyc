package md

import (
	"context"
	"errors"
	"fmt"

	"google.golang.org/grpc/metadata"
)

func Tenant(ctx context.Context) string {
	t, _ := Value(ctx, "x-token-c-tenant")
	return t
}
func User(ctx context.Context) string {
	u, _ := Value(ctx, "x-token-c-user")
	return u
}
func Value(ctx context.Context, key string) (string, error) {
	md, ok := metadata.FromIncomingContext(ctx)
	if !ok {
		return "", errors.New("no incoming context")
	}

	values := md.Get(key)
	if len(values) == 0 || values[0] == "" {
		return "", fmt.Errorf("%s not found in context", key)
	}

	return values[0], nil
}

func Outgoing(ctx context.Context) (context.Context, error) {
	md, ok := metadata.FromIncomingContext(ctx)
	if !ok {
		return nil, errors.New("no incoming context")
	}
	return metadata.NewOutgoingContext(context.Background(), md), nil
}
