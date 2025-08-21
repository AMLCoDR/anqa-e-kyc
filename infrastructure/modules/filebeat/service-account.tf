
resource "kubernetes_cluster_role" "filebeat" {
  metadata {
    name = "filebeat"
    labels = {
      k8s-app = "filebeat"
    }
  }
  rule {
    api_groups = [""]
    resources  = ["namespaces", "pods"]
    verbs      = ["get", "list", "watch"]
  }
}

resource "kubernetes_service_account" "filebeat" {
  metadata {
    name      = "filebeat"
    namespace = "kube-system"
    labels = {
      k8s-app = "filebeat"
    }
  }
}

resource "kubernetes_cluster_role_binding" "filebeat" {
  metadata {
    name = "filebeat"
  }
  subject {
    kind      = "ServiceAccount"
    name      = "filebeat"
    namespace = "kube-system"
  }
  role_ref {
    kind      = "ClusterRole"
    name      = "filebeat"
    api_group = "rbac.authorization.k8s.io"
  }
}