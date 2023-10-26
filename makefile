# [PROD-TODO] remove me
.PHONY: lazy
run_dev:
	pnpm dev

.PHONY: lazy
lazy:
	git add . && git commit -m "." && git push origin master