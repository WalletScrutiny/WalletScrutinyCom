#!/bin/bash

# Repository and tag information
repo="https://github.com/EdgeApp/edge-react-gui"
tag="v$versionName"

# APK output location
workDir="/tmp/test_co.edgesecure.app"
builtApk="$workDir/output/app-release-universal.apk"

# Test function for building the app using Docker
test() {
    # Remove any existing container with the same name
    docker rm -f edgeapp-container || true

    # Build the Docker image
    docker build --tag edgeapp-build --file $SCRIPT_DIR/test/android/co.edgesecure.app.dockerfile .

    # Create the output directory
    mkdir -p $workDir/output

    # Run the container and copy the APK in one step
    docker create --name edgeapp-container edgeapp-build
    docker cp edgeapp-container:/home/appuser/output/app-release-universal.apk $builtApk
    docker rm edgeapp-container

    # Verify the APK was copied
    if [ -f "$builtApk" ]; then
        echo "APK successfully built and copied to $builtApk"
    else
        echo "Failed to copy APK"
        exit 1
    fi
}