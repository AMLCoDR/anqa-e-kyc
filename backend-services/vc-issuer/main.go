package main

import (
	_ "embed"

	"github.com/anqaml/vc-issuer/server"
)

//go:embed gen/proto/openapi/vcissuer/v1/vc_issuer.swagger.json
var swaggerJSON []byte

func main() {
	server.Serve()
}
