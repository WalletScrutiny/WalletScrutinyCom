#!/bin/bash
# onekeymini.sh
# $ ./onekeymini.sh <version> <short hash> <short release date>
# Example: ./scripts/test/hardware/onekeymini.sh 3.9.0 a8b4519 0321
# Could need to change permissions on output folder: chmod a+rwx "${PWD}/output"

# Ensure the script exits if any command fails
set -e

# Get the directory of the script
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"

# Check if the correct number of arguments is provided
if [ "$#" -ne 3 ]; then
    echo "Usage: $0 <version> <short_hash> <short_release_date>"
    echo "Example: $0 3.9.0 a8b4519 0321"
    exit 1
fi

# Assign input arguments to variables
version=$1
short_hash=$2
short_release_date=$3

# Define the Docker image and container names
IMAGE_NAME="onekey-mini-firmware"
CONTAINER_NAME="onekey-mini-firmware-container"

# Build the Docker image using the Dockerfile
echo "Building Docker image..."
docker build -t $IMAGE_NAME -f "$SCRIPT_DIR/onekey.dockerfile" "$SCRIPT_DIR"

# Ensure the output directory exists and has appropriate permissions
mkdir -p "${PWD}/output"
chmod a+rwx "${PWD}/output"

# Run the Docker container and execute the build inside it
echo "Running Docker container..."

