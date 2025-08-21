
resource "kubernetes_manifest" "jwt" {
  provider = kubernetes-alpha
  manifest = {
    apiVersion = "security.istio.io/v1beta1"
    kind       = "RequestAuthentication"
    metadata = {
      name      = "jwt-auth"
      namespace = var.app_namespace
    }
    spec = {
      jwtRules = [
        {
          issuer               = var.jwt_issuer
          audiences            = [var.jwt_audience]
          jwksUri              = "${var.jwt_issuer}.well-known/jwks.json"
          forwardOriginalToken = true
        }
      ]
    }
  }
}