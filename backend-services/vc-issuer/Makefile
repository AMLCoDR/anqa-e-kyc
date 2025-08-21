# service := $(shell basename $(PWD))

// TODO: export MATTR API credentials
# load env vars
-include .env
export MONGODB_HOST := $(value MONGODB_HOST)
export MONGODB_USER := $(value MONGODB_USER)
export MONGODB_PWD := $(value MONGODB_PWD)
export LD_KEY := $(value LD_KEY)

# proto generates code from the most recent proto file(s)
.PHONY: proto
proto:
	cd proto && buf mod update
	buf generate
	buf build
	cd proto && buf push

.PHONY: test
test:
	go test -v ./.tests