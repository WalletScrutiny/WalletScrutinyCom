#!/bin/bash

# Define the repository URL and directory name
REPO_URL="https://github.com/Foundation-Devices/envoy.git"
REPO_DIR="envoy"

# Clone the repository
echo "Cloning the repository from $REPO_URL"
git clone "$REPO_URL"
cd "$REPO_DIR" || exit

# Build the Docker image
echo "Building the Dockerfile"
docker build -t envoy-image .

# Run the Docker container
echo "Running the Docker container"
CONTAINER_ID=$(docker run -d envoy-image)

# Wait for the container to finish
docker wait "$CONTAINER_ID"

# Check if the container has exited and then copy the APK or any required files
echo "Container has exited. Extracting APK or build outputs..."
docker cp "$CONTAINER_ID":/root/target/aarch64-linux-android/release/ /home/keraliss/projects/walletScrutiny_build/envoy/

# Clean up the container
docker rm "$CONTAINER_ID"

echo "Process completed."
