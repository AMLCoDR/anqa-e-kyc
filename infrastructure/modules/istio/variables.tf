
variable "istio_version" {
  type        = string
  description = "Istio version to install"
}

variable "ingress_ip" {
  type        = string
  description = "AKS cluster ingress ap address"
}