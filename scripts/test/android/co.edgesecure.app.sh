#!/bin/bash

# Repository and tag information
repo="https://github.com/EdgeApp/edge-react-gui"
tag="v4.12.0"

# APK output location
builtApk="$workDir/output/app-release-universal.apk"

# Test function for building the app using Docker
test() {
    # Remove any existing container with the same name
    docker rm -f edgeapp-container || true

    # Build the Docker image using the corresponding Dockerfile
    docker build --tag edgeapp-build --file $SCRIPT_DIR/test/android/co.edgesecure.app.dockerfile .

    # Create the output directory if it doesn't exist
    mkdir -p $workDir/output

    # Run the container to execute the build
    docker run --rm --name edgeapp-container -v $workDir:/mnt edgeapp-build

    # Copy the built APK from the container to the local filesystem
    docker cp edgeapp-container:/home/appuser/output/app-release-universal.apk $builtApk
}
