#!/usr/bin/env bash
set -e

IMAGE_NAME=ai-cloud-app

docker build -t ${IMAGE_NAME} .
docker run -p 8000:8000 ${IMAGE_NAME}
