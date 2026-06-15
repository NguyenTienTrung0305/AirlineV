# Khai báo Terraform cần gì để chạy
terraform {
  required_version = ">= 1.0"
  required_providers {
    # provider = trình điều khiển để Terraform nói chuyện với AWS.
    # Tải tự động khi chạy `terraform init`. ~> 5.0 nghĩa là dùng bản 5.x mới nhất.
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
    # http provider: để lấy IP công khai hiện tại (giới hạn SSH cho an toàn).
    http = {
      source  = "hashicorp/http"
      version = "~> 3.0"
    }
  }
}

# Cấu hình provider AWS: dùng region Singapore. 
# Credentials lấy tự động từ `aws configure` nên không cần set
provider "aws" {
  region = "ap-southeast-1"
}
