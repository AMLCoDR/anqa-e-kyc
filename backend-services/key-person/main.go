package main

import (
	"log"

	"github.com/anqaml/key-person/server"
)

func main() {
	s := server.New(9443)
	if err := s.Start(); err != nil {
		log.Fatal(err)
	}
}
