terraform {
  backend "remote" {
    hostname     = "app.terraform.io"
    organization = "anqa"

    workspaces {
      name = "Staging"
    }
  }
}

# ----------------------------------------------------------------
# configure providers — they are automatically available to child 
# modules
# ----------------------------------------------------------------
provider "azurerm" {
  tenant_id     = var.azure_secret.tenant_id
  client_id     = var.azure_secret.client_id
  client_secret = var.azure_secret.client_secret

  subscription_id = var.azure_secret.subscription_id
  features {}
}

provider "aws" {
  region     = "ap-southeast-2"
  access_key = var.aws_secret.access_key
  secret_key = var.aws_secret.secret_key
}

data "azurerm_subscription" "current" {}

locals {
  env           = data.azurerm_subscription.current.display_name == "Staging" ? "stg" : "prd"
  host_ext      = local.env == "stg" ? "-stg" : ""
  location      = "Australia East"
  app_namespace = "anqa"
  jwt_issuer    = "https://anqa${local.host_ext}.au.auth0.com/"
  jwt_audience  = "anqaml${local.host_ext}.com"
}

# resource groups
resource "azurerm_resource_group" "web" {
  name     = "web"
  location = local.location
}
resource "azurerm_resource_group" "backend" {
  name     = "backend"
  location = local.location
}
resource "azurerm_resource_group" "storage" {
  name     = "storage"
  location = local.location
}

# --------------------------------
# Observability
# --------------------------------

# log collector
module "filebeat" {
  source     = "./modules/filebeat"
  depends_on = [module.aks, module.elastic]
  elastic_log_secret = {
    cloud_id = module.elastic.log_secret.cloud_id
    api_key  = module.elastic.log_secret.api_key
  }
}

module "instana" {
  source     = "./modules/instana"
  depends_on = [module.aks]
  env        = local.env
}

# --------------------------------
# Messaging and Events 
# --------------------------------

# NATS event broker
module "nats" {
  source      = "./modules/nats"
  depends_on  = [module.aks]
  kube_config = module.aks.kube_config
}
