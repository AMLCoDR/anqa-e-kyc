
output "data_secret" {
  value = {
    cloud_id = ec_deployment.data.elasticsearch.0.cloud_id
    api_key  = "${data.external.data_api_key.result["id"]}:${data.external.data_api_key.result["api_key"]}"
  }
}

output "log_secret" {
  value = {
    cloud_id = ec_deployment.log.elasticsearch.0.cloud_id
    api_key  = "${data.external.log_api_key.result["id"]}:${data.external.log_api_key.result["api_key"]}"
  }
}

output "kibana_log_url" {
  value = ec_deployment.log.kibana.0.https_endpoint
}