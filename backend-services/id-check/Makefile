service := $(shell basename $(PWD))


# load env vars
-include .env
export MONGODB_HOST := $(value MONGODB_HOST)
export MONGODB_USER := $(value MONGODB_USER)
export MONGODB_PWD := $(value MONGODB_PWD)
export DZ_PWD_TEST := $(value DZ_PWD_TEST)
export DZ_PWD_LIVE := $(value DZ_PWD_LIVE)
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