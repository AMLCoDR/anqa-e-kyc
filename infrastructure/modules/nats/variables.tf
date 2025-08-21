
# required for protocol fix
variable "kube_config" {
  type = list(object({
    host                   = string
    client_key             = string
    client_certificate     = string
    cluster_ca_certificate = string
    password               = string
  }))
  sensitive = true
}