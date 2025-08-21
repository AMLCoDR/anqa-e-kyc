# service := $(shell basename $(PWD))

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

#  test runs unit tests
.PHONY: test
test:
	go test -v ./.tests

# run-deps is called by a VS Code task (./vscode directory) when launching in debug mode.
# It will launch required dependencies such as port-forwarding
.PHONY: run-deps
run-deps:
	$(MAKE) stop-deps
	# pm2 start .vscode/port-fwd.js

# run-ui launches gRPCUI after the debugger has started
.PHONY: run-ui
run-ui:
	grpcui -plaintext --port=9444 \
		--default-header 'x-token-c-tenant: 67ca3e58-9536-4a70-b30e-6d8c15f87234' \
		--default-header 'x-token-c-user: auth0|1234' \
		localhost:9443

# stop-deps cleans up any dependencies started by run-deps after a debugging session
#  has completed.
.PHONY: stop-deps
stop-deps:
	# -pm2 kill
	-ps -ef | grep "grpcui" | grep -v grep | awk '{print $2}' | xargs kill
