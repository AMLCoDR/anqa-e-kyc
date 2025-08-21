
variable "env" {
  type = string
}

variable "resource_group" {
  type = object({
    name     = string
    location = string
  })
}

variable "app_namespace" {
  type = string
}

variable "azure_secret" {
  type = object({
    tenant_id       = string
    subscription_id = string
    client_id       = string
    client_secret   = string
  })
}

variable "egress_ip" {
  type = object({
    id = string
  })
}