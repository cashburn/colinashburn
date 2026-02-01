variable "github_token" {
  type      = string
  description = "GitHub PAT. Provide this as a TF_VAR using GitHub Actions Secrets."
  sensitive = true
}

variable "github_owner" {
  type        = string
  description = "GitHub organization or user"
}

variable "repository_name" {
  type        = string
  description = "Repository to manage"
}
