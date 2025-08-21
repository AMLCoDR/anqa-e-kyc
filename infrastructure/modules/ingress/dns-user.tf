
# -----------------------------------
#  Create user for ClusterIssuer DNS Solver
# -----------------------------------

resource "aws_iam_user" "certmgr" {
  name = "cert-manager"
  path = "/"

  tags = {
    # tag-key = "tag-value"
  }
}

resource "aws_iam_user_policy" "certmgr" {
  name = "cert-manager"
  user = aws_iam_user.certmgr.name

  policy = <<-EOF
    {
      "Version": "2012-10-17",
      "Statement": [
        {
          "Effect": "Allow",
          "Action": "route53:GetChange",
          "Resource": "arn:aws:route53:::change/*"
        },
        {
          "Effect": "Allow",
          "Action": [
            "route53:ChangeResourceRecordSets",
            "route53:ListResourceRecordSets"
          ],
          "Resource": "arn:aws:route53:::hostedzone/*"
        },
        {
          "Effect": "Allow",
          "Action": "route53:ListHostedZonesByName",
          "Resource": "*"
        }
      ]
    }
  EOF
}

resource "aws_iam_access_key" "certmgr" {
  user = aws_iam_user.certmgr.name
}

# DNS solver secret
resource "kubernetes_secret" "route53" {
  metadata {
    name      = local.dns_secret_name
    namespace = "cert-manager"
  }
  data = {
    secret-access-key = aws_iam_access_key.certmgr.secret
  }
}