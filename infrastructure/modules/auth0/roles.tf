#Create Super role
resource "auth0_role" "super" {
  depends_on  = [auth0_resource_server.api]
  name        = "Super"
  description = "Anqa AML user for cross-tenancy"

  permissions {
    resource_server_identifier = "anqaaml${var.host_ext}.com"
    name                       = "read:admins"
  }
  permissions {
    resource_server_identifier = "anqaaml${var.host_ext}.com"
    name                       = "read:tenants"
  }
}

#Create Owner role
resource "auth0_role" "owner" {
  depends_on  = [auth0_resource_server.api]
  name        = "Owner"
  description = "Organisation owner"

  permissions {
    resource_server_identifier = "anqaaml${var.host_ext}.com"
    name                       = "cancel:subscription"
  }
  permissions {
    resource_server_identifier = "anqaaml${var.host_ext}.com"
    name                       = "create:customers"
  }
  permissions {
    resource_server_identifier = "anqaaml${var.host_ext}.com"
    name                       = "create:subscription"
  }
  permissions {
    resource_server_identifier = "anqaaml${var.host_ext}.com"
    name                       = "create:transactions"
  }
  permissions {
    resource_server_identifier = "anqaaml${var.host_ext}.com"
    name                       = "create:users"
  }
  permissions {
    resource_server_identifier = "anqaaml${var.host_ext}.com"
    name                       = "delete:customers"
  }
  permissions {
    resource_server_identifier = "anqaaml${var.host_ext}.com"
    name                       = "delete:transactions"
  }
  permissions {
    resource_server_identifier = "anqaaml${var.host_ext}.com"
    name                       = "delete:users"
  }
  permissions {
    resource_server_identifier = "anqaaml${var.host_ext}.com"
    name                       = "edit:customers"
  }
  permissions {
    resource_server_identifier = "anqaaml${var.host_ext}.com"
    name                       = "edit:settings"
  }

  permissions {
    resource_server_identifier = "anqaaml${var.host_ext}.com"
    name                       = "edit:subscription"
  }

  permissions {
    resource_server_identifier = "anqaaml${var.host_ext}.com"
    name                       = "edit:transactions"
  }

  permissions {
    resource_server_identifier = "anqaaml${var.host_ext}.com"
    name                       = "edit:users"
  }

  permissions {
    resource_server_identifier = "anqaaml${var.host_ext}.com"
    name                       = "read:admins"
  }

  permissions {
    resource_server_identifier = "anqaaml${var.host_ext}.com"
    name                       = "read:customers"
  }

  permissions {
    resource_server_identifier = "anqaaml${var.host_ext}.com"
    name                       = "read:notifications"
  }

  permissions {
    resource_server_identifier = "anqaaml${var.host_ext}.com"
    name                       = "read:settings"
  }

  permissions {
    resource_server_identifier = "anqaaml${var.host_ext}.com"
    name                       = "read:transactions"
  }

  permissions {
    resource_server_identifier = "anqaaml${var.host_ext}.com"
    name                       = "read:users"
  }
}

#Create Super role
resource "auth0_role" "user" {
  depends_on  = [auth0_resource_server.api]
  name        = "User"
  description = "Standard user"

  permissions {
    resource_server_identifier = "anqaaml${var.host_ext}.com"
    name                       = "read:customers"
  }
  permissions {
    resource_server_identifier = "anqaaml${var.host_ext}.com"
    name                       = "read:transactions"
  }
}
