provider "aws" {
  profile = "default"
  region  = "eu-west-1"
}


variable "db_pass" {
  type = string

}

variable "db_username" {
  type = string
}
resource "aws_vpc" "main" {
  cidr_block           = "10.0.0.0/16"
  enable_dns_hostnames = true
}
resource "aws_internet_gateway" "gw" {
  vpc_id = aws_vpc.main.id



}
resource "aws_subnet" "main" {
  vpc_id                  = aws_vpc.main.id
  cidr_block              = "10.0.1.0/24"
  availability_zone       = "eu-west-1a"
  map_public_ip_on_launch = true
  tags = {
    Name = "Main"
  }
}
resource "aws_subnet" "main2" {
  vpc_id                  = aws_vpc.main.id
  cidr_block              = "10.0.2.0/24"
  availability_zone       = "eu-west-1b"
  map_public_ip_on_launch = true

  tags = {
    Name = "Main2"
  }
}
resource "aws_db_subnet_group" "default" {
  name       = "main"
  subnet_ids = [aws_subnet.main.id, aws_subnet.main2.id]

  tags = {
    Name = "DB subnet group"
  }
}
resource "aws_route_table" "r" {
  vpc_id = aws_vpc.main.id
  route {
    gateway_id = aws_internet_gateway.gw.id
    cidr_block = "0.0.0.0/0"
  }

}
resource "aws_db_instance" "paper_db" {

  allocated_storage            = 250
  storage_type                 = "gp2"
  engine                       = "postgres"
  engine_version               = "11.5"
  instance_class               = "db.t3.small"
  name                         = "paper_db"
  identifier                   = "papers"
  username                     = "rooter"
  password                     = "some pass"
  apply_immediately            = true
  db_subnet_group_name         = aws_db_subnet_group.default.name
  skip_final_snapshot          = true
  publicly_accessible          = true
  performance_insights_enabled = true
  auto_minor_version_upgrade   = false

}
resource "aws_security_group" "database" {
  name        = "default"
  vpc_id      = aws_vpc.main.id
  description = "db security group"

  ingress {
    # TLS (change to whatever ports you need)
    from_port = 5432
    to_port   = 5432
    protocol  = "tcp"
    # Please restrict your ingress to only necessary IPs and ports.
    # Opening to 0.0.0.0/0 can lead to security vulnerabilities.
    cidr_blocks      = ["0.0.0.0/0"] # add a CIDR block here
    ipv6_cidr_blocks = ["::/0"]
  }

  egress {
    from_port        = 0
    to_port          = 0
    protocol         = "-1"
    cidr_blocks      = ["0.0.0.0/0"]
    ipv6_cidr_blocks = ["::/0"]
  }
}

//resource "aws_rds_cluster" "paper_db2" {
//  cluster_identifier      = "papers2"
//  engine                  = "aurora-postgresql"
//  engine_mode = "serverless"
//  database_name           = "paper_db"
//  master_username         = "root"
//  master_password         = "some pass"
//  apply_immediately = true
//skip_final_snapshot = true
//  vpc_security_group_ids = [aws_security_group.database.id]
//}

output "db_endpoint" {
  value = aws_db_instance.paper_db.endpoint
}
