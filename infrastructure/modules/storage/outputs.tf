
# export the orgfilestore access key so it can be added to a secret 
output "org_access_key" {
  value = azurerm_storage_account.org.primary_access_key
  # sensitive = true
}