
resource "kubernetes_manifest" "tenant" {
  provider = kubernetes-alpha
  manifest = {
    apiVersion = "networking.istio.io/v1alpha3"
    kind       = "EnvoyFilter"
    metadata = {
      name      = "inject-tenant"
      namespace = var.app_namespace
    }
    spec = {
      configPatches = [{
        applyTo = "HTTP_FILTER"
        match = {
          context = "SIDECAR_INBOUND"
          listener = {
            filterChain = {
              filter = {
                name = "envoy.filters.network.http_connection_manager"
                subFilter = {
                  name = "envoy.filters.http.router"
                }
              }
            }
          }
        }
        patch = {
          operation = "INSERT_BEFORE"
          value = {
            name = "envoy.lua"
            typed_config = {
              "@type"    = "type.googleapis.com/envoy.extensions.filters.http.lua.v3.Lua"
              inlineCode = <<-EOT
                function envoy_on_request(request_handle)
                  local md = request_handle:streamInfo():dynamicMetadata():get("envoy.filters.http.jwt_authn")
                  if md ~= nil then
                    local claims = md["${var.jwt_issuer}"]
                    if claims ~= nil then
                      local tenant = claims["https://anqaml.com/tenantId"]
                      if tenant ~= nil then
                        request_handle:headers():add("x-token-c-tenant", tenant)
                      end
                      local user = claims["sub"]
                      if user ~= nil then
                        request_handle:headers():add("x-token-c-user", user)
                      end
                    end
                  end
                end
              EOT
            }
          }
        }
      }]
    }
  }
}

# debugging request metadata:
#   local dmd = request_handle:streamInfo():dynamicMetadata()
#   for key, value in pairs(dmd) do
#    request_handle:logCritical(key)
#   end

# alternative approach:
#   local md = request_handle:streamInfo():dynamicMetadata():get("istio_authn") 
#   local claims = md["request.auth.claims"]
#   local tenant = claims["https://anqaml.com/tenantId"][1]

# permissions
# function stringifyTable(t)
#   local s = "["
#   for key, value in pairs(t) do
#     s = s .. value .. ","
#   end
#   s = s .. "]"
#   return s
# end
#
# local permissions = claims["permissions"]
# if permissions ~= nil then
#   request_handle:headers():add("x-token-c-permissions", stringifyTable(permissions))
# end