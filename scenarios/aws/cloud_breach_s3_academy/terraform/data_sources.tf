data "aws_caller_identity" "aws-account-id" {}

data "aws_iam_instance_profile" "academy" {
  name = var.existing_instance_profile
}

data "aws_ssm_parameter" "amazon_linux_ami" {
  name = "/aws/service/ami-amazon-linux-latest/al2023-ami-kernel-default-x86_64"
}
