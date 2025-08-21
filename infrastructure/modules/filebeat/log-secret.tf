
resource "kubernetes_secret" "log_secret" {
  metadata {
    name      = "elastic-log-secret"
    namespace = "kube-system"
  }
  type = "Opaque"
  data = {
    ELASTIC_CLOUDID = var.elastic_log_secret.cloud_id
    ELASTIC_APIKEY  = var.elastic_log_secret.api_key
  }
}