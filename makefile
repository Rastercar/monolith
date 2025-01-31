# commit everything to the master homolog with a meaningless message like a lazy fuck
.PHONY: lazy
lazy:
	git add . && git commit -m "." && git push origin homolog

# alias for pnpm:dev
.PHONY: dev
dev:
	pnpm run:dev

# start all dev dependencies containers
.PHONY: start_deps
start_deps: 
	docker compose -f docker/docker-compose.deps.yml -p dev up -d --remove-orphans

# stop all dev dependencies containers
.PHONY: stop_deps
stop_deps:
	docker stop rastercar-db
	docker stop rastercar-db-test
	docker stop rastercar-rmq
	docker stop rastercar-jaeger

# runs all dependencies and the monolith on docker containers
.PHONY: start_app_with_deps
start_app_with_deps: 
	docker compose -f docker/docker-compose.app_with_deps.yml -p prod up -d --remove-orphans

# runs all dependencies and the monolith on docker containers
.PHONY: start_app_with_deps
stop_app_with_deps: 
	docker compose -f docker/docker-compose.app_with_deps.yml -p prod up -d --remove-orphans

# stops all docker containers
.PHONY: stop_all
stop_all: 
	docker stop $(shell docker ps -a -q)

