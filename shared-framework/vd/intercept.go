package vd

import (
	"context"
	"strings"

	"google.golang.org/genproto/googleapis/rpc/errdetails"
	"google.golang.org/grpc"
	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/status"
)

type Validator interface {
	ValidateAll() error
}

// Interceptor to parse the proto validation error message to grpc errdetails response
func ValidationUnaryInterceptor() grpc.UnaryServerInterceptor {
	return func(ctx context.Context, req interface{}, info *grpc.UnaryServerInfo, handler grpc.UnaryHandler) (resp interface{}, err error) {
		if r, ok := req.(Validator); ok {
			if err := r.ValidateAll(); err != nil {
				st := status.New(codes.InvalidArgument, "Invalid arguments. Refer to field_violations")
				br := &errdetails.BadRequest{}
				ve := strings.Split(err.Error(), ";")

				for _, msg := range ve {
					// TODO: Proto validation returns a concantenation rather than an array. Fork to return array?
					// Given the messages can contain regex in descriptions, the extraction is being framed around common strings.
					msg = strings.TrimSpace(msg)

					// derive field name
					fMarker := "invalid "
					fMarkerIdx := strings.Index(msg, fMarker)
					f := "Unknown field"
					if fMarkerIdx > -1 {
						f = strings.TrimSpace(msg[fMarkerIdx+len(fMarker) : strings.Index(msg, ":")])
					}

					// derive message
					m := "No message"
					// Possible issue if regex has a ": " in the string?
					mMarkerIndex := strings.LastIndex(msg, ": ")
					if mMarkerIndex > -1 {
						m = strings.TrimSpace(msg[mMarkerIndex+2:])
					}

					br.FieldViolations = append(br.FieldViolations,
						&errdetails.BadRequest_FieldViolation{
							Field:       f,
							Description: m,
						})
				}

				st, err := st.WithDetails(br)
				if err != nil {
					return resp, status.Errorf(codes.Aborted, "error: %v", err)
				}
				
				return resp, st.Err()
			}
		}
		return handler(ctx, req)
	}
}
