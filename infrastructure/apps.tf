# --------------------------------
# Apps
# --------------------------------

# app secrets
module "secrets" {
  source        = "./modules/secrets"
  depends_on    = [module.aks]
  app_namespace = local.app_namespace
  secrets = {
    stripe-secret = {
      STRIPE_KEY        = var.stripe_secret.stripe_key
      STRIPE_WHSEC_CUST = var.stripe_secret.cust_webhook_secret
      STRIPE_WHSEC_SUBN = var.stripe_secret.subn_webhook_secret
    }
    datazoo-secret = {
      DZ_PWD_TEST = var.datazoo_secret.password_test
      DZ_PWD_LIVE = var.datazoo_secret.password_live
    }
    auth0-secret = {
      AUTH0_DOMAIN   = var.auth0_usermgt_secret.domain
      AUTH0_CLIENTID = var.auth0_usermgt_secret.client_id
      AUTH0_SECRET   = var.auth0_usermgt_secret.client_secret
    }
    org-blob-store = {
      ACCOUNT_KEY  = module.storage.org_access_key
      ACCOUNT_NAME = "storg${local.env}"
    }
    elastic-data-secret = {
      ELASTIC_CLOUDID = module.elastic.data_secret.cloud_id
      ELASTIC_APIKEY  = module.elastic.data_secret.api_key
    }
    mongodb-secret = {
      MONGODB_HOST = module.mongodb.mongo_host
      MONGODB_USER = var.mongodb_secret.app_user
      MONGODB_PWD  = var.mongodb_secret.app_password
    }
    launchdarkly-secret = {
      LD_KEY = var.launchdarkly_secret
    }
    optimizely-secret = {
      OPTIMIZELY_KEY = var.optimizely_secret
    }
    mixpanel-secret = {
      MXP_USER   = var.mixpanel_secret.user
      MXP_SECRET = var.mixpanel_secret.secret
    }
    activecampaign-secret = {
      AC_TOKEN = var.activecampaign_secret
    }
  }
  ghcr_secret = var.ghcr_secret
}

# React app (app.anqaml.com)
module "react" {
  source         = "./modules/react"
  env            = local.env
  subscription   = data.azurerm_subscription.current
  resource_group = azurerm_resource_group.web
  azure_secret   = var.azure_secret
  hosts = [
    "adminportal",
    "customer",
    "shell",
    "insight",
    "transaction",
    "components",
    "verification",
    "organisation"
  ]
  aliases = {
    shell = "app"
  }
}

# React "go" application. (go.anqaml.com)
module "go-app" {
  source         = "./modules/go-app"
  env            = local.env
  subscription   = data.azurerm_subscription.current
  resource_group = azurerm_resource_group.web
  azure_secret   = var.azure_secret
  hosts = [
    "launcher",
    "certifier",
    "shell",
    "customer"
  ]
  aliases = {
    launcher = "go"
  }
}

# deploy services
module "services" {
  source         = "./modules/services"
  depends_on     = [module.mesh]
  subscription   = data.azurerm_subscription.current.display_name
  circleci_token = var.circleci_secret
  services = [
    "cust-entity",
    "document",
    "id-check",
    "insight",
    "mock-data",
    "notification",
    "organisation",
    "rules-engine",
    "subscription",
    "transaction",
    "txn-graph",
    "user"
  ]
}
