locals {
  private_endpoint = concat(mongodbatlas_cluster.anqa_app.connection_strings[0].private_endpoint, tolist([{ srv_connection_string : "" }]))
}

# return private endpoint cnn string
output "mongo_host" {
  depends_on = [
    mongodbatlas_privatelink_endpoint_service.anqa
  ]
  value = local.private_endpoint[0].srv_connection_string
}