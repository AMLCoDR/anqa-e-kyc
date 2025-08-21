package srv

import (
	"context"
	"strings"

	"google.golang.org/genproto/googleapis/rpc/errdetails"
	"google.golang.org/grpc"
	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/status"
)

// UnaryValidationInterceptor parses proto-gen-validate errors into a structured response
// using `google.golang.org/genproto/googleapis/rpc/errdetails`.
func UnaryValidationInterceptor() grpc.UnaryServerInterceptor {
	return func(ctx context.Context, req interface{}, info *grpc.UnaryServerInfo, handler grpc.UnaryHandler) (resp interface{}, err error) {

		if v, ok := req.(interface{ ValidateAll() error }); ok {
			if err := v.ValidateAll(); err != nil {
				dets := &errdetails.BadRequest{}
				errs := strings.Split(err.Error(), ";")

				// create structured []FieldViolation response from validation string
				for _, e := range errs {
					// field
					fldStart := strings.Index(e, "invalid ")
					fld := ""
					if fldStart > -1 {
						start := fldStart + len("invalid ")
						end := strings.Index(e, ":")
						fld = e[start:end]
					}

					// message
					msg := ""
					// handle cases where regex has ": "
					msgStart := strings.LastIndex(e, ": ")
					if msgStart > -1 {
						msg = e[msgStart+2:]
					}

					// add FieldViolation
					dets.FieldViolations = append(dets.FieldViolations,
						&errdetails.BadRequest_FieldViolation{
							Field:       fld,
							Description: msg,
						},
					)
				}

				// add field validation details to status response
				s := status.New(codes.InvalidArgument, err.Error())
				s, err := s.WithDetails(dets)
				if err != nil {
					return resp, status.Errorf(codes.Aborted, "error: %v", err)
				}

				return resp, s.Err()
			}
		}

		return handler(ctx, req)
	}
}
