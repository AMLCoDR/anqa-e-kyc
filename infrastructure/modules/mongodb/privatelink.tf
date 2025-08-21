
# Create a MongoDB end for private endpoint
resource "mongodbatlas_privatelink_endpoint" "anqa" {
  project_id    = mongodbatlas_project.anqa.id
  provider_name = "AZURE"
  region        = "australiaeast"
}

# create Azure subnet for endpoint
data "azurerm_subnet" "anqa" {
  name                 = "aks-subnet"
  virtual_network_name = var.env == "stg" ? "aks-vnet-17835098" : "aks-vnet-33205340"
  resource_group_name  = "${var.resource_group.name}-aks"
}

# create Azure end for endpoint
resource "azurerm_private_endpoint" "anqa" {
  name                = "pe-anqa-${var.env}"
  location            = var.resource_group.location
  resource_group_name = "${var.resource_group.name}-aks"
  subnet_id           = data.azurerm_subnet.anqa.id

  private_service_connection {
    name                           = mongodbatlas_privatelink_endpoint.anqa.private_link_service_name
    private_connection_resource_id = mongodbatlas_privatelink_endpoint.anqa.private_link_service_resource_id
    is_manual_connection           = true
    request_message                = "anqa"
  }
}

# create service on MongoDB
resource "mongodbatlas_privatelink_endpoint_service" "anqa" {
  project_id                  = mongodbatlas_project.anqa.id
  private_link_id             = mongodbatlas_privatelink_endpoint.anqa.private_link_id
  endpoint_service_id         = azurerm_private_endpoint.anqa.id
  private_endpoint_ip_address = azurerm_private_endpoint.anqa.private_service_connection[0].private_ip_address
  provider_name               = "AZURE"
}
