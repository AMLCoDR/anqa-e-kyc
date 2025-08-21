terraform {
  required_providers {
    auth0 = {
      source  = "alexkappa/auth0"
      version = "~> 0.21.0"
    }
  }
  required_version = ">= 0.14"
}

provider "auth0" {
  domain        = var.auth0_terraform_secret.domain
  client_id     = var.auth0_terraform_secret.client_id
  client_secret = var.auth0_terraform_secret.client_secret
}

locals {
  name_suffix = var.env == "stg" ? " Staging" : ""
}

resource "auth0_tenant" "tenant" {
  friendly_name = "Anqa AML${local.name_suffix}"
  picture_url   = "https://app${var.host_ext}.anqaml.com/logo-small.png"
  support_email = "support@anqaml.com"
}

resource "auth0_branding" "branding" {
  logo_url = "https://app${var.host_ext}.anqaml.com/logo-small.png"
  colors {
    primary         = "#04409B"
    page_background = "#FFFFFF"
  }
  font {}
}


