# ------------------------------------------------------------------
# Create an application service principal for AKS cluster to run as
# ------------------------------------------------------------------

# resource "azuread_application" "sp" {
#   name = "sp-${var.env}"
# }

# resource "azuread_service_principal" "sp" {
#   application_id               = azuread_application.sp.application_id
#   app_role_assignment_required = false
# }

# resource "azuread_service_principal_password" "sp" {
#   service_principal_id = azuread_service_principal.sp.id
#   value                = random_string.sp_password.result
#   end_date_relative    = "8760h" # 1 year

#   lifecycle {
#     ignore_changes = [
#       value,
#       end_date_relative
#     ]
#   }
# }

# resource "azuread_application_password" "sp" {
#   application_object_id = azuread_application.sp.id
#   value                 = random_string.sp_secret.result
#   end_date_relative     = "8760h" # 1 year

#   lifecycle {
#     ignore_changes = [
#       value,
#       end_date_relative
#     ]
#   }
# }

# data "azurerm_container_registry" "acr" {
#   name                = "anqahub"
#   resource_group_name = var.resource_group.name
# }

# resource "azurerm_role_assignment" "sp_container_registry" {
#   scope                = data.azurerm_container_registry.acr.id
#   role_definition_name = "AcrPull"
#   principal_id         = azuread_service_principal.sp.object_id
# }
