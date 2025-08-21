#Single App Applications

resource "auth0_client" "spa" {
  for_each            = var.app
  name                = each.value.app_name
  description         = each.value.description
  app_type            = "spa"
  logo_uri            = "https://app${var.host_ext}.anqaml.com/logo-small.png"
  initiate_login_uri  = each.value.initiate_login_uri
  oidc_conformant     = true
  grant_types         = tolist(["authorization_code", "implicit", "refresh_token"])
  callbacks           = each.value.callbacks
  allowed_logout_urls = each.value.allowed_logout_urls
  sso                 = true

  web_origins = each.value.web_origins
  jwt_configuration {
    alg = "RS256"
  }
}

#Machine to Machine Applications
resource "auth0_client" "m2m" {
  name        = "User Management"
  description = "User Management"
  app_type    = "non_interactive"
  grant_types = tolist(["client_credentials"])
}

resource "auth0_client_grant" "client_grant" {
  depends_on = [auth0_client.m2m]
  client_id  = auth0_client.m2m.client_id
  audience   = "https://anqa${var.host_ext}.au.auth0.com/api/v2/"

  scope = [
    "read:users", "update:users", "delete:users", "create:users",
    "read:role_members", "create:role_members", "delete:role_members",
    "read:roles", "create:roles", "delete:roles", "update:roles"
  ]
}
