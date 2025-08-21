variable "host_name" {
  type = string
}

variable "zerossl_secret" {
  type = object({
    key_id   = string
    hmac_key = string
  })
}