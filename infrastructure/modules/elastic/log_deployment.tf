
resource "ec_deployment" "log" {
  name                   = "log-${var.env}"
  version                = data.ec_stack.latest.version
  region                 = "azure-australiaeast"
  deployment_template_id = "azure-io-optimized"

  elasticsearch {
    ref_id = "main-elasticsearch"

    topology {
      instance_configuration_id = "azure.data.highio.l32sv2"
      size                      = "2g"
      size_resource             = "memory"
      zone_count                = "1"
    }
  }

  kibana {
    topology {
      instance_configuration_id = "azure.kibana.e32sv3"
      size                      = "1g"
      size_resource             = "memory"
      zone_count                = "1"
    }
  }
}

# generate API key and get result to create secret with
# See github.com/matti/terraform-shell-resource for use
module "create_log_api_key" {
  source     = "matti/resource/shell"
  version    = "1.2.0"
  depends_on = [ec_deployment.log]
  trigger    = ec_deployment.log.id

  command = <<-EOT
    curl -X POST \
        -H "Content-Type: application/json" \
        -d '{"name": "Kubernetes services"}' \
        -u "${ec_deployment.log.elasticsearch_username}:${ec_deployment.log.elasticsearch_password}" \
      ${ec_deployment.log.elasticsearch.0.https_endpoint}/_security/api_key
  EOT
  # command_when_destroy = ""
}

data "external" "log_api_key" {
  program = ["echo", module.create_log_api_key.stdout]
}