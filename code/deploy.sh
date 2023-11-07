#!/bin/bash

# This script is used to deploy the Omega Chess application to the server

rsync -azP --exclude={".next","node_modules"} $(pwd)/* gianlorenzo@pi:~/OMEGA

ssh gianlorenzo@pi 'cd ~/OMEGA && docker compose down && docker compose build --no-cache && docker compose up -d'