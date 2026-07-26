data "aws_ssm_parameter" "openai_api_key" {
  name = "/manual/dear-next-visitor/OPENAI_API_KEY"
}
data "aws_ssm_parameter" "libsql_url" {
  name = "/manual/dear-next-visitor/LIBSQL_DB_URL"
}
data "aws_ssm_parameter" "libsql_token" {
  name = "/manual/dear-next-visitor/LIBSQL_DB_TOKEN"
}
