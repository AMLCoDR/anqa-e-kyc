# ------------------------------------------------------------
# Configure react app CDN and endpoint
# ------------------------------------------------------------

resource "azurerm_cdn_profile" "go_app" {
  name                = "cdnp-go-app-${var.env}"
  location            = var.resource_group.location
  resource_group_name = var.resource_group.name
  sku                 = "Standard_Microsoft"
}

resource "azurerm_cdn_endpoint" "go_app" {
  for_each            = var.hosts
  name                = "cdne-go-${each.key}${var.env}anqa"
  profile_name        = azurerm_cdn_profile.go_app.name
  location            = var.resource_group.location
  resource_group_name = var.resource_group.name

  # set origin to be web app storage 
  origin_host_header = azurerm_storage_account.go_app.primary_web_host
  origin_path        = "/${each.key}"
  origin {
    name      = each.key
    host_name = azurerm_storage_account.go_app.primary_web_host
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

  # No cache rule
  delivery_rule {
    name  = "NoCache"
    order = 2

    url_path_condition {
      operator     = "Equal"
      match_values = tolist(["/", "remoteEntry.js"])
    }

    cache_expiration_action {
      behavior = "BypassCache"
    }

    modify_response_header_action {
      action = "Overwrite"
      name   = "Cache-Control"
      value  = "no-cache, no-store, must-revalidate"
    }

    modify_response_header_action {
      action = "Overwrite"
      name   = "Pragma"
      value  = "no-cache"
    }

    modify_response_header_action {
      action = "Overwrite"
      name   = "Expires"
      value  = 0
    }
  }

  #Rewrite
  #   dynamic "delivery_rule" {
  #     for_each = each.key == "shell" ? [1] : []
  #     content {
  #       name  = "Rewrite"
  #       order = 3

  #       url_path_condition {
  #         operator     = "BeginsWith"
  #         match_values = tolist(["insights", "/customers", "/transactions"])
  #       }

  #       url_rewrite_action {
  #         source_pattern = "/"
  #         destination    = "/"
  #       }
  #     }
  #   }
}
