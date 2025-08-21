# ------------------------------------------------------------
# Deploy react app infrastructure - storage, CDN, endpoint, etc.
# ------------------------------------------------------------

locals {
  host_ext = var.env == "stg" ? "-stg" : ""
}

resource "azurerm_storage_account" "go_app" {
  name                     = "stgoapp${var.env}"
  resource_group_name      = var.resource_group.name
  location                 = var.resource_group.location
  account_tier             = "Standard"
  account_replication_type = "GRS"

  static_website {
    index_document     = "index.html"
    error_404_document = "index.html"
  }
}
