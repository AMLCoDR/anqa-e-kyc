# README #

## Prerequisites
Install VS Code extensions for Terraform and MongoDB.

## Workspace configuration
Workspace settings can be configured using Terraform scripts. To update a workspace (variables only at this stage)
open `init/workspace` and add variables using `add-vars.tf`

N.B. Set the `"tfe" provider` token (from LastPass) and the correct `tfe_workspace` name.

## Making changes
Update Terraform config and commit to GitHub

## Applying changes
1. Log in to Terraform Cloud
2. Select workspace
3. Queue plan
4. Approve

## 'Forcing' resource redeploy
Terraform supports marking a resource's state as 'tainted' thus forcing a redeploy of the resource. This is especially useful in cases where Terraform doesn't detect a change to the string contents of a resource.

    Terraform taint '<module>.<resource_name>'

## Importing pre-existing infrastructure

https://www.terraform.io/docs/cloud/workspaces/state.html

See [/import/README.md]

### Azure resource naming
The naming conventions use loosely follow Microsoft guidelines:

https://docs.microsoft.com/en-us/azure/cloud-adoption-framework/ready/azure-best-practices/naming-and-tagging
