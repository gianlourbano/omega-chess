#!/bin/bash

# VERSION 3.0

## BE SURE TO HAVE THE default.yaml FILE IN THE SAME FOLDER AS THIS SCRIPT

## USE IT LIKE THIS:
## chmod +x install-agent.sh
## sudo bash install-agent.sh <instance>
## where instance is the name you will use to identify the data in grafana
## Example: sudo bash install-agent.sh gianlo-linux

## TO CHECK IF AGENT IS RUNNING: sudo systemctl status grafana-agent
## TO START AGENT: sudo systemctl start grafana-agent
## TO CHECK IF EVERYTHING WENT FINE: sudo cat /etc/grafana-agent.yaml
##	if you see the name you passed as a parameter for instance and in the header section

# Update repos
sudo mkdir -p /etc/apt/keyrings/
wget -q -O - https://apt.grafana.com/gpg.key | gpg --dearmor | sudo tee /etc/apt/keyrings/grafana.gpg > /dev/null
echo "deb [signed-by=/etc/apt/keyrings/grafana.gpg] https://apt.grafana.com stable main" | sudo tee /etc/apt/sources.list.d/grafana.list
sudo apt-get update

## Install Agent
sudo apt-get install grafana-agent


## Configure agent
sudo cp ./default.yaml /etc/grafana-agent.yaml
sudo sed -i -e 's/<instance>/'"$1"'/g' /etc/grafana-agent.yaml

## Run agent
sudo systemctl start grafana-agent

## Enable agent on boot
sudo systemctl enable grafana-agent.service
