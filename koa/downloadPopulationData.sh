#!/bin/bash

# Source the .env file
source ./.env

# Ensure the directory from DATA_BASE_PATH exists
mkdir -p $DATA_BASE_PATH

# Download the data
curl -H 'Accept: application/vnd.github.v3.raw' \
-o "${DATA_BASE_PATH}${DATA_FILENAME}" \
-L https://raw.githubusercontent.com/Trazi-Ventures/sample-data-interview/main/city_populations.csv
