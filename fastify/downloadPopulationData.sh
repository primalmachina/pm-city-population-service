#!/bin/bash
set -e # Exit immediately if a command exits with a non-zero status.

# Source the .env file
if [[ ! -f ./.env ]]; then
    echo "Error: .env file not found."
    exit 1
fi
source ./.env

# Ensure the necessary environment variables are set
if [[ -z "$DATA_BASE_PATH" || -z "$DATA_SOURCE_FILEPATH" ]]; then
    echo "Error: Required environment variables are not set."
    exit 1
fi

# Create directory specified by DATA_BASE_PATH suffixed with "files/" if it doesn't exist
TARGET_DIR="${DATA_BASE_PATH}files/"
if [[ ! -d "$TARGET_DIR" ]]; then
    mkdir -p "$TARGET_DIR"
    echo "Directory $TARGET_DIR created."
else
    echo "Directory $TARGET_DIR already exists."
fi

# Combine paths and save to a variable
COMBINED_PATH="${DATA_BASE_PATH}${DATA_SOURCE_FILEPATH}"

# Extract directory portion from the combined path and ensure it exists
DIR_PATH=$(dirname "$COMBINED_PATH")
if [[ ! -d "$DIR_PATH" ]]; then
    mkdir -p "$DIR_PATH"
    echo "Directory $DIR_PATH created."
else
    echo "Directory $DIR_PATH already exists."
fi

# Download the data
echo "Downloading data..."
curl -H 'Accept: application/vnd.github.v3.raw' \
-o "$COMBINED_PATH" \
-L https://raw.githubusercontent.com/Trazi-Ventures/sample-data-interview/main/city_populations.csv
echo "Data downloaded to $COMBINED_PATH."
