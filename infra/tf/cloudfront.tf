data "aws_cloudfront_cache_policy" "caching_disabled" {
  name = "Managed-CachingDisabled"
}

data "aws_cloudfront_origin_request_policy" "all_viewer" {
  name = "Managed-AllViewer"
}

variable "cloudfront_vpc_origin_id" {
  description = "ID of the existing CloudFront VPC origin associated with the internal ALB."
  type        = string
}
variable "aws_account_id" {
  description = "ID of AWS account to deploy into"
  type        = string
}

resource "aws_cloudfront_function" "redirect_apex_to_www" {
  name    = "${local.project_name}-redirect-apex-to-www"
  runtime = "cloudfront-js-2.0"
  comment = "Redirect ${local.domain} to www.${local.domain}"
  publish = true
  code    = <<-EOF
function handler(event) {
  var request = event.request;
  var host = request.headers.host && request.headers.host.value;

  if (host === "${local.domain}") {
    var location = "https://www.${local.domain}" + request.uri;
    if (request.querystring && request.querystring.length > 0) {
      location += "?" + request.querystring;
    }

    return {
      statusCode: 301,
      statusDescription: "Moved Permanently",
      headers: {
        location: { value: location }
      }
    };
  }

  return request;
}
EOF
}

resource "aws_cloudfront_distribution" "app" {
  enabled             = true
  comment             = "${local.project_name} default distribution"
  price_class         = "PriceClass_100"
  wait_for_deployment = false
  aliases             = [local.domain, "www.${local.domain}"]

  origin {
    domain_name = data.aws_lb.app.dns_name
    origin_id   = "alb-${local.project_name}"

    vpc_origin_config {
      vpc_origin_id = var.cloudfront_vpc_origin_id
    }
  }

  default_cache_behavior {
    target_origin_id         = "alb-${local.project_name}"
    viewer_protocol_policy   = "redirect-to-https"
    allowed_methods          = ["DELETE", "GET", "HEAD", "OPTIONS", "PATCH", "POST", "PUT"]
    cached_methods           = ["GET", "HEAD"]
    compress                 = true
    cache_policy_id          = data.aws_cloudfront_cache_policy.caching_disabled.id
    origin_request_policy_id = data.aws_cloudfront_origin_request_policy.all_viewer.id

    function_association {
      event_type   = "viewer-request"
      function_arn = aws_cloudfront_function.redirect_apex_to_www.arn
    }
  }

  restrictions {
    geo_restriction {
      restriction_type = "none"
    }
  }

  viewer_certificate {
    # cloudfront_default_certificate = true
    acm_certificate_arn      = aws_acm_certificate_validation.this.certificate_arn
    minimum_protocol_version = "TLSv1.2_2021"
    ssl_support_method       = "sni-only"
  }
}
