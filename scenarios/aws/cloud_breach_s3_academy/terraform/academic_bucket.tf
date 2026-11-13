# Bucket lifecycle uses permitted CLI APIs to avoid the denied Object Lock read.
resource "terraform_data" "academic_bucket" {
  input = {
    bucket  = "cg-cardholder-data-bucket-${local.s3_bucket_suffix}"
    profile = var.profile
    region  = var.region
    owner   = data.aws_caller_identity.aws-account-id.account_id
    tags    = jsonencode({ TagSet = [for k, v in merge(local.default_tags, { Name = "cg-cardholder-data-bucket-${local.s3_bucket_suffix}" }) : { Key = k, Value = v }] })
  }
  provisioner "local-exec" {
    command = "bash ../assets/manage-bucket.sh create"
    environment = {
      AWS_PROFILE = self.input.profile
      AWS_DEFAULT_REGION = self.input.region
      LAB_BUCKET = self.input.bucket
      LAB_OWNER = self.input.owner
      LAB_TAGS = self.input.tags
    }
  }
  provisioner "local-exec" {
    when = destroy
    command = "bash ../assets/manage-bucket.sh destroy"
    environment = {
      AWS_PROFILE = self.input.profile
      AWS_DEFAULT_REGION = self.input.region
      LAB_BUCKET = self.input.bucket
      LAB_OWNER = self.input.owner
    }
  }
}
