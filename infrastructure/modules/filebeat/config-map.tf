# See # https://www.elastic.co/guide/en/beats/filebeat/current/configuration-autodiscover.html

resource "kubernetes_config_map" "filebeat" {
  metadata {
    name      = "filebeat-config"
    namespace = "kube-system"
    labels = {
      k8s-app = "filebeat"
    }
  }
  data = {
    "filebeat.yml" = <<-EOF
      filebeat.autodiscover:
        providers:
          - type: kubernetes
            node: $${NODE_NAME}
            hints.enabled: true
            hints.default_config:
              type: container
              paths:
                - /var/log/containers/*-$${data.kubernetes.container.id}.log
              exclude_files:
                - /var/log/containers/filebeat-.*
                - /var/log/containers/es-agent-.*
                - /var/log/containers/tunnelfront-.*
                - /var/log/containers/coredns-.*
                - /var/log/containers/kube-proxy-.*
                - /var/log/containers/istiod-.*
                - /var/log/containers/istio-ingressgateway-.*
                - /var/log/containers/istio-egressgateway-.*
                - /var/log/containers/cert-manager-.*
                - /var/log/containers/csi-azurefile-node-.*
                - /var/log/containers/csi-azuredisk-node-.*
                - /var/log/containers/instana-agent-.*
            # include_annotations: ["artifact.spinnaker.io/name","ad.datadoghq.com/tags"]
            include_labels: ["app.kubernetes.io/name", "app", "version"]
            templates:
              - condition.equals:
                  kubernetes.namespace: anqa
                config:
                  - type: container
                    paths:
                      - /var/log/containers/*-$${data.kubernetes.container.id}.log
                    exclude_files:
                      - /var/log/containers/.*istio-proxy-.*
                    containers.ids:
                      - "$${data.kubernetes.container.id}"
                    include_labels: ["app", "version"]
      cloud.id: $${ELASTIC_CLOUDID}
      output.elasticsearch:
        api_key: $${ELASTIC_APIKEY}
    EOF
  }
}