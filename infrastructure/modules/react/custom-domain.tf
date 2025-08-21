# ------------------------------------------------------------
# Configure CDN custom domain mapping
#  - uses the Azure API as Terraform does not have a resource 
#    for cdn custom domains (yet)
# ------------------------------------------------------------

locals {
  profile_root = "https://management.azure.com/subscriptions/${var.subscription.subscription_id}/resourceGroups/${var.resource_group.name}/providers/Microsoft.Cdn/profiles"
}

# get Azure API access token
data "external" "az_token" {
  program = [
    "sh",
    "${path.module}/get_token.sh",
    var.azure_secret.tenant_id,
    var.azure_secret.client_id,
    var.azure_secret.client_secret
  ]
}

data "aws_route53_zone" "r53" {
  name = "anqaml.com"
}

resource "aws_route53_record" "cname" {
  for_each = var.hosts
  name     = "${each.key}${local.host_ext}.anqaml.com"
  records  = ["${azurerm_cdn_endpoint.react[each.key].name}.azureedge.net"]
  zone_id  = data.aws_route53_zone.r53.zone_id
  type     = "CNAME"
  ttl      = "300"
}

# create custom domain
resource "null_resource" "custom_domain" {
  for_each   = var.hosts
  depends_on = [azurerm_cdn_endpoint.react]

  provisioner "local-exec" {
    command = <<-EOT
      curl -X PUT \
        -H "Authorization: Bearer ${data.external.az_token.result["access_token"]}" \
        -H "Content-Type: application/json" \
        -d '{ "properties": { "hostName": "${aws_route53_record.cname[each.key].name}" } }' \
        ${local.profile_root}/${azurerm_cdn_profile.react.name}/endpoints/${azurerm_cdn_endpoint.react[each.key].name}/customDomains/${each.key}${var.env}/?api-version=2019-12-31
    EOT
  }

  triggers = {
    host_name = aws_route53_record.cname[each.key].name
  }
}

# enable https for the custom domain
resource "null_resource" "custom_domain_https" {
  for_each   = var.hosts
  depends_on = [null_resource.custom_domain]

  provisioner "local-exec" {
    command = <<-EOT
      sleep 30s
      curl -X POST \
        -H "Authorization: Bearer ${data.external.az_token.result["access_token"]}" \
        -H "Content-Type: application/json" \
        -d '{ "certificateSource":"Cdn", "certificateSourceParameters": { "@odata.type":"Microsoft.Azure.Cdn.Models.CdnCertificateSourceParameters", "certificateType":"Dedicated" }, "protocolType":"ServerNameIndication" }' \
        ${local.profile_root}/${azurerm_cdn_profile.react.name}/endpoints/${azurerm_cdn_endpoint.react[each.key].name}/customDomains/${each.key}${var.env}/enableCustomHttps?api-version=2019-12-31
    EOT
  }

  triggers = {
    host_name = aws_route53_record.cname[each.key].name
  }
}

# --------------------------------
# Hack for aliases
# --------------------------------

resource "aws_route53_record" "cname_aliases" {
  for_each = var.aliases
  name     = "${each.value}${local.host_ext}.anqaml.com"
  records  = ["${azurerm_cdn_endpoint.react[each.key].name}.azureedge.net"]
  zone_id  = data.aws_route53_zone.r53.zone_id
  type     = "CNAME"
  ttl      = "300"
}

# create custom domain
resource "null_resource" "custom_domain_aliases" {
  for_each   = var.aliases
  depends_on = [azurerm_cdn_endpoint.react]

  provisioner "local-exec" {
    command = <<-EOT
      curl -X PUT \
        -H "Authorization: Bearer ${data.external.az_token.result["access_token"]}" \
        -H "Content-Type: application/json" \
        -d '{ "properties": { "hostName": "${aws_route53_record.cname_aliases[each.key].name}" } }' \
        ${local.profile_root}/${azurerm_cdn_profile.react.name}/endpoints/${azurerm_cdn_endpoint.react[each.key].name}/customDomains/${each.value}${var.env}/?api-version=2019-12-31
    EOT
  }

  triggers = {
    host_name = aws_route53_record.cname_aliases[each.key].name
  }
}

# enable https for the custom domain
resource "null_resource" "custom_domain_https_aliases" {
  for_each   = var.aliases
  depends_on = [null_resource.custom_domain_aliases]

  provisioner "local-exec" {
    command = <<-EOT
      sleep 30s
      curl -X POST \
        -H "Authorization: Bearer ${data.external.az_token.result["access_token"]}" \
        -H "Content-Type: application/json" \
        -d '{ "certificateSource":"Cdn", "certificateSourceParameters": { "@odata.type":"Microsoft.Azure.Cdn.Models.CdnCertificateSourceParameters", "certificateType":"Dedicated" }, "protocolType":"ServerNameIndication" }' \
        ${local.profile_root}/${azurerm_cdn_profile.react.name}/endpoints/${azurerm_cdn_endpoint.react[each.key].name}/customDomains/${each.value}${var.env}/enableCustomHttps?api-version=2019-12-31
    EOT
  }

  triggers = {
    host_name = aws_route53_record.cname_aliases[each.key].name
  }
}