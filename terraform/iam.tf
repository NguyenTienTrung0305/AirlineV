# 1. aws_iam_openid_connect_provider — đăng ký tin GitHub
resource "aws_iam_openid_connect_provider" "github" {
  url = "https://token.actions.githubusercontent.com"
  client_id_list = ["sts.amazonaws.com"]
}


# 2. aws_iam_role — Tạo role + định nghĩa ai được phép đóng vai role này (trust policy)
resource "aws_iam_role" "github" {
    name = "airlinev-github-role"
    assume_role_policy = jsonencode({
        Version = "2012-10-17"
        Statement = [{
            Effect = "Allow"
            Principal = {
                Federated = aws_iam_openid_connect_provider.github.arn  # Chỉ tin GitHub (OIDC provider)
            }
            Action = "sts:AssumeRoleWithWebIdentity"
            Condition = {
                StringEquals = {
                    "token.actions.githubusercontent.com:aud": "sts.amazonaws.com"                    # aud (audience): token này dành cho ai nhận
                }
                StringLike = {
                    "token.actions.githubusercontent.com:sub": "repo:NguyenTienTrung0305/AirlineV:ref:refs/heads/master"  # Chỉ tin branch master của repo này
                }
            }
        }]
    })
}


# 3. aws_iam_role_policy — Cho IAM role được phép làm gì với Resource nào (permissions policy)
resource "aws_iam_role_policy" "github" {
    name = "airlinev-github-policy"
    role = aws_iam_role.github.name
    policy = jsonencode({
        Version = "2012-10-17"
        Statement = [
            {
                Effect   = "Allow"
                Action   = "ecr:GetAuthorizationToken"   # lệnh login, buộc phải *
                Resource = "*"
            },
            {
                Effect = "Allow"
                Action = [
                "ecr:BatchCheckLayerAvailability",
                "ecr:CompleteLayerUpload",
                "ecr:GetDownloadUrlForLayer",
                "ecr:InitiateLayerUpload",
                "ecr:PutImage",
                "ecr:UploadLayerPart",
                "ecr:BatchGetImage"
                ]
                Resource = [for r in aws_ecr_repository.app : r.arn]   # Chỉ 2 kho của mình
            },
            {
                Effect = "Allow"
                Action = [
                    "ssm:SendCommand", # gửi lệnh
                    "ssm:GetCommandInvocation", # đọc kết quả/exit code lệnh
                    "ssm:ListCommandInvocations"
                ]
                Resource = "*"
            }
        ]
    })
}