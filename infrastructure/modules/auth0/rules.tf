resource "auth0_rule" "metadata" {
  depends_on = [auth0_rule_config.namespace]
  name       = "Add metadata to token"
  script     = <<-EOF
        function (user, context, callback) {

            context.accessToken[`$${configuration.namespace}/tenantId`] = user.tenantId;
            context.idToken[`$${configuration.namespace}/tenantId`] = user.tenantId;

            callback(null, user, context);
        }
EOF
  enabled    = true
}

resource "auth0_rule_config" "namespace" {
  key   = "namespace"
  value = "https://anqaml.com"

}
