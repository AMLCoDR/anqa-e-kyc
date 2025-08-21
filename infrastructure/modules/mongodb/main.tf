terraform {
  required_providers {
    mongodbatlas = {
      source  = "mongodb/mongodbatlas"
      version = "0.9.1"
    }
  }
}

locals {
  # Replace ORG_ID, PUBLIC_KEY and PRIVATE_KEY with your Atlas variables
  mongodb_atlas_api_pub_key = var.key
  mongodb_atlas_api_pri_key = var.secret
  mongodb_atlas_org_id      = var.org
  project_name              = var.env == "stg" ? "staging" : "production"
}

# Configure the MongoDB Atlas Provider
provider "mongodbatlas" {
  public_key  = local.mongodb_atlas_api_pub_key
  private_key = local.mongodb_atlas_api_pri_key
}

# Create a Project
resource "mongodbatlas_project" "anqa" {
  name   = local.project_name
  org_id = local.mongodb_atlas_org_id

  # developers
  teams {
    team_id    = "60cea152d97bfe6c56dd5c7a"
    role_names = [var.env == "stg" ? "GROUP_DATA_ACCESS_READ_WRITE" : "GROUP_READ_ONLY"]
  }

  # owners
  teams {
    team_id    = "60cfbff3ebcf9c023c9f3a77"
    role_names = ["GROUP_OWNER"]
  }

}

# Set up encryption at rest
resource "mongodbatlas_encryption_at_rest" "anqa" {
  project_id = mongodbatlas_project.anqa.id

  azure_key_vault = {
    enabled             = true
    client_id           = var.azure_secret.client_id
    azure_environment   = "AZURE"
    subscription_id     = var.azure_secret.subscription_id
    resource_group_name = var.resource_group.name
    key_vault_name      = var.key_vault_name
    key_identifier      = var.key_identifier
    secret              = var.azure_secret.client_secret
    tenant_id           = var.azure_secret.tenant_id
  }
}

# Create app cluster
resource "mongodbatlas_cluster" "anqa_app" {
  depends_on   = [mongodbatlas_encryption_at_rest.anqa]
  project_id   = mongodbatlas_project.anqa.id
  name         = "app"
  cluster_type = "REPLICASET"
  replication_specs {
    num_shards = 1
    regions_config {
      region_name     = "AUSTRALIA_EAST"
      electable_nodes = 3
      priority        = 7
      read_only_nodes = 0
    }
  }
  provider_backup_enabled      = true
  auto_scaling_disk_gb_enabled = true
  # mongo_db_major_version       = "4.4"
  provider_name                = "AZURE"
  provider_disk_type_name      = "P2"
  provider_instance_size_name  = "M10"
  encryption_at_rest_provider  = "AZURE"
}
