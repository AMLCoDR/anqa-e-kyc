# ------------------------------------------------------------
# Module installs core components of the NATS message broker
# ------------------------------------------------------------

resource "helm_release" "nats" {
  name             = "nats"
  namespace        = "nats"
  create_namespace = true
  repository       = "https://nats-io.github.io/k8s/helm/charts/"
  chart            = "nats"
}