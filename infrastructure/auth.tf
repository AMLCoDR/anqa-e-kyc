# --------------------------------
# Auth
# --------------------------------

locals {
  app_web_callbacks       = local.env == "stg" ? ["https://www-stg.anqaml.com/callback", "https://app-stg.anqaml.com", "https://shell-stg.anqaml.com", "http://localhost:3000", "http://localhost:3001", "http://localhost:3002", "http://localhost:3003", "http://localhost:3004", "http://localhost:3005", "http://localhost:3006", "http://localhost:3007", "https://go-stg.anqaml.com", "https://go-shell-stg.anqaml.com", "http://127.0.0.1:3001"] : ["https://www.anqaml.com/callback", "https://app.anqaml.com", "https://shell.anqaml.com"]
  app_web_origins         = local.env == "stg" ? ["https://app-stg.anqaml.com", "https://shell-stg.anqaml.com", "http://localhost:3000", "http://localhost:3001", "http://localhost:3002", "http://localhost:3003", "http://localhost:3004", "http://localhost:3005", "http://localhost:3006", "http://localhost:3007", "https://go-stg.anqaml.com", "https://go-shell-stg.anqaml.com", "http://127.0.0.1:3001"] : ["https://app.anqaml.com", "https://shell.anqaml.com"]
  app_allowed_logout_urls = local.env == "stg" ? ["https://www-stg.anqaml.com", "http://localhost:3000", "http://localhost:3001", "http://localhost:3002", "http://localhost:3003", "http://localhost:3004", "http://localhost:3005", "http://localhost:3006", "http://localhost:3007"] : ["https://www.anqaml.com"]
  admin_urls              = local.env == "stg" ? ["https://adminportal-stg.anqaml.com", "http://localhost:3002"] : ["https://adminportal.anqaml.com"]
}

module "auth0" {
  source                 = "./modules/auth0"
  env                    = local.env
  host_ext               = local.host_ext
  auth0_terraform_secret = var.auth0_terraform_secret
  app = {
    anqaweb = {
      app_name            = "Anqa Web"
      description         = "Core app"
      callbacks           = tolist(local.app_web_callbacks),
      web_origins         = tolist(local.app_web_origins),
      allowed_logout_urls = tolist(local.app_allowed_logout_urls),
      initiate_login_uri  = "https://app${local.host_ext}.anqaml.com"
    }
    adminportal = {
      app_name            = "Admin Portal"
      description         = "Portal app"
      callbacks           = tolist(local.admin_urls),
      web_origins         = tolist(local.admin_urls),
      allowed_logout_urls = tolist(local.admin_urls),
      initiate_login_uri  = "https://adminportal${local.host_ext}.anqaml.com"
    }
  }
}

module "key-vault" {
  source         = "./modules/key-vault"
  resource_group = azurerm_resource_group.backend
  env            = local.env
}
