locals {
  ecr_repos = ["airlinev-frontend", "airlinev-backend"]
}

resource "aws_ecr_repository" "app" {
  for_each = toset(local.ecr_repos)
  name = each.value
  image_tag_mutability = "MUTABLE" # Cho phép push đè tag
  force_delete = true
  image_scanning_configuration {
    scan_on_push = true # Tự động quét lỗ hổng khi push image
  }
}

resource "aws_ecr_lifecycle_policy" "app" {
  for_each   = aws_ecr_repository.app          
  repository = each.value.name           

  policy = <<-EOF
    {
      "rules": [
        {
          "rulePriority": 1,
          "description": "Giu 10 image moi nhat, xoa cu hon",
          "selection": {
            "tagStatus": "any",
            "countType": "imageCountMoreThan",
            "countNumber": 10
          },
          "action": { "type": "expire" }
        }
      ]
    }
  EOF
}