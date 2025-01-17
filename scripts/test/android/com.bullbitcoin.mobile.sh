#!/bin/bash
# com.bullbitcoin.mobile.sh v0.1.0-alpha.7
# App-specific script for building the Bull Bitcoin mobile app
# Expects variables from testAAB.sh: appId, versionName, workDir, deviceSpec

repo="https://github.com/BullBitcoin/bull-bitcoin-mobile.git"

# Create a temporary directory for the build context
BUILD_DIR="${workDir}/build_context"

# Create a clean build directory

BUILD_DIR=$(mktemp -d)
cp "$TEST_ANDROID_DIR/com.bullbitcoin.mobile.dockerfile" "$BUILD_DIR/Dockerfile"
cp "$deviceSpec" "$BUILD_DIR/device-spec.json"

# Build from clean directory (should be in /tmp/test_${appId}_${versionName}/build_context)
cd "$BUILD_DIR"
podman build -t bull-mobile .

# Run the built container and wait for it to complete
podman run --name bull-container bull-mobile

# Copy the built AAB from the container
podman cp bull-container:/app/app.apks ./

# Remove the container
podman rm bull-container

# Unzip the main holding APK
unzip -qq -j app.apks -d "$workDir/built-split_apks"