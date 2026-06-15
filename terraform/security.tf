# ============ Lấy IP công khai của máy đang chạy terraform ============
# Gọi checkip.amazonaws.com để biết IP máy, rồi giới hạn SSH chỉ cho IP đó
data "http" "myip" {
  url = "https://checkip.amazonaws.com"
}

locals {
  # response_body có ký tự xuống dòng => chomp() bỏ đi, thêm /32 (đúng 1 IP).
  my_ip_cidr = "${chomp(data.http.myip.response_body)}/32"
}

# ============ Security Group ============
resource "aws_security_group" "web" {
  name        = "airlinev-tf-sg"
  description = "SG cho AirlineV EC2 (Terraform)"
  vpc_id      = aws_vpc.main.id

  # SSH (22): Chỉ cho IP máy
  # from_port, to_port: mở từ port nào đến port nào (request đi vào các port này)
  ingress {
    description = "SSH"
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = [local.my_ip_cidr]
  }

  # HTTP (80): nginx/HTTPS
  ingress {
    description = "HTTP"
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  # Frontend (3000): người dùng mở web
  ingress {
    description = "frontend"
    from_port   = 3000
    to_port     = 3000
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  # Backend (8080): trình duyệt gọi API trực tiếp
  ingress {
    description = "backend"
    from_port   = 8080
    to_port     = 8080
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  # Egress: cho phép mọi kết nối ĐI RA (protocol "-1" = tất cả)
  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = { Name = "airlinev-tf-sg" }
}
