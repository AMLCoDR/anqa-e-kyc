
variable "elastic_log_secret" {
  type = object({
    cloud_id = string
    api_key  = string
  })
}