variable "env" {
  type = string
}

variable "org" {
  type = string
}

variable "key" {
  type = string
}

variable "secret" {
  type = string
}

variable "app_user" {
  type = string
}

variable "app_password" {
  type = string
}

variable "data_user" {
  type = string
}

variable "data_password" {
  type = string
}

variable "ip_addresses" {
  type = map(string)
}

variable "azure_secret" {
  type = object({
    tenant_id       = string
    subscription_id = string
    client_id       = string
    client_secret   = string
  })
}

variable "key_identifier" {
  type = string
}

variable "key_vault_name" {
  type = string
}

variable "resource_group" {
  type = object({
    name     = string
    location = string
  })
}
