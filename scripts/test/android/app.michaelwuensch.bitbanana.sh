#!/bin/bash

# Set variables
REPO_URL="https://github.com/michaelWuensch/BitBanana.git"
TAG="v0.8.6"
OUTPUT_DIR="$workDir"
DOCKER_IMAGE="mingc/android-build-box:1.25.0"
PROJECT_DIR="BitBanana"

# Clone the repository if it doesn't already exist
if [ ! -d "$PROJECT_DIR" ]; then
  echo "Cloning BitBanana repository..."
  git clone "$REPO_URL"
else
  echo "BitBanana repository already exists. Skipping clone."
fi

# Change to the project directory
cd "$PROJECT_DIR" || exit

# Checkout the specific tag
echo "Checking out tag $TAG..."
git fetch --all
git checkout "$TAG"

# Build the APK using Docker and mount the output directory
echo "Building the APK with Docker..."
docker run --rm -v "$(pwd)":/project -v "$OUTPUT_DIR":/output "$DOCKER_IMAGE" bash -c 'cd /project; ./gradlew --no-daemon assembleRelease && cp app/build/outputs/apk/release/*-release-unsigned.apk /output/'

# Check if APK was built and copied successfully
if [ "$(ls -A "$OUTPUT_DIR")" ]; then
  echo "APK built and copied successfully to $OUTPUT_DIR."
else
  echo "Failed to build or copy APK. Please check the build logs for errors."
  exit 1
fi
