#!/bin/bash
# onekey.sh
# $ ./onekey.sh <type> <version> <short hash> <short release date>
# ./scripts/test/hardware/onekey.sh classic 3.9.0 f3b0717 0805
# Could need to change permissions on output folder: chmod a+rwx "${PWD}/output"

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
# chmod a+rwx "${PWD}/output"

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

    # Enter Nix shell
    nix-shell --run "poetry install"

    # Build the firmware based on the device type
    if [[ "${TYPE}" == "mini" ]]; then
        nix-shell --run "export ONEKEY_MINI=1 && poetry run ./legacy/script/setup"
        nix-shell --run "export ONEKEY_MINI=1 && poetry run ./legacy/script/cibuild"
        cp ./legacy/firmware/${TYPE}*Stable*.bin /home/nixuser/output/
    elif [[ "${TYPE}" == "classic" ]]; then
        nix-shell --run "poetry run ./legacy/script/setup"
        nix-shell --run "poetry run ./legacy/script/cibuild"
        cp ./legacy/firmware/${TYPE}*Stable*.bin /home/nixuser/output/
    elif [[ "${TYPE}" == "touch" ]]; then
        nix-shell --run "poetry run make -C core build_boardloader"
        nix-shell --run "poetry run make -C core build_bootloader"
        nix-shell --run "poetry run make -C core build_firmware"
        nix-shell --run "poetry run core/tools/headertool.py -h core/build/firmware/touch*Stable*.bin"
        cp ./core/build/firmware/${TYPE}*Stable*.bin /home/nixuser/output/
    else
        echo "Invalid device type: ${TYPE}"
        exit 1
    fi

    # Download the official firmware for comparison
    mkdir -p /home/nixuser/output/
    cd /home/nixuser/output/

    wget -O downloaded-firmware.bin "https://github.com/OneKeyHQ/firmware/releases/download/${TYPE}%2Fv${VERSION}/${TYPE}.${VERSION}-Stable-${SHORT_RELEASE_DATE}-${SHORT_HASH}.signed.bin"

    # Calculate SHA-256 checksums
    echo "Calculating checksums..."
    sha256sum ./${TYPE}*Stable*.bin > built_firmware.sha256
    sha256sum downloaded-firmware.bin > downloaded_firmware.sha256

    # Display the results
    echo -e "\e[96mRESULTS=========================================="
    echo -e "Built firmware hash:"
    cat built_firmware.sha256
    echo -e "Downloaded firmware hash:"
    cat downloaded_firmware.sha256
    echo -e "=================================================\e[0m"
    '

echo "Build completed. Check the 'output' directory for results."