data "aws_ecs_cluster" "app" {
  cluster_name = local.ecs_cluster_name
}

data "aws_ecr_image" "app" {
  repository_name = aws_ecr_repository.app.name
  most_recent     = true
}

resource "aws_iam_role" "ecs_task_execution" {
  name = "${local.project_name}-ecs-task-execution"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Principal = {
          Service = "ecs-tasks.amazonaws.com"
        }
        Action = "sts:AssumeRole"
      },
    ]
  })
}

resource "aws_iam_role_policy_attachment" "ecs_task_execution" {
  role       = aws_iam_role.ecs_task_execution.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AmazonECSTaskExecutionRolePolicy"
}

resource "aws_iam_role_policy" "ecs_task_execution_ssm" {
  name = "${local.project_name}-ecs-task-execution-ssm"
  role = aws_iam_role.ecs_task_execution.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Action = [
          "ssm:GetParameters",
        ]
        Resource = [
          data.aws_ssm_parameter.openai_api_key.arn,
          data.aws_ssm_parameter.libsql_url.arn,
          data.aws_ssm_parameter.libsql_token.arn,
        ]
      },
    ]
  })
}

resource "aws_cloudwatch_log_group" "app" {
  name              = "/ecs/${local.project_name}"
  retention_in_days = 14
}

resource "aws_ecs_task_definition" "app" {
  family                   = local.project_name
  requires_compatibilities = ["FARGATE"]
  network_mode             = "awsvpc"
  cpu                      = 256
  memory                   = 512
  execution_role_arn       = aws_iam_role.ecs_task_execution.arn

  runtime_platform {
    cpu_architecture        = "ARM64"
    operating_system_family = "LINUX"
  }

  container_definitions = jsonencode([
    {
      name      = local.project_name
      image     = "${aws_ecr_repository.app.repository_url}@${data.aws_ecr_image.app.image_digest}"
      essential = true
      environment = [
        {
          name  = "NODE_ENV"
          value = "production"
        },
      ]
      secrets = [
        {
          name      = "OPENAI_API_KEY"
          valueFrom = data.aws_ssm_parameter.openai_api_key.arn
        },
        {
          name      = "LIBSQL_DB_URL"
          valueFrom = data.aws_ssm_parameter.libsql_url.arn
        },
        {
          name      = "LIBSQL_DB_TOKEN"
          valueFrom = data.aws_ssm_parameter.libsql_token.arn
        },
      ]
      portMappings = [
        {
          containerPort = local.container_port
          hostPort      = local.container_port
          protocol      = "tcp"
        },
      ]
      logConfiguration = {
        logDriver = "awslogs"
        options = {
          awslogs-group         = aws_cloudwatch_log_group.app.name
          awslogs-region        = local.aws_region
          awslogs-stream-prefix = local.project_name
        }
      }
    },
  ])
}

resource "aws_security_group" "ecs_service" {
  name        = "${local.project_name}-ecs-service"
  description = "Allow load balancer traffic to the ${local.project_name} ECS service"
  vpc_id      = data.aws_lb.app.vpc_id
}

resource "aws_vpc_security_group_ingress_rule" "ecs_service_http" {
  for_each = toset(data.aws_lb.app.security_groups)

  security_group_id            = aws_security_group.ecs_service.id
  referenced_security_group_id = each.value
  from_port                    = local.container_port
  ip_protocol                  = "tcp"
  to_port                      = local.container_port
}

resource "aws_vpc_security_group_egress_rule" "ecs_service_all" {
  security_group_id = aws_security_group.ecs_service.id
  cidr_ipv4         = "0.0.0.0/0"
  ip_protocol       = "-1"
}

resource "aws_ecs_service" "app" {
  name            = local.project_name
  cluster         = data.aws_ecs_cluster.app.arn
  task_definition = aws_ecs_task_definition.app.arn
  desired_count   = 1
  launch_type     = "FARGATE"

  network_configuration {
    subnets          = data.aws_lb.app.subnets
    security_groups  = [aws_security_group.ecs_service.id]
    assign_public_ip = false
  }

  load_balancer {
    target_group_arn = aws_lb_target_group.app.arn
    container_name   = local.project_name
    container_port   = local.container_port
  }

  depends_on = [
    aws_iam_role_policy_attachment.ecs_task_execution,
    aws_iam_role_policy.ecs_task_execution_ssm,
    aws_lb_listener_rule.app,
  ]
}
