# ------------------------------------------------------------
# Configure mesh ingress gateway
#  - updates AWS A record
#  - installs cert-manager
#  - installs cluster-issuer with DNS resolver to generate Letsencrypt cert
# ------------------------------------------------------------

locals {
  issuer_name     = "zerossl"
  eab_secret_name = "zerossl-eab-secret"
  dns_secret_name = "dns-secret"
  tls_cert_secret = "ingress-tls-cert"
}

