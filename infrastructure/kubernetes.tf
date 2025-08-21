# --------------------------------
# kubernetes-specific
# --------------------------------

provider "kubernetes" {
  host                   = module.aks.kube_config.0.host
  client_key             = base64decode(module.aks.kube_config.0.client_key)
  client_certificate     = base64decode(module.aks.kube_config.0.client_certificate)
  cluster_ca_certificate = base64decode(module.aks.kube_config.0.cluster_ca_certificate)
}

# helm inherits the kubernetes provider
provider "helm" {
  kubernetes {
    host                   = module.aks.kube_config.0.host
    client_key             = base64decode(module.aks.kube_config.0.client_key)
    client_certificate     = base64decode(module.aks.kube_config.0.client_certificate)
    cluster_ca_certificate = base64decode(module.aks.kube_config.0.cluster_ca_certificate)
  }
}

# gavinbunney/kubectl - used to install Istio CRDs 
provider "kubectl" {
  host                   = module.aks.kube_config.0.host
  client_key             = base64decode(module.aks.kube_config.0.client_key)
  client_certificate     = base64decode(module.aks.kube_config.0.client_certificate)
  cluster_ca_certificate = base64decode(module.aks.kube_config.0.cluster_ca_certificate)
  load_config_file       = false
}

# ingress IP address
resource "azurerm_public_ip" "ingress" {
  name                = "ip-ingress-${local.env}"
  resource_group_name = "backend-aks"
  location            = local.location
  allocation_method   = "Static"
  sku                 = "Standard"
  availability_zone   = "Zone-Redundant"
  ip_tags = {
    "RoutingPreference" = "Internet"
  }
}

resource "azurerm_public_ip" "egress" {
  name                = "ip-egress-${local.env}"
  resource_group_name = "backend-aks"
  location            = local.location
  allocation_method   = "Static"
  sku                 = "Standard"
  availability_zone   = "Zone-Redundant"
  ip_tags = {
    "RoutingPreference" = "Internet"
  }
}

# add DNS entry for ingress
data "aws_route53_zone" "r53" {
  name = "anqaml.com"
}

resource "aws_route53_record" "api" {
  zone_id = data.aws_route53_zone.r53.zone_id
  name    = "api${local.host_ext}.anqaml.com"
  type    = "A"
  ttl     = "300"
  records = [azurerm_public_ip.ingress.ip_address]
}

# Kubernetes cluster
module "aks" {
  source         = "./modules/aks"
  env            = local.env
  resource_group = azurerm_resource_group.backend
  app_namespace  = local.app_namespace
  azure_secret   = var.azure_secret
  egress_ip      = azurerm_public_ip.egress
}

provider "kubernetes-alpha" {
  host                   = module.aks.kube_config[0].host
  client_key             = base64decode(module.aks.kube_config[0].client_key)
  client_certificate     = base64decode(module.aks.kube_config[0].client_certificate)
  cluster_ca_certificate = base64decode(module.aks.kube_config[0].cluster_ca_certificate)
}