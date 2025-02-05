# commit everything to the master homolog with a meaningless message like a lazy fuck
.PHONY: lazy
lazy:
	git add . && git commit -m "." && git push origin homolog

# alias for pnpm:dev
.PHONY: dev
dev:
	pnpm run:dev

# stops all docker containers
.PHONY: stop_all
stop_all: 
	docker stop $(shell docker ps -a -q)

