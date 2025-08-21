
terraform taint 'module.react.null_resource.custom_domain["shell"]' && \
terraform taint 'module.react.null_resource.custom_domain_aliases["shell"]' && \
terraform taint  'module.react.null_resource.custom_domain["components"]' && \
terraform taint  'module.react.null_resource.custom_domain["customer"]' && \
terraform taint  'module.react.null_resource.custom_domain["insight"]' && \
terraform taint  'module.react.null_resource.custom_domain["organisation"]' && \
terraform taint  'module.react.null_resource.custom_domain["transaction"]' && \
terraform taint  'module.react.null_resource.custom_domain["verification"]'

terraform taint  'module.react.null_resource.custom_domain_https["shell"]' && \
terraform taint 'module.react.null_resource.custom_domain_https_aliases["shell"]' && \
terraform taint  'module.react.null_resource.custom_domain_https["components"]' && \
terraform taint  'module.react.null_resource.custom_domain_https["customer"]' && \
terraform taint  'module.react.null_resource.custom_domain_https["insight"]' && \
terraform taint  'module.react.null_resource.custom_domain_https["organisation"]' && \
terraform taint  'module.react.null_resource.custom_domain_https["transaction"]' && \
terraform taint  'module.react.null_resource.custom_domain_https["verification"]'

terraform taint 'module.react.null_resource.custom_domain["adminportal"]'
terraform taint 'module.react.null_resource.custom_domain_https["adminportal"]'

terraform taint 'module.react.null_resource.custom_domain["www"]'
terraform taint 'module.react.null_resource.custom_domain_https["www"]'