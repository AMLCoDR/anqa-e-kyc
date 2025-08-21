
terraform state rm 'module.mongodb.mongodbatlas_privatelink_endpoint.anqa'
terraform state rm 'module.mongodb.mongodbatlas_privatelink_endpoint_service.anqa'
terraform state rm 'module.mongodb.azurerm_private_endpoint.anqa'

# {project_id}-{private_link_id}-{provider_name}-{region}
terraform import 'module.mongodb.mongodbatlas_privatelink_endpoint.anqa' "60bef78ea2b2da164c0db604-6103ad475d6f3467c169ba74-AZURE-australiaeast"
# {project_id}--{private_link_id}--{endpoint_service_id}--{provider_name}
terraform import 'module.mongodb.mongodbatlas_privatelink_endpoint_service.anqa' "60bef78ea2b2da164c0db604--6103ad475d6f3467c169ba74--/subscriptions/f2a191d1-fb7c-4628-b631-2161c04f50a0/resourceGroups/backend-aks/providers/Microsoft.Network/privateEndpoints/pe-anqa-stg--AZURE"
terraform import 'module.mongodb.azurerm_private_endpoint.anqa' "/subscriptions/f2a191d1-fb7c-4628-b631-2161c04f50a0/resourceGroups/backend-aks/providers/Microsoft.Network/privateEndpoints/pe-anqa-stg"

terraform import 'module.mongodb.mongodbatlas_privatelink_endpoint.anqa' "60bef78ea2b2da164c0db604-6103ad475d6f3467c169ba74-AZURE-australiaeast"
terraform import 'module.mongodb.mongodbatlas_privatelink_endpoint_service.anqa' "60bef78ea2b2da164c0db604--6103ad475d6f3467c169ba74--/subscriptions/ecf4a50d-15bd-463b-82a9-3a341e913ad2/resourceGroups/backend-aks/providers/Microsoft.Network/privateEndpoints/pe-anqa-prd--AZURE"
terraform import 'module.mongodb.azurerm_private_endpoint.anqa' "/subscriptions/ecf4a50d-15bd-463b-82a9-3a341e913ad2/resourceGroups/backend-aks/providers/Microsoft.Network/privateEndpoints/pe-anqa-prd"
