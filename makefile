.PHONY: lazy
lazy:
	git add . && git commit -m "." && git push origin master

.PHONY: run_dev
run_dev:
	pnpm dev

.PHONY: start_deps
start_deps: 
	docker compose -f docker/docker-compose.yml -p rastercar_api up -d

.PHONY: stop_deps
stop_deps:
	docker stop rastercar-db
	docker stop rastercar-rmq
	docker stop rastercar-jaeger
