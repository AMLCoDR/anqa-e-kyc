resource "kubernetes_daemonset" "filebeat" {
  metadata {
    name      = "filebeat"
    namespace = "kube-system"
    labels = {
      k8s-app = "filebeat"
    }
  }
  spec {
    selector {
      match_labels = {
        k8s-app = "filebeat"
      }
    }
    template {
      metadata {
        labels = {
          k8s-app = "filebeat"
        }
      }
      spec {
        service_account_name             = "filebeat"
        automount_service_account_token  = true
        termination_grace_period_seconds = 30
        host_network                     = true
        dns_policy                       = "ClusterFirstWithHostNet"
        container {
          name  = "filebeat"
          image = "docker.elastic.co/beats/filebeat:7.10.1"
          args  = ["-c", "/etc/filebeat.yml", "-e"]
          env_from {
            secret_ref {
              name = "elastic-log-secret"
            }
          }
          env {
            name = "NODE_NAME"
            value_from {
              field_ref {
                field_path = "spec.nodeName"
              }
            }
          }
          security_context {
            run_as_user = 0
          }
          resources {
            limits = {
              memory = "200Mi"
            }
            requests = {
              cpu    = "100m"
              memory = "100Mi"
            }
          }
          volume_mount {
            name       = "config"
            mount_path = "/etc/filebeat.yml"
            read_only  = true
            sub_path   = "filebeat.yml"
          }
          volume_mount {
            name       = "data"
            mount_path = "/usr/share/filebeat/data"
          }
          volume_mount {
            name       = "varlibdockercontainers"
            mount_path = "/var/lib/docker/containers"
            read_only  = true
          }
          volume_mount {
            name       = "varlog"
            mount_path = "/var/log"
            read_only  = true
          }
        }
        volume {
          name = "config"
          config_map {
            default_mode = "0640"
            name         = "filebeat-config"
          }
        }
        volume {
          name = "varlibdockercontainers"
          host_path {
            path = "/var/lib/docker/containers"
          }
        }
        volume {
          name = "varlog"
          host_path {
            path = "/var/log"
          }
        }
        volume {
          name = "data"
          host_path {
            path = "/var/lib/filebeat-data"
            type = "DirectoryOrCreate"
          }
        }
      }
    }
  }
}
