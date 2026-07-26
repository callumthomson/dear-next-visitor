resource "aws_route53_zone" "rulestack" {
  name = local.domain
}

resource "aws_acm_certificate" "rulestack" {
  provider                  = aws.us_east_1
  domain_name               = local.domain
  subject_alternative_names = ["www.${local.domain}"]
  validation_method         = "DNS"
}

resource "aws_route53_record" "rulestack_cert_validation" {
  for_each = {
    for option in aws_acm_certificate.rulestack.domain_validation_options :
    option.domain_name => {
      name   = option.resource_record_name
      record = option.resource_record_value
      type   = option.resource_record_type
    }
  }

  zone_id         = aws_route53_zone.rulestack.zone_id
  name            = each.value.name
  type            = each.value.type
  records         = [each.value.record]
  ttl             = 60
  allow_overwrite = true
}

resource "aws_acm_certificate_validation" "this" {
  provider                = aws.us_east_1
  certificate_arn         = aws_acm_certificate.rulestack.arn
  validation_record_fqdns = [for record in aws_route53_record.rulestack_cert_validation : record.fqdn]
}

/**
 * Web Records
 */
resource "aws_route53_record" "root" {
  zone_id = aws_route53_zone.rulestack.zone_id
  name    = local.domain
  type    = "A"

  alias {
    name                   = aws_cloudfront_distribution.app.domain_name
    zone_id                = aws_cloudfront_distribution.app.hosted_zone_id
    evaluate_target_health = false
  }
}

resource "aws_route53_record" "www" {
  zone_id = aws_route53_zone.rulestack.zone_id
  name    = "www.${local.domain}"
  type    = "A"

  alias {
    name                   = aws_cloudfront_distribution.app.domain_name
    zone_id                = aws_cloudfront_distribution.app.hosted_zone_id
    evaluate_target_health = false
  }
}
