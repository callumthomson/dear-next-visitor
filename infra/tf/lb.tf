data "aws_lb" "app" {
  name = local.load_balancer_name
}

data "aws_lb_listener" "http" {
  load_balancer_arn = data.aws_lb.app.arn
  port              = 80
}

resource "aws_lb_target_group" "app" {
  name        = local.project_name
  port        = local.container_port
  protocol    = "HTTP"
  target_type = "ip"
  vpc_id      = data.aws_lb.app.vpc_id

  health_check {
    enabled = true
    path    = "/"
    matcher = "200-399"
  }
}

resource "aws_lb_listener_rule" "app" {
  listener_arn = data.aws_lb_listener.http.arn
  priority     = local.alb_listener_priority

  action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.app.arn
  }

  condition {
    host_header {
      values = ["www.${local.domain}"]
    }
  }
}
