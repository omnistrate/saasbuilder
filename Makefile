.PHONY: all
all: docker-build

.PHONY: docker-build
docker-build-dev:
	docker build -f Dockerfile -t saasbuilder .