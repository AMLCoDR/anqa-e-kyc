# ------------------------------------------------------------
# Install service mesh egress gateway
# ------------------------------------------------------------

# generate manifest(s) from templates
data "helm_template" "egress" {
  name      = "istio-egress"
  namespace = "istio-system"
  chart     = "${local.chart_path}/gateways/istio-egress"

  set {
    name  = "gateways.istio-egressgateway.autoscaleMin"
    value = 2
  }
}

# split multi-doc manifests into individual documents
data "kubectl_file_documents" "egress" {
  content = data.helm_template.egress.manifest
}

# apply each document from manifests generated above
resource "kubectl_manifest" "egress" {
  depends_on = [kubectl_manifest.base]
  count      = length(data.kubectl_file_documents.egress.documents)
  yaml_body  = element(data.kubectl_file_documents.egress.documents, count.index)
}
