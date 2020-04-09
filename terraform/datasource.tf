data "aws_availability_zones" "available" {}
data "aws_subnet_ids" "subnet_ids" {
  vpc_id = "${aws_vpc.main.id}"
}
