# ---------------------------------------------------------------------------------
# Apply a patch to NATS to explicitly tell Istio to use tcp protocol on port 4222 
# ---------------------------------------------------------------------------------

#  apply NATS protocol patch (download kubectl and execute)
resource "null_resource" "protocol_patch" {
  depends_on = [helm_release.nats]

  provisioner "local-exec" {
    command = <<-EOT
cat >/tmp/ca.crt <<EOF 
${base64decode(var.kube_config.0.cluster_ca_certificate)} 
EOF
cat >/tmp/cc.crt <<EOF 
${base64decode(var.kube_config.0.client_certificate)} 
EOF
cat >/tmp/ck.key <<EOF 
${base64decode(var.kube_config.0.client_key)} 
EOF
  curl -LO https://storage.googleapis.com/kubernetes-release/release/$(curl -s https://storage.googleapis.com/kubernetes-release/release/stable.txt)/bin/linux/amd64/kubectl \
  && chmod +x ./kubectl
  
  ./kubectl \
    --server="${var.kube_config.0.host}" \
    --token="${var.kube_config.0.password}" \
    --certificate-authority=/tmp/ca.crt \
    --client-certificate=/tmp/cc.crt \
    --client-key=/tmp/ck.key \
    patch Service nats -n nats \
    -p '{"spec":{"ports":[{"name":"client","port":4222,"appProtocol":"tcp"}]}}'
EOT
  }
}