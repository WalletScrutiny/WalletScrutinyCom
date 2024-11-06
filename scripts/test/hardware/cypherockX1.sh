#!/bin/bash
# cypherockX1.sh - Script to build and run Cypherock X1 firmware verification

# Ensure a version is passed as an argument
if [ -z "$1" ]; then
  echo "Usage: $0 <version>"
  exit 1
fi

# Set version tag from argument
VERSION_TAG="v$1"

# Define the image name for easy reference
IMAGE_NAME="cypherock-x1-verifier"
DOCKERFILE_PATH="scripts/test/hardware/cypherockX1.dockerfile"

# Cleanup function to remove previous images with the same tag
cleanup() {
  echo "Cleaning up old images..."
  # Remove any existing images with the same name to force a fresh build
  podman image rm -f $IMAGE_NAME || true
}

# Run the cleanup before building a new image
cleanup

# Build the Docker image using the specified Dockerfile
echo "Building the image with Podman..."
podman build -t $IMAGE_NAME --build-arg VERSION_TAG=$VERSION_TAG -f $DOCKERFILE_PATH

# Run the container to perform the firmware verification
echo "Running the container to verify firmware..."
podman run --rm $IMAGE_NAME
