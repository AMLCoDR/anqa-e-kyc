variable "env" {
  type = string
}

variable "host_ext" {
  type = string
}

variable "app" {
  type = map(any)
}

variable "auth0_terraform_secret" {
  type = object({
    domain        = string
    client_id     = string
    client_secret = string
  })
  description = "Authenticate with auth0 tenant"
}
