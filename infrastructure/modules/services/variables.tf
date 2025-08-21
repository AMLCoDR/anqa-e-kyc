
variable "subscription" {
  type = string
}

variable "circleci_token" {
  type = string
}

variable "services" {
  type = set(string)
}
