.PHONY: lint test build

lint:
	npx tsc --noEmit

test:
	npx vitest run

build:
	npx tsc --noEmit
