package srv

import (
	"context"

	"github.com/anqaml/go-svc/md"
	"google.golang.org/grpc"
	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/status"
)

// Auth Token interceptor
func UnaryMetadataInterceptor(exceptPaths ...string) grpc.UnaryServerInterceptor {
	ignore := map[string]bool{}
	for _, p := range exceptPaths {
		ignore[p] = true
	}

	return func(ctx context.Context, req interface{}, info *grpc.UnaryServerInfo, handler grpc.UnaryHandler) (resp interface{}, err error) {
		if excl, ok := ignore[info.FullMethod]; ok && excl {
			return handler(ctx, req)
		}

		_, err = md.Value(ctx, "x-token-c-tenant")
		if err != nil {
			return resp, status.Errorf(codes.Aborted, "%v", err)
		}
		_, err = md.Value(ctx, "x-token-c-user")
		if err != nil {
			return resp, status.Errorf(codes.Aborted, "%v", err)
		}
		return handler(ctx, req)
	}
}