docker run --rm -it \
    -v "${PWD}/output:/home/nixuser/output" \
    -e VERSION="$version" \
    -e SHORT_HASH="$short_hash" \
    -e SHORT_RELEASE_DATE="$short_release_date" \
    --name $CONTAINER_NAME \
    $IMAGE_NAME \
    bash -c '
    set -e
    source /home/nixuser/.nix-profile/etc/profile.d/nix.sh
    cd /home/nixuser

    # Clone the repository
    git clone https://github.com/OneKeyHQ/firmware.git
    if [ $? -ne 0 ]; then
        echo "ERROR: Failed to clone the repository."
        exit 1
    fi
    cd firmware

    # Set environment variables for the build
    export FIRMWARE_VERSION="${VERSION}"
    export BUILD_DATE="${SHORT_RELEASE_DATE}"
    export SHORT_HASH="${SHORT_HASH}"
    export PRODUCTION=1

    # Check out the mini branch for OneKey Mini
    echo "Checking out mini branch for OneKey Mini"
    git checkout mini

    # Update submodules
    git submodule update --init --recursive

    # Modify shell.nix if necessary
    sed -i "s|./pyright|./ci/pyright|" shell.nix

    # Enter Nix shell and run all commands in one go
    nix-shell --run "
        export ONEKEY_MINI=1 && poetry install
        export ONEKEY_MINI=1 && poetry run ./legacy/script/setup
        export ONEKEY_MINI=1 && poetry run ./legacy/script/cibuild
        cp ./legacy/firmware/mini*Stable*.bin /home/nixuser/output/
    "

    # Download the official firmware for comparison
    mkdir -p /home/nixuser/output/
    cd /home/nixuser/output/

    # Try multiple possible URL patterns
    echo "Attempting to download the official firmware..."

    # Try the known correct URL first (for mini v3.9.0 specifically)
    if [[ "${VERSION}" == "3.9.0" && "${SHORT_HASH}" == "a8b4519" ]]; then
        echo "Using known URL for mini v3.9.0"
        wget -O downloaded-firmware.bin "https://github.com/OneKeyHQ/firmware/releases/download/mini%2Fv${VERSION}/mini.${VERSION}-Stable-0807-${SHORT_HASH}.signed.bin"
    # Pattern 1: Standard pattern with signed.bin extension
    elif wget -q --spider "https://github.com/OneKeyHQ/firmware/releases/download/mini%2Fv${VERSION}/mini.${VERSION}-Stable-${SHORT_RELEASE_DATE}-${SHORT_HASH}.signed.bin"; then
        echo "Found firmware with standard naming pattern"
        wget -O downloaded-firmware.bin "https://github.com/OneKeyHQ/firmware/releases/download/mini%2Fv${VERSION}/mini.${VERSION}-Stable-${SHORT_RELEASE_DATE}-${SHORT_HASH}.signed.bin"
    # Pattern 2: Without signed extension
    elif wget -q --spider "https://github.com/OneKeyHQ/firmware/releases/download/mini%2Fv${VERSION}/mini.${VERSION}-Stable-${SHORT_RELEASE_DATE}-${SHORT_HASH}.bin"; then
        echo "Found firmware without signed in filename"
        wget -O downloaded-firmware.bin "https://github.com/OneKeyHQ/firmware/releases/download/mini%2Fv${VERSION}/mini.${VERSION}-Stable-${SHORT_RELEASE_DATE}-${SHORT_HASH}.bin"
    # Pattern 3: Try with just .bin extension
    elif wget -q --spider "https://github.com/OneKeyHQ/firmware/releases/download/mini%2Fv${VERSION}/mini-${VERSION}-${SHORT_HASH}.bin"; then
        echo "Found firmware with simplified naming pattern"
        wget -O downloaded-firmware.bin "https://github.com/OneKeyHQ/firmware/releases/download/mini%2Fv${VERSION}/mini-${VERSION}-${SHORT_HASH}.bin"
    # Pattern 4: Try with assets directory
    elif wget -q --spider "https://github.com/OneKeyHQ/firmware/releases/download/mini%2Fv${VERSION}/assets/mini.${VERSION}-Stable-${SHORT_RELEASE_DATE}-${SHORT_HASH}.bin"; then
        echo "Found firmware in assets directory"
        wget -O downloaded-firmware.bin "https://github.com/OneKeyHQ/firmware/releases/download/mini%2Fv${VERSION}/assets/mini.${VERSION}-Stable-${SHORT_RELEASE_DATE}-${SHORT_HASH}.bin"
    else
        echo "ERROR: Could not find firmware file. Please check the release page manually at:"
        echo "https://github.com/OneKeyHQ/firmware/releases/tag/mini%2Fv${VERSION}"
        echo "Creating an empty file for comparison..."
        touch downloaded-firmware.bin
    fi

    # Get the exact filename of the built firmware
    BUILT_FIRMWARE=$(ls /home/nixuser/firmware/legacy/firmware/mini.${VERSION}-Stable-*-${SHORT_HASH}.bin)
    BUILT_FIRMWARE_BASENAME=$(basename "$BUILT_FIRMWARE")
    
    # Copy the built firmware to the output directory
    cp "$BUILT_FIRMWARE" /home/nixuser/output/
    
    # Calculate checksums for comparison
    echo "Calculating checksums..."
    echo "RESULTS==========================================" 
    echo "Built firmware hash:"
    sha256sum "$BUILT_FIRMWARE"
    echo "Downloaded firmware hash:"
    sha256sum /home/nixuser/output/downloaded-firmware.bin
    echo "================================================="
    
    # Calculate checksums for the firmware content (excluding signature)
    # According to OneKey documentation, the first 1024 bytes contain the signature
    echo "Calculating checksums excluding signature (first 1024 bytes)..."
    echo "Built firmware content hash (excluding signature):"
    tail -c +1024 "$BUILT_FIRMWARE" | sha256sum
    echo "Downloaded firmware content hash (excluding signature):"
    tail -c +1024 /home/nixuser/output/downloaded-firmware.bin | sha256sum
    echo "================================================="
    
    # Find the first byte difference
    echo "Locating first byte difference..."
    cmp -l "$BUILT_FIRMWARE" /home/nixuser/output/downloaded-firmware.bin | head -n 1
    echo "================================================="
    
    # Count total number of differing bytes
    echo "Counting total differing bytes..."
    DIFF_COUNT=$(cmp -l "$BUILT_FIRMWARE" /home/nixuser/output/downloaded-firmware.bin | wc -l)
    echo "Total bytes that differ: $DIFF_COUNT out of $(stat -c%s "$BUILT_FIRMWARE") bytes"
    echo "Percentage of differing bytes: $(echo "scale=6; $DIFF_COUNT*100/$(stat -c%s "$BUILT_FIRMWARE")" | bc)%"
    echo "================================================="
    
    # Run hexdump on the first 2048 bytes of both files for comparison
    echo "Hexdump of first 2048 bytes of built firmware:"
    hexdump -C -n 2048 "$BUILT_FIRMWARE"
    echo "================================================="
    echo "Hexdump of first 2048 bytes of downloaded firmware:"
    hexdump -C -n 2048 /home/nixuser/output/downloaded-firmware.bin
    echo "================================================="
    
    # Run vbindiff on the copied firmware and downloaded firmware
    echo "Running binary diff comparison with vbindiff..."
    echo "Note: Use arrow keys to navigate, F to find, N for next difference, ESC to quit"
    vbindiff "/home/nixuser/output/$BUILT_FIRMWARE_BASENAME" /home/nixuser/output/downloaded-firmware.bin

    echo "Build completed. Check the output directory for results."
    '

echo "Build completed. Check the 'output' directory for results."
