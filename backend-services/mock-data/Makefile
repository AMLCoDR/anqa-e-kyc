# service := $(shell basename $(PWD))

# load env vars
-include .env
export LD_KEY := $(value LD_KEY)

.PHONY: proto
proto:
	cd proto && buf mod update
	buf generate
	buf build
	cd proto && buf push

.PHONY: test
test:
	go test -v ./.tests
