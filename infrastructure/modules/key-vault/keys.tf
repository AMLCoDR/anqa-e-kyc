resource "azurerm_key_vault_key" "mongodb" {
  name         = "key-mongodb-${var.env}"
  key_vault_id = azurerm_key_vault.anqa.id
  key_type     = "RSA"
  key_size     = 4096

  key_opts = [
    "decrypt",
    "encrypt",
    "sign",
    "unwrapKey",
    "verify",
    "wrapKey",
  ]
}
