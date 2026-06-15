# ============ VPC ============
# Tương đương lệnh tay: aws ec2 create-vpc --cidr-block 10.0.0.0/16
# enable_dns_hostnames = true để EC2 có tên miền public
resource "aws_vpc" "main" {
  cidr_block           = "10.0.0.0/16"
  enable_dns_hostnames = true
  tags = { Name = "airlinev-tf-vpc" }
}

# ============ Internet Gateway ============
# Tạo IGW VÀ gắn vào VPC
# vpc_id = aws_vpc.main.id => Terraform tự hiểu phải tạo VPC trước (đồ thị phụ thuộc)
resource "aws_internet_gateway" "main" {
  vpc_id = aws_vpc.main.id
  tags   = { Name = "airlinev-tf-igw" }
}

# ============ Public Subnet ============
# map_public_ip_on_launch = true => EC2 trong subnet tự được cấp public IP động
resource "aws_subnet" "public" {
  vpc_id                  = aws_vpc.main.id
  cidr_block              = "10.0.1.0/24"
  availability_zone       = "ap-southeast-1a"
  map_public_ip_on_launch = true
  tags = { Name = "airlinev-tf-public-subnet" }
}

# ============ Route Table (+ route ra IGW) ============
# Khai route 0.0.0.0/0 -> IGW NGAY trong block
resource "aws_route_table" "public" {
  vpc_id = aws_vpc.main.id
  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.main.id
  }
  tags = { Name = "airlinev-tf-public-rtb" }
}

# ============ Gắn route table vào subnet ============
resource "aws_route_table_association" "public" {
  subnet_id      = aws_subnet.public.id
  route_table_id = aws_route_table.public.id
}
