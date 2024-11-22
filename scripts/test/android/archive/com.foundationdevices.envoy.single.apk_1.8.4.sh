#!/bin/bash

# Define the repository URL and directory name
REPO_URL="https://github.com/Foundation-Devices/envoy.git"
REPO_DIR="envoy"

# Clone the repository
git clone "$REPO_URL"
cd "$REPO_DIR" || exit

# Run the 'just docker-build-android' command
echo "Running 'just docker-build-android'"
just docker-build-android

# The APK should be generated inside the Docker container, 
# you can copy it to your local machine if necessary.
OUTPUT_DIR="${HOME}/envoy-builds"
mkdir -p "$OUTPUT_DIR"
echo "Copying APK or build outputs to $OUTPUT_DIR"
docker cp "$(docker ps -lq)":/root/target/aarch64-linux-android/release/ "$OUTPUT_DIR"
echo "Process completed."