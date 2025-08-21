terraform {
  required_providers {
    ec = {
      source  = "elastic/ec"
      version = "0.1.0-beta"
    }
  }
  required_version = ">= 0.14"
}

provider "ec" {
  apikey = var.apikey
}

// get latest Elastic version
data "ec_stack" "latest" {
  version_regex = "latest"
  region        = "azure-australiaeast"
  lock          = true
}
