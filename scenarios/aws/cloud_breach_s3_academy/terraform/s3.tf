#Secret S3 Bucket
# Bucket lifecycle is defined in academic_bucket.tf.

# S3 Objects Uploaded
resource "aws_s3_object" "s3-objects" {
  for_each = toset(local.s3_objects)

  bucket = terraform_data.academic_bucket.output.bucket
  key    = each.key
  source = "../assets/${each.key}"

  tags = merge(local.default_tags, {
    Name = "cardholder-data-${var.cgid}"
  })
}
