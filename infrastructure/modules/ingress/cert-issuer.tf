

# Route53 details
data "aws_route53_zone" "r53" {
  name = "anqaml.com"
}

# ZeroSSL external access binding secret
resource "kubernetes_secret" "eab" {
  metadata {
    name      = local.eab_secret_name
    namespace = "cert-manager"
  }
  data = {
    hmac-key = var.zerossl_secret.hmac_key
  }
}

# ClusterIssuer certificate issuer
resource "kubernetes_manifest" "cluster_issuer" {
  provider   = kubernetes-alpha
  depends_on = [helm_release.cert-manager]
  manifest = {
    apiVersion = "cert-manager.io/v1"
    kind       = "ClusterIssuer"
    metadata = {
      name = local.issuer_name
    }
    spec = {
      acme = {
        email  = "app@anqaml.com"
        server = "https://acme.zerossl.com/v2/DV90"
        externalAccountBinding = {
          keyID = var.zerossl_secret.key_id
          keySecretRef = {
            name = local.eab_secret_name
            key  = "hmac-key"
          }
          keyAlgorithm = "HS256"
        }
        privateKeySecretRef = {
          name = "ssl-private-key"
        }
        solvers = [
          {
            dns01 = {
              route53 = {
                region       = "ap-southeast-2"
                hostedZoneID = data.aws_route53_zone.r53.zone_id
                accessKeyID  = aws_iam_access_key.certmgr.id
                secretAccessKeySecretRef = {
                  name = local.dns_secret_name
                  key  = "secret-access-key"
                }
              }
            }
            selector = {
              dnsZones = [data.aws_route53_zone.r53.name]
            }
          }
        ]
      }
    }
  }
}