resource "auth0_resource_server" "api" {
  name             = "Anqa API"
  identifier       = "anqaaml${var.host_ext}.com"
  signing_alg      = "RS256"
  enforce_policies = true

  scopes {
    value       = "read:transactions"
    description = "View transactions"
  }

  scopes {
    value       = "read:customers"
    description = "View customers"
  }

  scopes {
    value       = "create:customers"
    description = "Add customers"
  }

  scopes {
    value       = "delete:customers"
    description = "Delete customers"
  }

  scopes {
    value       = "create:transactions"
    description = "Add transactions"
  }

  scopes {
    value       = "delete:transactions"
    description = "Delete transactions"
  }

  scopes {
    value       = "edit:customers"
    description = "Edit customers"
  }

  scopes {
    value       = "edit:transactions"
    description = "Edit transactions"
  }

  scopes {
    value       = "cancel:subscription"
    description = "Cancel an organisation's subscription"
  }

  scopes {
    value       = "create:subscription"
    description = "Create a subscription for an organisation"
  }

  scopes {
    value       = "edit:subscription"
    description = "Edit an organisation's subscription"
  }

  scopes {
    value       = "read:users"
    description = "Read users (for tenancy)"
  }

  scopes {
    value       = "create:users"
    description = "Create users (for tenancy)"
  }

  scopes {
    value       = "edit:users"
    description = "Edit users (for tenancy)"
  }

  scopes {
    value       = "delete:users"
    description = "Delete users (for tenancy)"
  }

  scopes {
    value       = "edit:settings"
    description = "Edit organisation settings"
  }

  scopes {
    value       = "read:settings"
    description = "Read organisation settings"
  }

  scopes {
    value       = "read:notifications"
    description = "Read notifications"
  }

  scopes {
    value       = "read:tenants"
    description = "View a list of tenants (organisations)"
  }

  scopes {
    value       = "read:admins"
    description = "Read admin service"
  }

  token_dialect                                   = "access_token_authz"
  allow_offline_access                            = false
  token_lifetime                                  = 86400
  skip_consent_for_verifiable_first_party_clients = true
}
