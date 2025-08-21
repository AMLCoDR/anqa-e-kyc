resource "azurerm_storage_account" "website" {
  name                     = "stwebsite${var.env}"
  resource_group_name      = var.resource_group.name
  location                 = var.resource_group.location
  account_tier             = "Standard"
  account_replication_type = "GRS"

  static_website {
    index_document     = "index.html"
    error_404_document = "index.html"
  }
}

resource "azurerm_cdn_profile" "website" {
  name                = "cdnp-website-${var.env}"
  location            = var.resource_group.location
  resource_group_name = var.resource_group.name
  sku                 = "Standard_Microsoft"
}

resource "azurerm_cdn_endpoint" "website" {
  name                = "cdne-website${var.env}anqa"
  profile_name        = azurerm_cdn_profile.website.name
  location            = var.resource_group.location
  resource_group_name = var.resource_group.name

  # set origin to be webapp storage 
  origin_host_header = azurerm_storage_account.website.primary_web_host
  origin {
    name      = "website"
    host_name = azurerm_storage_account.website.primary_web_host
  }

  optimization_type             = "GeneralWebDelivery"
  querystring_caching_behaviour = "BypassCaching"

  # HTTP -> HTTPS redirect rule
  delivery_rule {
    name  = "EnforceHttps"
    order = 1

    request_scheme_condition {
      match_values     = ["HTTP"]
      negate_condition = false
      operator         = "Equal"
    }

    url_redirect_action {
      protocol      = "Https"
      redirect_type = "PermanentRedirect"
    }
  }
}

resource "aws_route53_record" "cname_website" {
  name    = "www${local.host_ext}.anqaml.com"
  records = ["${azurerm_cdn_endpoint.website.name}.azureedge.net"]
  zone_id = data.aws_route53_zone.r53.zone_id
  type    = "CNAME"
  ttl     = "300"
}

# create custom domain
resource "null_resource" "custom_domain_website" {
  depends_on = [azurerm_cdn_endpoint.website]

  provisioner "local-exec" {
    command = <<-EOT
      curl -X PUT \
        -H "Authorization: Bearer ${data.external.az_token.result["access_token"]}" \
        -H "Content-Type: application/json" \
        -d '{ "properties": { "hostName": "${aws_route53_record.cname_website.name}" } }' \
        ${local.profile_root}/${azurerm_cdn_profile.website.name}/endpoints/${azurerm_cdn_endpoint.website.name}/customDomains/www${var.env}/?api-version=2019-12-31
    EOT
  }

  triggers = {
    host_name = aws_route53_record.cname_website.name
  }
}

# enable https for the custom domain
resource "null_resource" "custom_domain_https_website" {
  depends_on = [null_resource.custom_domain_website]

  provisioner "local-exec" {
    command = <<-EOT
      sleep 30s
      curl -X POST \
        -H "Authorization: Bearer ${data.external.az_token.result["access_token"]}" \
        -H "Content-Type: application/json" \
        -d '{ "certificateSource":"Cdn", "certificateSourceParameters": { "@odata.type":"Microsoft.Azure.Cdn.Models.CdnCertificateSourceParameters", "certificateType":"Dedicated" }, "protocolType":"ServerNameIndication" }' \
        ${local.profile_root}/${azurerm_cdn_profile.website.name}/endpoints/${azurerm_cdn_endpoint.website.name}/customDomains/www${var.env}/enableCustomHttps?api-version=2019-12-31
    EOT
  }

  triggers = {
    host_name = aws_route53_record.cname_website.name
  }
}