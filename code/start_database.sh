#!/bin/bash

sudo docker compose down

sudo docker system prune

sudo docker compose up -d mongo