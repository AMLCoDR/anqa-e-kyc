package main

import (
	"log"
	"os"
	"time"

	ld "gopkg.in/launchdarkly/go-server-sdk.v5"
	"gopkg.in/launchdarkly/go-server-sdk.v5/ldcomponents"

	flag "github.com/anqaml/go-svc/flg"
	"github.com/anqaml/id-check/server"
)

func main() {
	// initialise feature flag client
	cfg := ld.Config{
		Logging: ldcomponents.NoLogging(),
		// Logging: ldcomponents.Logging().MinLevel(ldlog.Error),
	}
	ldCli, err := ld.MakeCustomClient(os.Getenv("LD_KEY"), cfg, 5*time.Second)
	if err != nil {
		log.Printf("error creating LaunchDarkly client: %v", err)
	}
	defer ldCli.Close()

	server.Serve(
		server.WithFlagClient(flag.NewClient(ldCli)),
	)
}
