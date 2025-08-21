
# https://www.elastic.co/guide/en/cloud/current/ec-regions-templates-instances.html

resource "ec_deployment" "data" {
  name                   = "data-${var.env}"
  version                = data.ec_stack.latest.version
  region                 = "azure-australiaeast"
  deployment_template_id = "azure-memory-optimized"

  elasticsearch {
    topology {
      instance_configuration_id = "azure.data.highmem.e32sv3"
      size                      = "1g"
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
module "create_data_api_key" {
  source     = "matti/resource/shell"
  version    = "1.2.0"
  depends_on = [ec_deployment.data]
  trigger    = ec_deployment.data.id

  command = <<-EOT
    curl -X POST \
        -H "Content-Type: application/json" \
        -d '{"name": "Kubernetes services"}' \
        -u "${ec_deployment.data.elasticsearch_username}:${ec_deployment.data.elasticsearch_password}" \
      ${ec_deployment.data.elasticsearch.0.https_endpoint}/_security/api_key
  EOT
  # command_when_destroy = ""
}

data "external" "data_api_key" {
  program = ["echo", module.create_data_api_key.stdout]
}

# create transactions index
resource "null_resource" "create_transactions_index" {
  provisioner "local-exec" {
    command = <<-EOT
      curl -X PUT \
        -u "${ec_deployment.data.elasticsearch_username}:${ec_deployment.data.elasticsearch_password}" \
        ${ec_deployment.data.elasticsearch.0.https_endpoint}/transactions
    EOT
  }
}
