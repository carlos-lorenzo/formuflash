#!/bin/sh

# Build and push images to GCP

# Frontend
echo "Building and pushing frontend..."
docker-compose -f ../nginx/build/docker-compose.yaml build
docker tag nginx:latest europe-southwest1-docker.pkg.dev/extended-line-433411-d1/formuflash-images/nginx:latest
docker push europe-southwest1-docker.pkg.dev/extended-line-433411-d1/formuflash-images/nginx:latest
docker rmi europe-southwest1-docker.pkg.dev/extended-line-433411-d1/formuflash-images/nginx:latest
docker rmi nginx:latest

# Backend
# echo "Building and pushing backend..."
# docker-compose -f ../backend/docker-compose.yaml build
# docker tag django:latest europe-southwest1-docker.pkg.dev/extended-line-433411-d1/formuflash-images/django:latest
# docker push europe-southwest1-docker.pkg.dev/extended-line-433411-d1/formuflash-images/django:latest
# docker rmi europe-southwest1-docker.pkg.dev/extended-line-433411-d1/formuflash-images/django:latest
# docker rmi django:latest

echo "Done!"