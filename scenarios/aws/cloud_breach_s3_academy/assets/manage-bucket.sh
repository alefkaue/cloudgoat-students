#!/bin/bash
set -euo pipefail
export AWS_PAGER=""
: "${LAB_BUCKET:?}" "${LAB_OWNER:?}" "${AWS_PROFILE:?}" "${AWS_DEFAULT_REGION:?}"
[[ "$LAB_BUCKET" =~ ^cg-cardholder-data-bucket-cgid[a-z0-9]+$ ]] || exit 2
CURRENT_OWNER=$(aws sts get-caller-identity --query Account --output text)
[[ "$CURRENT_OWNER" == "$LAB_OWNER" ]] || { echo "Wrong AWS account" >&2; exit 3; }
EXISTS=$(aws s3api list-buckets --query "contains(Buckets[].Name, '$LAB_BUCKET')" --output text)
case "${1:-}" in
  create)
    if [[ "$EXISTS" == "False" ]]; then
      if [[ "$AWS_DEFAULT_REGION" == "us-east-1" ]]; then
        aws s3api create-bucket --bucket "$LAB_BUCKET"
      else
        aws s3api create-bucket --bucket "$LAB_BUCKET" --create-bucket-configuration "LocationConstraint=$AWS_DEFAULT_REGION"
      fi
    elif [[ "$EXISTS" != "True" ]]; then
      echo "Unexpected list-buckets response" >&2; exit 4
    fi
    aws s3api head-bucket --bucket "$LAB_BUCKET" --expected-bucket-owner "$LAB_OWNER"
    aws s3api put-bucket-tagging --bucket "$LAB_BUCKET" --expected-bucket-owner "$LAB_OWNER" --tagging "$LAB_TAGS"
    ;;
  destroy)
    if [[ "$EXISTS" == "False" ]]; then exit 0; fi
    [[ "$EXISTS" == "True" ]] || exit 4
    aws s3api head-bucket --bucket "$LAB_BUCKET" --expected-bucket-owner "$LAB_OWNER"
    aws s3 rb "s3://$LAB_BUCKET" --force
    ;;
  *) exit 2 ;;
esac
