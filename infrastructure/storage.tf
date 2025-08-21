# --------------------------------
# storage
# --------------------------------

module "elastic" {
  source = "./modules/elastic"
  env    = local.env
  apikey = var.elastic_console_secret
}

module "storage" {
  source         = "./modules/storage"
  env            = local.env
  resource_group = azurerm_resource_group.storage
}

module "mongodb" {
  source         = "./modules/mongodb"
  env            = local.env
  org            = var.mongodb_secret.org
  key            = var.mongodb_secret.public_key
  secret         = var.mongodb_secret.private_key
  app_user       = var.mongodb_secret.app_user
  app_password   = var.mongodb_secret.app_password
  data_user      = var.mongodb_secret.data_user
  data_password  = var.mongodb_secret.data_password
  ip_addresses   = var.ip_addresses
  azure_secret   = var.azure_secret
  key_identifier = module.key-vault.key_identifier
  key_vault_name = module.key-vault.key_vault_name
  resource_group = azurerm_resource_group.backend
}
