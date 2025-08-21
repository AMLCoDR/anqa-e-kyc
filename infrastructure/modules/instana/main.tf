# ------------------------------------------------------------
# Install Instana agent
# ------------------------------------------------------------

# generate manifest(s) from templates
data "helm_template" "instana" {
  name             = "instana-agent"
  repository       = "https://agents.instana.io/helm"
  chart            = "instana-agent"
  namespace        = "instana-agent"
  create_namespace = true

  set {
    name  = "agent.key"
    value = "wadtvr9QQkain6F9QKZ7ag"
  }
  set {
    name  = "agent.endpointHost"
    value = "ingress-orange-saas.instana.io"
  }
  set {
    name  = "agent.endpointPort"
    value = 443
  }
  set {
    name  = "cluster.name"
    value = "aks-anqa-${var.env}"
  }
  set {
    name  = "zone.name"
    value = ""
  }
  set {
    name  = "kubernetes.deployment.enabled"
    value = true
  }
  set {
    name  = "service.create"
    value = true
  }
}

# split multi-doc manifests into individual documents
data "kubectl_file_documents" "instana" {
  content = data.helm_template.instana.manifest
}

# apply each document from manifests generated above
resource "kubectl_manifest" "instana" {
  count     = length(data.kubectl_file_documents.instana.documents)
  yaml_body = element(data.kubectl_file_documents.instana.documents, count.index)
}

