# ----------------------
# Provision AKS cluster
# ----------------------
locals {
  cluster_name        = "aks-anqa-${var.env}"
  node_resource_group = "${var.resource_group.name}-aks"
}

resource "kubernetes_namespace" "anqa" {
  metadata {
    name = var.app_namespace
    labels = {
      istio-injection = "enabled"
    }
  }
}