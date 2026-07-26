locals {
  aws_region            = "us-east-2"
  project_name          = "dear-next-visitor"
  ecs_cluster_name      = "prd-kro" # pre-created
  load_balancer_name    = "prd-kro" # pre-created
  container_port        = 3000
  domain                = "dearnextvisitor.com"
  alb_listener_priority = 200
}
