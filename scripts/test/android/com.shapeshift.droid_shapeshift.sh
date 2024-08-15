#!/bin/bash

# Set script to exit on any error
set -e

# Define directories
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )"
SPLITS_DIR="${SCRIPT_DIR}/fromBuildSplits"
UNZIPPED_DIR="${SCRIPT_DIR}/unzipped-fromBuildSplits"
OFFICIAL_APKS_DIR="/var/shared/apk/com.shapeshift.droid_shapeshift/328-splits/official"
OFFICIAL_NORMALIZED_DIR="/tmp/shapeshift-build/fromOfficial"
BUILD_NORMALIZED_DIR="/tmp/shapeshift-build/fromBuild"

# Ensure required directories exist
mkdir -p "${SPLITS_DIR}"
mkdir -p "${UNZIPPED_DIR}"
mkdir -p "${OFFICIAL_NORMALIZED_DIR}"
mkdir -p "${OFFICIAL_NORMALIZED_DIR}/apks"
mkdir -p "${BUILD_NORMALIZED_DIR}"

# Build Docker image with no cache
echo "Building Docker image..."
docker build --no-cache -t shapeshift-build .

# Check if container already exists and remove it
if [ "$(docker ps -aq -f name=shapeshift-container)" ]; then
    echo "Removing existing container..."
    docker rm -f shapeshift-container
fi

# Run Docker container
echo "Running Docker container..."
docker run -d --name shapeshift-container shapeshift-build tail -f /dev/null

# Copy artifacts from container
echo "Copying artifacts from container..."
docker cp shapeshift-container:/app/android/app/build/outputs/apk/release/splits "${SPLITS_DIR}"

# Stop and remove the container
docker stop shapeshift-container
docker rm shapeshift-container

# Process split APKs from the container
echo "Processing split APKs from the build..."
cd "${SPLITS_DIR}/splits"
for apk in base-*.apk; do
    if [[ -f "$apk" ]]; then
        # Extract name without 'base-' prefix and '.apk' suffix
        name=$(echo "$apk" | sed 's/^base-//; s/\.apk$//')
        
        # Normalize name
        case "$name" in
            "armeabi_v7a") folder="armeabi_v7a" ;;
            "en") folder="en" ;;
            "master") folder="base" ;;
            "xhdpi") folder="xhdpi" ;;
            *) folder="$name" ;;  # For any unexpected APKs
        esac
        
        # Create folder and unzip
        mkdir -p "${BUILD_NORMALIZED_DIR}/${folder}"
        unzip -q "$apk" -d "${BUILD_NORMALIZED_DIR}/${folder}"
        echo "Unzipped $apk to ${folder}/"
    fi
done

# Copy official APKs and normalize their names
echo "Copying and normalizing official APKs..."
cd "${OFFICIAL_APKS_DIR}"
for apk in base.apk split_config.*.apk; do
    if [[ -f "$apk" ]]; then
        # Normalize name
        name=$(echo "$apk" | sed 's/^split_config\.//; s/\.apk$//')
        folder="${name}"
        
        # Create folder and unzip
        mkdir -p "${OFFICIAL_NORMALIZED_DIR}/${folder}"
        unzip -q "$apk" -d "${OFFICIAL_NORMALIZED_DIR}/${folder}"
        echo "Unzipped $apk to ${folder}/"

        # Move APK to 'apks' folder
        mv "$apk" "${OFFICIAL_NORMALIZED_DIR}/apks/${name}.apk"
    fi
done

# Echo a message that diff is now being run
echo -e "\e[96mRunning diff...\e[0m"

# Run diff for like vs like folders
for folder in armeabi_v7a en base xhdpi; do
    if [ -d "${OFFICIAL_NORMALIZED_DIR}/${folder}" ] && [ -d "${BUILD_NORMALIZED_DIR}/${folder}" ]; then
        echo "Comparing ${folder}..."
        diff -r "${OFFICIAL_NORMALIZED_DIR}/${folder}/" "${BUILD_NORMALIZED_DIR}/${folder}/"
    fi
done

echo "Comparison complete!"
