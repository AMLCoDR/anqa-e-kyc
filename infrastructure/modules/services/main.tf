# ---------------------------------------------
# Trigger deployment of Anqa-owned artefacts
# ---------------------------------------------

resource "null_resource" "deploy" {
  for_each = var.services

  provisioner "local-exec" {
    command = <<-EOT
      curl --request POST \
        --url https://circleci.com/api/v2/project/gh/anqaaml/${each.value}/pipeline \
        --header 'Circle-Token: ${var.circleci_token}' \
        --header 'content-type: application/json' \
        --data '{"branch":"main"}'
      EOT
  }
}

#  --data '{"branch":"main", "parameters":{"clean-install":true}}'
