project_name = bidder
base_dockerfile = build/base.Dockerfile
server_dockerfile = build/prod.Dockerfile
simple_base_image_tag = node-base
registry = $(shell echo $$AWS_REGISTRY)
base_image_tag = $(registry):$(simple_base_image_tag)
container_port = 3000
start_cmd = node app.js

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
	$(project_name):latest
