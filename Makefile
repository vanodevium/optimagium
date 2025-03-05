.DEFAULT_GOAL: help
.PHONY: help build up restart down run shell logs

help:
	@sed -rn 's/^([a-zA-Z_-]+):.*## (.*)$$/"\1" "\2"/p' < $(MAKEFILE_LIST) | xargs printf "make %-20s# %s\n"
build: ## build image
	@if [ "$(docker-compose images -q)" != "" ]; then \
		docker rmi $(docker-compose images -q) -f; \
	else \
	  echo "skipped"; \
	fi
	docker-compose build --quiet --pull --no-cache
up: ## up optimagium
	docker-compose up -d --build --force-recreate
restart: ## restart optimagium
	docker-compose restart
down: ## stop optimagium
	docker-compose down --remove-orphans
run: ## run optimagium
	docker-compose up --force-recreate
shell: ## shell
	docker-compose run --rm optimagium sh
logs: ## show docker-compose logs
	docker-compose logs -f
