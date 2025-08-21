
variable "subscription" {
  type = object({
    subscription_id = string
  })
}

variable "resource_group" {
  type = object({
    name     = string
    location = string
  })
}

variable "env" {
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

variable "hosts" {
  type = set(string)
}

variable "aliases" {
  type = map(string)
}
