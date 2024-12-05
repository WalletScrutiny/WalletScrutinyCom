#!/bin/bash
# world.bitkey.app.sh v0.1.0-alpha.8
# App-specific script for building the Bitkey app
# Expects variables from testAAB.sh: appId, versionName, workDir

set -e  # Exit on error
set -x  # Enable debugging output

# Debug function
debug_container_fs() {
    local container=$1
    echo "=== Debugging container filesystem ==="
    echo "Current directory structure:"
    docker exec $container bash -c 'cd /build && source bin/activate-hermit && echo "PWD: $(pwd)" && echo "Gradle version:" && gradle --version'
}

# Cleanup function
cleanup() {
    local exit_code=$?
    echo "Cleaning up..."
    
    # Remove temporary files and directories but keep artifacts
    if [ -d "$BITKEY_REPO_DIR" ]; then
        rm -rf "$BITKEY_REPO_DIR"
    fi
    
    # Remove Docker resources
    if [ ! -z "$container_id" ]; then
        docker rm $container_id 2>/dev/null || true
    fi
    docker rmi bitkey-android-verification-builder 2>/dev/null || true
    
    # Remove temporary build files but keep the final AAB and APKs
    rm -f "$workDir"/bundletool.jar 2>/dev/null || true
    rm -f "$workDir"/built-apks.apks 2>/dev/null || true
    
    exit $exit_code
}

# Set up cleanup trap
trap cleanup EXIT

# Use default Android flavor
ANDROID_FLAVOR="customer"
echo "Using default ANDROID_FLAVOR: $ANDROID_FLAVOR"

# Clone Bitkey repository for the specific version
BITKEY_REPO_DIR="$workDir/bitkey-src"
git clone https://github.com/proto-at-block/bitkey.git "$BITKEY_REPO_DIR"
cd "$BITKEY_REPO_DIR"
git checkout "app/$versionName" || exit 1
git submodule update --init --recursive

# Build using Bitkey's Dockerfile
docker build -f "$BITKEY_REPO_DIR/app/verifiable-build/android/Dockerfile" \
    -t bitkey-android-verification-builder \
    --target build \
    --build-arg REPRODUCIBLE_BUILD_VARIABLES='{"ANDROID_FLAVOR":"customer"}' \
    "$BITKEY_REPO_DIR" || exit 1

# Create container to extract AAB
container_id=$(docker create -e ANDROID_FLAVOR="$ANDROID_FLAVOR" -t bitkey-android-verification-builder /bin/bash)
docker start $container_id

# Debug the container filesystem
debug_container_fs $container_id

# Try to build
echo "Attempting to build AAB..."
docker exec $container_id /bin/bash -c 'cd /build && source bin/activate-hermit && cd app && ANDROID_FLAVOR="$ANDROID_FLAVOR" gradle :android:app:bundle$ANDROID_FLAVOR --no-daemon --no-build-cache --no-configuration-cache'

# Copy the AAB from the container
docker cp "$container_id:/build/app/android/app/build/outputs/bundle/release/app-release.aab" "$workDir/built.aab"

# Convert AAB to APKs using bundletool
echo "Converting AAB to APKs..."
cd "$workDir"

# Download bundletool if needed
if [ ! -f "bundletool.jar" ]; then
    curl -L -o bundletool.jar https://github.com/google/bundletool/releases/download/1.15.6/bundletool-all-1.15.6.jar
fi

# Convert AAB to APKs
java -jar bundletool.jar build-apks \
    --bundle=built.aab \
    --output=built-apks.apks \
    --mode=universal

# Extract the APKs
unzip -o built-apks.apks -d built-split_apks

# Verify copy and rename files
echo "Verifying copy and renaming files..."
cd "$workDir/built-split_apks"
mkdir -p splits
for f in *.apk; do
    # Extract the configuration part from the filename
    config_name="splits/$f"
    # Move the file to the splits directory
    mv "$f" "$config_name" 2>/dev/null || true
done

echo "Build process completed."