# --------------------------------
# Service Mesh
# --------------------------------

# Istio service mesh core
module "istio" {
  source        = "./modules/istio"
  depends_on    = [module.aks]
  istio_version = "1.10.3"
  ingress_ip    = azurerm_public_ip.ingress.ip_address
}

# anqa-specific mesh config
module "mesh" {
  source        = "./modules/mesh"
  depends_on    = [module.istio]
  app_namespace = local.app_namespace
  jwt_issuer    = local.jwt_issuer
  jwt_audience  = local.jwt_audience
}

# Istio mesh ingress
module "ingress" {
  source         = "./modules/ingress"
  depends_on     = [module.istio]
  host_name      = "api${local.host_ext}.anqaml.com" # local.api_host_name
  zerossl_secret = var.zerossl_secret
}