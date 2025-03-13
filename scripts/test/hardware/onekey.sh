#!/bin/bash
# onekey.sh alpha.2
# $ ./onekey.sh <type> <version> <short hash> <short release date>
# ./scripts/test/hardware/onekey.sh classic 3.9.0 f3b0717 0805
# Could need to change permissions on output folder: chmod a+rwx "${PWD}/output"
# Currently works for onekeymini v3.9.0

# Ensure the script exits if any command fails
set -e

# Get the directory of the script
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"

# Check if the correct number of arguments is provided
if [ "$#" -ne 4 ]; then
    echo "Usage: $0 <type> <version> <short_hash> <short_release_date>"
    exit 1
fi

# Assign input arguments to variables
type=$1
version=$2
short_hash=$3
short_release_date=$4

# Define the Docker image and container names
IMAGE_NAME="onekey-firmware"
CONTAINER_NAME="onekey-firmware-container"

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
    -e TYPE="$type" \
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

    # Check out the desired version
    echo "Checking out branch/tag: ${TYPE}/v${VERSION}"
    git checkout "${TYPE}/v${VERSION}"

    # Update submodules
    git submodule update --init --recursive

    # Modify shell.nix if necessary
    sed -i "s|./pyright|./ci/pyright|" shell.nix

    # Enter Nix shell and run all commands in one go
    nix-shell --run "
        export ONEKEY_MINI=1
        poetry install
        if [[ "${TYPE}" == \"mini\" ]]; then
            export ONEKEY_MINI=1 && poetry run ./legacy/script/setup
            export ONEKEY_MINI=1 && poetry run ./legacy/script/cibuild
            cp ./legacy/firmware/${TYPE}*Stable*.bin /home/nixuser/output/
        elif [[ \"${TYPE}\" == \"classic\" ]]; then
            poetry run ./legacy/script/setup
            poetry run ./legacy/script/cibuild
            cp ./legacy/firmware/${TYPE}*Stable*.bin /home/nixuser/output/
        elif [[ \"${TYPE}\" == \"touch\" ]]; then
            poetry run make -C core build_boardloader
            poetry run make -C core build_bootloader
            poetry run make -C core build_firmware
            poetry run core/tools/headertool.py -h core/build/firmware/touch*Stable*.bin
            cp ./core/build/firmware/${TYPE}*Stable*.bin /home/nixuser/output/
        else
            echo \"Invalid device type: ${TYPE}\"
            exit 1
        fi
    "

    # Download the official firmware for comparison
    mkdir -p /home/nixuser/output/
    cd /home/nixuser/output/

    # Try multiple possible URL patterns
    echo "Attempting to download the official firmware..."

    # Try the known correct URL first (for mini v3.9.0 specifically)
    if [[ "${TYPE}" == "mini" && "${VERSION}" == "3.9.0" && "${SHORT_HASH}" == "a8b4519" ]]; then
        echo "Using known URL for mini v3.9.0"
        wget -O downloaded-firmware.bin "https://github.com/OneKeyHQ/firmware/releases/download/${TYPE}%2Fv${VERSION}/${TYPE}.${VERSION}-Stable-0807-${SHORT_HASH}.signed.bin"
    # Pattern 1: Standard pattern with signed.bin extension
    elif wget -q --spider "https://github.com/OneKeyHQ/firmware/releases/download/${TYPE}%2Fv${VERSION}/${TYPE}.${VERSION}-Stable-${SHORT_RELEASE_DATE}-${SHORT_HASH}.signed.bin"; then
        echo "Found firmware with standard naming pattern"
        wget -O downloaded-firmware.bin "https://github.com/OneKeyHQ/firmware/releases/download/${TYPE}%2Fv${VERSION}/${TYPE}.${VERSION}-Stable-${SHORT_RELEASE_DATE}-${SHORT_HASH}.signed.bin"
    # Pattern 2: Without signed extension
    elif wget -q --spider "https://github.com/OneKeyHQ/firmware/releases/download/${TYPE}%2Fv${VERSION}/${TYPE}.${VERSION}-Stable-${SHORT_RELEASE_DATE}-${SHORT_HASH}.bin"; then
        echo "Found firmware without 'signed' in filename"
        wget -O downloaded-firmware.bin "https://github.com/OneKeyHQ/firmware/releases/download/${TYPE}%2Fv${VERSION}/${TYPE}.${VERSION}-Stable-${SHORT_RELEASE_DATE}-${SHORT_HASH}.bin"
    # Pattern 3: Try with just .bin extension
    elif wget -q --spider "https://github.com/OneKeyHQ/firmware/releases/download/${TYPE}%2Fv${VERSION}/${TYPE}-${VERSION}-${SHORT_HASH}.bin"; then
        echo "Found firmware with simplified naming pattern"
        wget -O downloaded-firmware.bin "https://github.com/OneKeyHQ/firmware/releases/download/${TYPE}%2Fv${VERSION}/${TYPE}-${VERSION}-${SHORT_HASH}.bin"
    # Pattern 4: Try with assets directory
    elif wget -q --spider "https://github.com/OneKeyHQ/firmware/releases/download/${TYPE}%2Fv${VERSION}/assets/${TYPE}.${VERSION}-Stable-${SHORT_RELEASE_DATE}-${SHORT_HASH}.bin"; then
        echo "Found firmware in assets directory"
        wget -O downloaded-firmware.bin "https://github.com/OneKeyHQ/firmware/releases/download/${TYPE}%2Fv${VERSION}/assets/${TYPE}.${VERSION}-Stable-${SHORT_RELEASE_DATE}-${SHORT_HASH}.bin"
    else
        echo "ERROR: Could not find firmware file. Please check the release page manually at:"
        echo "https://github.com/OneKeyHQ/firmware/releases/tag/${TYPE}%2Fv${VERSION}"
        echo "Creating an empty file for comparison..."
        touch downloaded-firmware.bin
    fi

    # Run vbindiff
    echo "Running vbindiff..."
    # Get the exact filename of the built firmware
    BUILT_FIRMWARE=$(ls /home/nixuser/firmware/legacy/firmware/${TYPE}.${VERSION}-Stable-*-${SHORT_HASH}.bin)
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
    
    # Run vbindiff on the copied firmware and downloaded firmware
    echo "Running binary diff comparison..."
    vbindiff "/home/nixuser/output/$BUILT_FIRMWARE_BASENAME" /home/nixuser/output/downloaded-firmware.bin

    echo "Build completed. Check the 'output' directory for results."
    '

echo "Build completed. Check the 'output' directory for results."
