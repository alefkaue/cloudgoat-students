#Security Groups
resource "aws_security_group" "cg-ec2-ssh-security-group" {
  name        = "cg-ec2-ssh-${var.cgid}"
  description = "CloudGoat ${var.cgid} Security Group for EC2 Instance over SSH"
  vpc_id      = aws_vpc.cg-vpc.id

  ingress {
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = var.cg_whitelist
  }

  egress {
    from_port = 0
    to_port   = 0
    protocol  = "-1"
    cidr_blocks = [
      "0.0.0.0/0"
    ]
  }

  tags = merge(local.default_tags, {
    Name = "cg-ec2-ssh-${var.cgid}"
  })
}

resource "aws_security_group" "cg-ec2-http-security-group" {
  name        = "cg-ec2-http-${var.cgid}"
  description = "CloudGoat ${var.cgid} Security Group for EC2 Instance over HTTP"
  vpc_id      = aws_vpc.cg-vpc.id

  ingress {
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = var.cg_whitelist
  }

  egress {
    from_port = 0
    to_port   = 0
    protocol  = "-1"
    cidr_blocks = [
      "0.0.0.0/0"
    ]
  }

  tags = merge(local.default_tags, {
    Name = "cg-ec2-http-${var.cgid}"
  })
}

#AWS Key Pair
resource "aws_key_pair" "cg-ec2-key-pair" {
  key_name   = "cg-ec2-key-pair-${var.cgid}"
  public_key = file(var.ssh-public-key-for-ec2)
}

#EC2 Instance
resource "aws_instance" "ec2-vulnerable-proxy-server" {
  ami                         = data.aws_ssm_parameter.amazon_linux_ami.value
  instance_type               = "t3.micro"
  iam_instance_profile        = data.aws_iam_instance_profile.academy.name
  subnet_id                   = aws_subnet.cg-public-subnet-1.id
  associate_public_ip_address = true

  vpc_security_group_ids = [
    aws_security_group.cg-ec2-ssh-security-group.id,
    aws_security_group.cg-ec2-http-security-group.id
  ]

  key_name = aws_key_pair.cg-ec2-key-pair.key_name
  root_block_device {
    volume_type           = "gp2"
    volume_size           = 8
    delete_on_termination = true
  }

  # Required by the original educational exercise; do not reuse in production.
  metadata_options {
    http_endpoint               = "enabled"
    http_tokens                 = "optional"
    http_put_response_hop_limit  = 1
  }

  # Provision the proxy atomically through cloud-init, avoiding an SSH/upload race.
  user_data = <<-EOF
    #!/bin/bash
    set -euo pipefail
    dnf install -y nginx
    echo '${filebase64("../assets/proxy.com")}' | base64 --decode > /etc/nginx/conf.d/default.conf
    printf 'events {}\nhttp { include /etc/nginx/conf.d/*.conf; }\n' > /etc/nginx/nginx.conf
    nginx -t
    systemctl enable --now nginx
  EOF

  volume_tags = merge(local.default_tags, {
    Name = "CloudGoat ${var.cgid} EC2 Instance Root Device"
  })

  tags = merge(local.default_tags, {
    Name = "ec2-vulnerable-proxy-server-${var.cgid}"
  })
}
