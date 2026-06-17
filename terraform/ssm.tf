resource "aws_iam_role" "ssm" {
    name = "airlinev-ssm-role"
    assume_role_policy = jsonencode({
        Version = "2012-10-17"
        Statement = [{
            Effect = "Allow"
            Principal = {
                Service = "ec2.amazonaws.com"  # Chỉ tin EC2
            }
            Action = "sts:AssumeRole"
        }]
    })
}

# Đính kèm policy (có sẵn của AWS) cho EC2 đăng ký + nhận lệnh SSM
resource "aws_iam_role_policy_attachment" "ssm_core" {
    role       = aws_iam_role.ssm.name
    policy_arn = "arn:aws:iam::aws:policy/AmazonSSMManagedInstanceCore"
}

# Đính kèm policy cho EC2 docker pull từ ECR (private)
resource "aws_iam_role_policy_attachment" "ecr_read" {
    role       = aws_iam_role.ssm.name
    policy_arn = "arn:aws:iam::aws:policy/AmazonEC2ContainerRegistryReadOnly"
}

# Bọc role vào instance profile để EC2 nhận role này
resource "aws_iam_instance_profile" "ssm" {
    name = "airlinev-ssm-profile"
    role = aws_iam_role.ssm.name
}