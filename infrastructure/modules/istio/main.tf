# ------------------------------------------------------------
# Install Istio core components (crds and istio-base)
# ------------------------------------------------------------

# N.B. Generate manifests from Helm templates to get around Helm update issue
# that causes Istio to lose ClusterIP (https://github.com/helm/helm/issues/7956).
# Provider: gavinbunney/kubectl

locals {
  chart_path = "${path.module}/charts"
}

# generate manifest(s) from templates
data "helm_template" "base" {
  name             = "istio-base"
  namespace        = "istio-system"
  create_namespace = true
  chart            = "${local.chart_path}/base"
  include_crds     = true
}

# split multi-doc manifests into individual documents
data "kubectl_file_documents" "base" {
  content = data.helm_template.base.manifest
}

# apply each document from manifests generated above
resource "kubectl_manifest" "base" {
  count     = length(data.kubectl_file_documents.base.documents)
  yaml_body = element(data.kubectl_file_documents.base.documents, count.index)
}
