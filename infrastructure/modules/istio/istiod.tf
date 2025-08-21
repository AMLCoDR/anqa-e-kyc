# ------------------------------------------------------------
# Install Istio Discovery (istiod)
# ------------------------------------------------------------

# generate manifest(s) from templates
data "helm_template" "istiod" {
  name      = "istiod"
  namespace = "istio-system"
  chart     = "${local.chart_path}/istio-control/istio-discovery"

  set {
    name  = "pilot.autoscaleMin"
    value = 2
  }
}

# split multi-doc manifests into individual documents
data "kubectl_file_documents" "istiod" {
  content = data.helm_template.istiod.manifest
}

# wait for ca cert to be generated and added to mutatingwebhookconfiguration istio-sidecar-injector
# see: https://istio.io/latest/docs/ops/common-problems/injection/
resource "time_sleep" "ca_cert" {
  depends_on      = [kubectl_manifest.base]
  create_duration = "60s"
}

# apply each document from manifests generated above
resource "kubectl_manifest" "istiod" {
  depends_on = [time_sleep.ca_cert]
  count      = length(data.kubectl_file_documents.istiod.documents)
  yaml_body  = element(data.kubectl_file_documents.istiod.documents, count.index)
}

# restart istiod to pick up ca cert
# kubectl -n istio-system patch deployment istiod \
# -p "{\"spec\":{\"template\":{\"metadata\":{\"labels\":{\"date\":\"`date +'%s'`\"}}}}}"
