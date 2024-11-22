#!/bin/bash
# com.foundationdevices.envoy.sh v0.1.0-alpha.4
# App-specific script for building Envoy using walletscrutiny/flutter-rust-android:6
# Modify deviceSpec variable if using a different phone

# Ensure the script is sourced from testAAB.sh
if [ -z "$workDir" ]; then
  echo "Error: workDir is not set. Please run this script via testAAB.sh."
  exit 1
fi

# Global variables
sourceDir="/tmp/envoy_source"
outputDir="$workDir/built-split_apks"
bundletoolImage="com.foundationdevices.envoy:latest"
deviceSpec="/var/shared/device-spec/nfc/device-spec.json"

echo "Using source directory: $sourceDir"
echo "Using output directory: $outputDir"

# Clone the repository if not already cloned
if [ ! -d "$sourceDir/.git" ]; then
  echo "Cloning Envoy repository..."
  rm -rf "$sourceDir"  # Clean up any invalid directory
  git clone --depth 1 https://github.com/Foundation-Devices/envoy.git "$sourceDir" || {
    echo "Failed to clone repository."
    exit 1
  }
else
  echo "Envoy repository already cloned. Pulling latest changes..."
  cd "$sourceDir" && git pull origin main || {
    echo "Failed to pull latest changes."
    exit 1
  }
fi

# Change to the cloned repository directory
cd "$sourceDir" || { echo "Failed to change to $sourceDir"; exit 1; }

# Install `just` (Rust task runner)
if ! command -v just &> /dev/null; then
  echo "Installing just..."
  cargo install just || {
    echo "Failed to install just. Please ensure Rust is installed."
    exit 1
  }
else
  echo "just is already installed."
fi

# Run `just docker-build-android` and debug
echo "Running just docker-build-android..."
just docker-build-android || {
  echo "just docker-build-android failed. Debugging required."
  exit 1
}

# Build the Docker image for bundletool
docker build -t com.foundationdevices.envoy \
    -f /home/danny/work/walletScrutinyCom/scripts/test/android/com.foundationdevices.envoy.dockerfile \
    /home/danny/work/walletScrutinyCom/scripts/test/android

# Run the bundletool container to generate split APKs
mkdir -p "$outputDir"
docker run --rm \
    -v "$sourceDir/release/app-release.aab:/workspace/app-release.aab" \
    -v "$deviceSpec:/workspace/device-spec.json" \
    -v "$outputDir:/workspace/output" \
    "$bundletoolImage" \
    java -jar /usr/local/bin/bundletool.jar build-apks \
    --bundle=/workspace/app-release.aab \
    --output=/workspace/output/splits.apks \
    --device-spec=/workspace/device-spec.json \
    --mode=default

# Extract the split APKs
unzip -o "$outputDir/splits.apks" -d "$outputDir"

# Ensure post-processing continues
export builtSplitApksDir="$outputDir"

# Move split APKs from 'splits' to the parent directory
mv $outputDir/splits/*.apk $outputDir/ || echo "No files to move"

# Rename 'base-master.apk' to 'base.apk' if it exists
if [ -f "$outputDir/splits/base-master.apk" ]; then
  mv "$outputDir/splits/base-master.apk" "$outputDir/base.apk"
fi
