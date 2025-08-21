
# Create a Database User for App cluster
resource "mongodbatlas_database_user" "anqa" {
  username           = var.app_user
  password           = var.app_password
  project_id         = mongodbatlas_project.anqa.id
  auth_database_name = "admin"

  roles {
    role_name     = "readWrite"
    database_name = "anqa"
  }
}

# Create a Database User for Data cluster
resource "mongodbatlas_database_user" "anqa_data" {
  username           = var.data_user
  password           = var.data_password
  project_id         = mongodbatlas_project.anqa.id
  auth_database_name = "admin"

  roles {
    role_name     = "readWrite"
    database_name = "admin-portal"
  }

  roles {
    role_name     = "dbAdmin"
    database_name = "Database1"
  }

  roles {
    role_name     = "readWrite"
    database_name = "Database1"
  }

  roles {
    role_name     = "dbAdmin"
    database_name = "admin-portal"
  }
}