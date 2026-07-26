output "ecr_repository_url" {
  description = "Repository URL to use in ECS task definitions and image push commands."
  value       = aws_ecr_repository.app.repository_url
}

output "ecs_service_name" {
  description = "Name of the ECS service."
  value       = aws_ecs_service.app.name
}

output "load_balancer_dns_name" {
  description = "DNS name of the application load balancer."
  value       = data.aws_lb.app.dns_name
}
