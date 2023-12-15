#!/bin/bash

docker compose down

docker system prune

docker compose build --no-cache 
 
docker compose up -d