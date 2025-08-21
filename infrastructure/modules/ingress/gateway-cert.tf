resource "kubernetes_manifest" "certificate" {
  provider = kubernetes-alpha
  manifest = {
    apiVersion = "cert-manager.io/v1"
    kind       = "Certificate"
    metadata = {
      name      = "ingress-cert"
      namespace = "istio-system"
    }
    spec = {
      commonName = var.host_name
      dnsNames   = [var.host_name]
      secretName = local.tls_cert_secret
      issuerRef = {
        kind = "ClusterIssuer"
        name = local.issuer_name
      }
    }
  }
}