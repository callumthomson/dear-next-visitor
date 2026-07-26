terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "6.50.0"
    }
    random = {
      source  = "hashicorp/random"
      version = "3.7.2"
    }
  }
}

provider "aws" {
  region              = local.aws_region
  allowed_account_ids = [var.aws_account_id]

  default_tags {
    tags = {
      Project     = local.project_name
      Environment = "prd"
      Repo        = "https://github.com/callumthomson/dear-next-visitor"
      IaC         = "tofu"
    }
  }
}

provider "aws" {
  alias               = "us_east_1"
  region              = "us-east-1"
  allowed_account_ids = [var.aws_account_id]

  default_tags {
    tags = {
      Project     = local.project_name
      Environment = "prd"
      Repo        = "https://github.com/callumthomson/dear-next-visitor"
      IaC         = "tofu"
    }
  }
}
