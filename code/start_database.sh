#!/bin/bash

sudo docker compose down

sudo docker system prune -f

sudo docker compose up -d mongo