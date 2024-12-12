# Variables
DOCKER_COMPOSE_FILE=docker-compose.yml
# PROJECT_NAME=my_project  # Replace with your Docker Compose project name

# Build and start services
up:
	docker compose up
build:
	docker compose up --build 

clean:
	docker system prune

stop:
	docker compose -f $(DOCKER_COMPOSE_FILE) down 

# Restart services
restart: clean build

# Remove only containers
remove-containers:
	docker rm -f $$(docker ps -aq)

# Remove only images
remove-images:
	docker rmi -f $$(docker images -q)

# Remove volumes
remove-volumes:
	docker volume rm $$(docker volume ls -q)
# Rebuild the services after cleaning containers and images
rebuild: remove-containers remove-images build

# View running containers
ps:
	docker compose -f $(DOCKER_COMPOSE_FILE) ps

# Tail logs from all services
logs:
	docker compose -f $(DOCKER_COMPOSE_FILE) logs -f

.PHONY: build clean restart remove-containers remove-images rebuild ps logs
