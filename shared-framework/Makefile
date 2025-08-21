.PHONY: proto
proto:
	buf beta mod update
	buf generate
	buf build
#	protoc -I=. --go_out=plugins=grpc,paths=source_relative:. \
#		_tests/messages.proto

.PHONY: test
test:
	go test -v ./_tests