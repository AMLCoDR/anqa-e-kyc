
# get the latest supported AKS version
data "azurerm_kubernetes_service_versions" "current" {
  location = var.resource_group.location
}

# create the cluster
resource "azurerm_kubernetes_cluster" "aks" {
  name                = local.cluster_name
  resource_group_name = var.resource_group.name
  location            = var.resource_group.location
  dns_prefix          = "api-${local.cluster_name}"
  node_resource_group = local.node_resource_group
  kubernetes_version  = data.azurerm_kubernetes_service_versions.current.latest_version

  network_profile {
    network_plugin = "kubenet"
    load_balancer_profile {
      outbound_ip_address_ids = [var.egress_ip.id]
    }
  }

  role_based_access_control {
    enabled = true
  }

  identity {
    type = "SystemAssigned"
  }

  default_node_pool {
    name                = "system"
    enable_auto_scaling = true
    # node_count          = 1
    min_count = 1
    max_count = 50
    # availability_zones   = [1, 2, 3]
    # os_disk_size_gb      = 1024
    vm_size              = "Standard_DS2_v2"
    orchestrator_version = data.azurerm_kubernetes_service_versions.current.latest_version
  }
}
