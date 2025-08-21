output "key_identifier" {
  value = "https://${azurerm_key_vault.anqa.name}.vault.azure.net/keys/${azurerm_key_vault_key.mongodb.name}/${azurerm_key_vault_key.mongodb.version}"
}

output "key_vault_name" {
  value = azurerm_key_vault.anqa.name
}