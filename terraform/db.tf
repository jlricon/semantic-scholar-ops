provider "aws" {
  profile    = "default"
  region     = "eu-west-1"
}

variable "db_pass"{
type = string

}
variable "db_username"{
type= string
}
resource "aws_vpc" "main" {
  cidr_block = "10.0.0.0/16"
  enable_dns_hostnames=true
}
resource "aws_internet_gateway" "gw" {
  vpc_id = aws_vpc.main.id
  


}
resource "aws_subnet" "main" {
  vpc_id     = aws_vpc.main.id
  cidr_block = "10.0.1.0/24"
  availability_zone="eu-west-1a"
    map_public_ip_on_launch = true
  tags = {
    Name = "Main"
  }
}
resource "aws_subnet" "main2" {
  vpc_id     = aws_vpc.main.id
  cidr_block = "10.0.2.0/24"
  availability_zone="eu-west-1b"
  map_public_ip_on_launch = true

  tags = {
    Name = "Main2"
  }
}
resource "aws_db_subnet_group" "default" {
  name       = "main"
  subnet_ids = [aws_subnet.main.id,aws_subnet.main2.id]

  tags = {
    Name = "DB subnet group"
  }
}
resource "aws_route_table" "r" {
  vpc_id = aws_vpc.main.id
  route{
      gateway_id=aws_internet_gateway.gw.id
      cidr_block="0.0.0.0/0"
  }
 
}
resource "aws_db_instance" "paper_db" {

  allocated_storage    = 250
  storage_type         = "gp2"
  engine               = "postgres"
  engine_version       = "11.5"
  instance_class       = "db.t2.micro"
  name                 = "paper_db"
  identifier = "papers"
  username             = "rooter"
  password             = "KHn5Exzp4aBfcs"
  apply_immediately = true
  db_subnet_group_name =aws_db_subnet_group.default.name
  skip_final_snapshot=true
  publicly_accessible=true
  performance_insights_enabled = true
  auto_minor_version_upgrade = false

}
output "db_endpoint" {
    value = aws_db_instance.paper_db.endpoint
}
