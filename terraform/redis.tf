# resource "aws_elasticache_subnet_group" "redis_subnet" {
#   name       = "redis-subnet"
#   subnet_ids = [aws_subnet.main.id,aws_subnet.main2.id]
# }
# resource "aws_elasticache_cluster" "redis" {
#   cluster_id           = "redis-papers"
#   engine               = "redis"
#   node_type            = "cache.t2.micro"
#   num_cache_nodes      = 1
#   parameter_group_name = "default.redis5.0"
#   engine_version       = "5.0.5"
#   port                 = 6379
#   apply_immediately=true
#   subnet_group_name = aws_elasticache_subnet_group.redis_subnet.name
  

# }
# output "redis_endpoint"{
#     value = aws_elasticache_cluster.redis.cache_nodes
# }