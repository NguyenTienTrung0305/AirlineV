# output = giá trị Terraform in ra sau khi apply (tiện lấy nhanh, khỏi vào Console tìm).
output "public_ip" {
  description = "Public IP (Elastic IP) cua EC2"
  value       = aws_eip.web.public_ip
}

output "ssh_command" {
  description = "Lenh SSH vao may"
  value       = "ssh -i \"$HOME/airlinev-key.pem\" ec2-user@${aws_eip.web.public_ip}"
}

output "web_url" {
  description = "URL web sau khi deploy"
  value       = "http://${aws_eip.web.public_ip}:3000"
}


output "ecr_repo_urls" {
  description = "URL các ECR repo (frontend/backend)"
  value = {
    for name, repo in aws_ecr_repository.app : name => repo.repository_url
  }
}

output "github_actions_role_arn" {
  description = "ARN role cho GitHub Actions assume qua OIDC"
  value       = aws_iam_role.github.arn
}