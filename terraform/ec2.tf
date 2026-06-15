data "aws_ssm_parameter" "al2023" {
  name = "/aws/service/ami-amazon-linux-latest/al2023-ami-kernel-default-x86_64"
}

# ============ Elastic IP (public IP cố định) ============
resource "aws_eip" "web" {
  domain = "vpc"
  tags   = { Name = "airlinev-tf-eip" }
}

# ============ EC2 instance ============
resource "aws_instance" "web" {
  ami                    = data.aws_ssm_parameter.al2023.value
  instance_type          = "t3.micro"
  subnet_id              = aws_subnet.public.id
  vpc_security_group_ids = [aws_security_group.web.id]
  key_name               = "airlinev-key" # tái dùng key pair đã tạo tay (vẫn còn trong account)

  # Ổ cứng 20GB gp3 
  root_block_device {
    volume_size = 20
    volume_type = "gp3"
  }

  # user_data: script chạy một lần lúc máy boot lần đầu (cloud-init, chạy bằng root)
  # Cài sẵn toàn bộ môi trường => khỏi cần SSH vào EC2 để cài đặt thủ công, tiện cho scale sau này
  # Lưu ý: $${VAR} = giữ nguyên cho bash (tránh Terraform hiểu nhầm là biến của nó)
  user_data = <<-EOF
    #!/bin/bash
    set -e
    dnf install -y docker git
    systemctl enable --now docker
    usermod -aG docker ec2-user

    # Docker Compose v2 plugin
    mkdir -p /usr/local/lib/docker/cli-plugins
    curl -SL https://github.com/docker/compose/releases/latest/download/docker-compose-linux-x86_64 -o /usr/local/lib/docker/cli-plugins/docker-compose
    chmod +x /usr/local/lib/docker/cli-plugins/docker-compose

    # Buildx mới (bản kèm AL2023 quá cũ <0.17 nên compose build lỗi)
    BUILDX_VER=$(curl -s https://api.github.com/repos/docker/buildx/releases/latest | grep '"tag_name"' | cut -d '"' -f4)
    curl -SL "https://github.com/docker/buildx/releases/download/$${BUILDX_VER}/buildx-$${BUILDX_VER}.linux-amd64" -o /usr/local/lib/docker/cli-plugins/docker-buildx
    chmod +x /usr/local/lib/docker/cli-plugins/docker-buildx

    # Swap 2GB chống OOM khi next build
    dd if=/dev/zero of=/swapfile bs=128M count=16
    chmod 600 /swapfile
    mkswap /swapfile
    swapon /swapfile
    echo '/swapfile none swap sw 0 0' >> /etc/fstab
  EOF

  tags = { Name = "airlinev-tf-ec2" }
}

# ============ Gắn Elastic IP vào EC2 ============
resource "aws_eip_association" "web" {
  instance_id   = aws_instance.web.id
  allocation_id = aws_eip.web.id
}
