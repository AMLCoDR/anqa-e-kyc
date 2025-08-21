
resource "kubernetes_manifest" "auth" {
  provider = kubernetes-alpha
  manifest = {
    apiVersion = "security.istio.io/v1beta1"
    kind       = "AuthorizationPolicy"
    metadata = {
      name      = "allow-services"
      namespace = var.app_namespace
    }
    spec = {
      action = "ALLOW"
      rules = [{
        from = [{
          source = {
            namespaces = [var.app_namespace]
          }
        }]
      }]
    }
  }
}