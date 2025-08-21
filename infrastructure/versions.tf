terraform {
  required_providers {
    azurerm = {
      source  = "hashicorp/azurerm"
      version = "~> 2.70.0"
    }
    aws = {
      source  = "hashicorp/aws"
      version = "~> 3.19.0"
    }
    kubernetes = {
      source  = "hashicorp/kubernetes"
      version = ">= 2.3.2"
    }
    kubernetes-alpha = {
      source  = "hashicorp/kubernetes-alpha"
      version = ">= 0.5"
    }
    helm = {
      source  = "hashicorp/helm"
      version = ">= 2.2.0"
    }
    kubectl = {
      source  = "gavinbunney/kubectl"
      version = ">= 1.11.2"
    }
  }
  required_version = ">= 1.0"
}
