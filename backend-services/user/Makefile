
-include .env
export MONGODB_HOST := $(value MONGODB_HOST)
export MONGODB_USER := $(value MONGODB_USER)
export MONGODB_PWD := $(value MONGODB_PWD)
export AUTH0_CLIENTID := $(value AUTH0_CLIENTID)
export AUTH0_SECRET := $(value AUTH0_SECRET)
export AUTH0_DOMAIN := $(value AUTH0_DOMAIN)
export AC_TOKEN := $(value AC_TOKEN)
export NATS_USERJWT := $(value NATS_USERJWT)
export NATS_NKEYSEED := $(value NATS_NKEYSEED)

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
