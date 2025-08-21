
locals {
  host_ext = var.env == "stg" ? "-stg" : ""
}
# organisation blob store account
resource "azurerm_storage_account" "org" {
  name                     = "storg${var.env}"
  resource_group_name      = var.resource_group.name
  location                 = var.resource_group.location
  account_kind             = "StorageV2"
  account_tier             = "Standard"
  account_replication_type = "GRS"
  # allow_blob_public_access  = true

  blob_properties {
    cors_rule {
      allowed_headers    = ["*"]
      allowed_methods    = ["OPTIONS", "GET", "POST", "PUT", "PATCH", "DELETE"]
      allowed_origins    = ["http://localhost:3001", "https://app${local.host_ext}.anqaml.com", "https://shell${local.host_ext}.anqaml.com"]
      exposed_headers    = ["*"]
      max_age_in_seconds = 300
    }
  }
}
