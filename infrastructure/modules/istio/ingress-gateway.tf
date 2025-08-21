# ------------------------------------------------------------
# Install service mesh ingress gateway
# ------------------------------------------------------------

# generate manifest(s) from templates
data "helm_template" "ingress" {
  name      = "istio-ingress"
  namespace = "istio-system"
  chart     = "${local.chart_path}/gateways/istio-ingress"

  set {
    name  = "gateways.istio-ingressgateway.loadBalancerIP"
    value = var.ingress_ip
  }
  set {
    name  = "gateways.istio-ingressgateway.autoscaleMin"
    value = 2
  }
}

# split multi-doc manifests into individual documents
data "kubectl_file_documents" "ingress" {
  content = data.helm_template.ingress.manifest
}

# apply each document from manifests generated above
resource "kubectl_manifest" "ingress" {
  depends_on = [kubectl_manifest.base]
  count      = length(data.kubectl_file_documents.ingress.documents)
  yaml_body  = element(data.kubectl_file_documents.ingress.documents, count.index)
}
