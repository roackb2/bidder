project_name = bidder
base_dockerfile = build/base.Dockerfile
server_dockerfile = build/prod.Dockerfile
simple_base_image_tag = bidder-base
base_image_tag = $(registry):$(simple_base_image_tag)
container_port = 3000
start_cmd = node app.js

aws_access_key_id = $(shell echo $$AWS_ACCESS_KEY_ID)
aws_secret_access_key = $(shell echo $$AWS_SECRET_ACCESS_KEY)
registry = $(shell echo $$AWS_REGISTRY)
redis_cluster = $(shell echo $$REDIS_CLUSTER)
rabbit_host = $(shell echo $$RABBIT_HOST)
rabbit_user = $(shell echo $$RABBIT_USER)
rabbit_password = $(shell echo $$RABBIT_PASSWORD)
rabbit_vhost = $(shell echo $$RABBIT_VHOST)

# build the base image
build-base: $(base_dockerfile)
	docker build -f $(base_dockerfile) -t $(simple_base_image_tag) .
	# docker tag $(simple_base_image_tag) $(base_image_tag)

# build the server image
build-server: $(server_dockerfile)
	docker build -f $(server_dockerfile) -t $(project_name):latest .

# run the server in local Docker container
run-server:
	docker run -it --rm \
	--name $(project_name) \
	-p 80:$(container_port) \
	-e "AWS_ACCESS_KEY_ID=$(aws_access_key_id)" \
	-e "AWS_SECRET_ACCESS_KEY=$(aws_secret_access_key)" \
	-e "REDIS_CLUSTER=$(redis_cluster)" \
	-e "RABBIT_HOST=$(rabbit_host)" \
	-e "RABBIT_USER=$(rabbit_user)" \
	-e "RABBIT_PASSWORD=$(RABBIT_PASSWORD)" \
	-e "RABBIT_VHOST=$(rabbit_vhost)" \
	$(project_name):latest

build-and-run-server: build-server run-server
