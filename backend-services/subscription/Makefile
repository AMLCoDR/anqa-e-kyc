service := $(shell basename $(PWD))


# load env vars
-include .env
export MONGODB_HOST := $(value MONGODB_HOST)
export MONGODB_USER := $(value MONGODB_USER)
export MONGODB_PWD := $(value MONGODB_PWD)
export STRIPE_KEY := $(value STRIPE_KEY)
export STRIPE_WHSEC_CUST := $(value STRIPE_WHSEC_CUST)
export STRIPE_WHSEC_SUBN := $(value STRIPE_WHSEC_SUBN)

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