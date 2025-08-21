package tests

import (
	"context"
	"log"
	"os"
	"testing"

	"google.golang.org/grpc/metadata"

	// "github.com/anqaml/key-person/.tests/mock"
	"github.com/anqaml/key-person/server"
)

const (
	tenant = "0c6521a7-de23-46d8-941b-8d2875386f75"
	port   = 9443
)

func TestMain(m *testing.M) {

	// run service in background
	ready := make(chan *bool)
	go func() {
		s := server.New(port,
			server.WithReadyChan(ready),
		)
		if err := s.Start(); err != nil {
			log.Fatal(err)
		}
	}()

	// wait for service to start before running tests
	<-ready

	// run tests
	os.Exit(m.Run())
}

func makeContext() context.Context {
	return metadata.NewOutgoingContext(context.Background(),
		metadata.MD{
			"x-token-c-tenant": []string{tenant},
			"x-token-c-user":   []string{"Test User"},
		},
	)
}
