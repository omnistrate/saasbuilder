.PHONY: all
all: docker-build

.PHONY: docker-build
docker-build:
	docker build -f Dockerfile -t saasbuilder .

.PHONY: docker-run
docker-run:
	docker run -t saasbuilder 