resource "github_repository" "repo" {
  name       = var.repository_name
  visibility = "public"

  # Pull Request merge options
  allow_merge_commit = false
  allow_rebase_merge = false
  allow_squash_merge = true

  squash_merge_commit_title   = "PR_TITLE"
  squash_merge_commit_message = "PR_BODY"

  delete_branch_on_merge = true

  has_issues   = true
  has_projects = false
  has_wiki     = false
}

resource "github_repository_ruleset" "default" {
  name        = "default-ruleset"
  repository  = github_repository.repo.name
  target      = "branch"
  enforcement = "active"

  conditions {
    ref_name {
      include = [
        "~DEFAULT_BRANCH"
      ]
      exclude = []
    }
  }

  rules {
    required_linear_history = true
    deletion                = true
    non_fast_forward        = true

    pull_request {
      required_approving_review_count = 1
      dismiss_stale_reviews_on_push   = true
      require_code_owner_review       = true
    }

    required_status_checks {
      required_check {
        context = "Test"
      }
      required_check {
        context = "Build"
      }
      required_check {
        context = "Terraform Validate"
      }
    }
  }
  bypass_actors {
    actor_id    = 5 # Anyone with Repository Admin role
    actor_type  = "RepositoryRole"
    bypass_mode = "always"
  }
}

resource "github_repository_ruleset" "releases" {
  name        = "releases-ruleset"
  repository  = github_repository.repo.name
  target      = "branch"
  enforcement = "active"

  conditions {
    ref_name {
      include = [
        "refs/heads/releases/*"
      ]
      exclude = []
    }
  }

  rules {
    required_linear_history = true
    creation                = true
    update                  = true
    deletion                = true
    non_fast_forward        = true

    pull_request {
      required_approving_review_count = 1
      dismiss_stale_reviews_on_push   = true
      require_code_owner_review       = true
    }

    required_status_checks {
      required_check {
        context = "Test"
      }
      required_check {
        context = "Build"
      }
      required_check {
        context = "Terraform Validate"
      }
    }
  }
  bypass_actors {
    actor_id    = 5 # Anyone with Repository Admin role
    actor_type  = "RepositoryRole"
    bypass_mode = "always"
  }
}
