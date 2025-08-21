
resource "kubernetes_manifest" "gateway" {
  provider = kubernetes-alpha
  manifest = {
    apiVersion = "networking.istio.io/v1beta1"
    kind       = "Gateway"
    metadata = {
      name      = "anqa-gateway"
      namespace = "anqa" # TODO: use var.app_namespace
    }
    spec = {
      selector = {
        istio = "ingressgateway"
      }
      servers = [
        {
          port = {
            number   = 80
            name     = "http"
            protocol = "HTTP"
          }
          hosts = [var.host_name]
          tls = {
            httpsRedirect = true
          }
        },
        {
          port = {
            number   = 443
            name     = "https"
            protocol = "HTTPS"
          }
          hosts = [var.host_name]
          tls = {
            mode           = "SIMPLE"
            credentialName = local.tls_cert_secret
          }
        }
      ]
    }
  }
}