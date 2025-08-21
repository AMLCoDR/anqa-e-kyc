# README #

The `subscription` microservice is responsible for maintaining and surfacing (to users) a tenant's Stripe subscription.

## Key take-aways
The service uses the Stripe API to create and update subscriptions.

It requests and makes available (to the front end) a unique URL users can use to access the Stripe customer portal directly.

The test depends on a stripe mock, run `stripe-mock` in another terminal before `make test`.

The service uses 2 Envoy filters to process Stripe webhook requests:
- `stripe-verify` is an Envoy Lua filter used to verify the signature of Stripe webhook requests
- `stripe-grpc` uses Enovy's gRPC/JSON transcoder filter to transacode JSON to gRPC and vice versa.

## Reading
Some useful links on gRPC/JSON transcoding:
  - https://cloud.google.com/endpoints/docs/grpc/transcoding
  - https://www.envoyproxy.io/docs/envoy/latest/api-v2/config/filter/http/transcoder/v2/transcoder.proto
  - https://github.com/tetratelabs/istio-tools/tree/master/grpc-transcoder

## Getting Started
If you are new to Avid development please read [this guide to getting started](https://github.com/anqaml/docs/wiki/Getting-Started).

## Notes

### Signature verification filter
- [Envoy Lua filter](https://www.envoyproxy.io/docs/envoy/latest/configuration/http/http_filters/lua_filter)
- [Lua SHA256 code](https://github.com/Egor-Skriptunoff/pure_lua_SHA)


### Virtual hosts and routing

Inspect virtual hosts:
```
  istioctl proxy-config route <pod> -o json > routes.json
```

Lua per router config:
While this is not currently used, it can be applied as an alternative to the subscription `workloadSelector`.

```
  configPatches:
  - applyTo: HTTP_ROUTE
    match:
      context: SIDECAR_INBOUND
      routeConfiguration:
        # name: default
        # portNumber: 8081
        vhost:
          name: inbound|http|8081
          route:
            name: default
            action: ROUTE
    patch:
      operation: MERGE
      value:
        typed_per_filter_config:
          envoy.filters.http.lua:
            "@type": type.googleapis.com/envoy.extensions.filters.http.lua.v3.LuaPerRoute
            source_code:
              inline_string: |
```

