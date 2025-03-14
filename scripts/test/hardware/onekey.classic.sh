#!/bin/bash
# onekey.classic.sh
# $ ./onekey.sh <type> <version> <short hash> <short release date>
# Example: ./scripts/test/hardware/onekey.sh classic 3.9.0 f3b0717 0805
# You might need to change permissions on the output folder: chmod a+rwx "${PWD}/output"

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
BUILD_DIR=$(mktemp -d)
chmod 777 "${BUILD_DIR}"
chmod 777 "${PWD}/output"
chown "$(id -u):$(id -g)" "${PWD}/output"

# Run the Docker container and execute the build inside it
echo "Running Docker container..."

docker run --rm -it \
    -v "${PWD}/output:/home/nixuser/output:rw" \
    -v "${BUILD_DIR}:/home/nixuser/build:rw" \
    -e HOME="/home/nixuser" \
    -e USER="nixuser" \
    -e NIX_PATH="/home/nixuser/.nix-defexpr/channels" \
    -e NIX_SSL_CERT_FILE="/etc/ssl/certs/ca-certificates.crt" \
    -w "/home/nixuser/build" \
    -e TYPE="$type" \
    -e VERSION="$version" \
    -e SHORT_HASH="$short_hash" \
    -e SHORT_RELEASE_DATE="$short_release_date" \
    --name $CONTAINER_NAME \
    $IMAGE_NAME \
    bash -c '
    set -e
    
    # Set up Nix environment
    export USER=nixuser
    export HOME=/home/nixuser
    source $HOME/.nix-profile/etc/profile.d/nix.sh
    
    # Ensure required directories exist
    mkdir -p $HOME/.cache
    mkdir -p $HOME/.local/share
    mkdir -p $HOME/.nix-defexpr

    cd /home/nixuser/build

    # Clone the repository
    git clone https://github.com/OneKeyHQ/firmware.git
    cd firmware

    # Set environment variables for the build
    export FIRMWARE_VERSION="${VERSION}"
    export BUILD_DATE="${SHORT_RELEASE_DATE}"
    export SHORT_HASH="${SHORT_HASH}"
    export PRODUCTION=1

    # Use the bixin_dev branch for Classic device type
    if [[ "${TYPE}" == "classic" ]]; then
        echo "Checking out bixin_dev branch for Classic device"
        git checkout bixin_dev
    else
        echo "Checking out branch/tag: ${TYPE}/v${VERSION}"
        git checkout "${TYPE}/v${VERSION}"
    fi

    # Update submodules
    git submodule update --init --recursive

    # Modify shell.nix if necessary
    sed -i "s|./pyright|./ci/pyright|" shell.nix

    # Enter Nix shell and install Python dependencies
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

    # Change directory to output for firmware comparisons
    cd /home/nixuser/output/

    # Download GitHub releases firmware for comparison
    wget -O downloaded-firmware.bin "https://github.com/OneKeyHQ/firmware/releases/download/${TYPE}%2Fv${VERSION}/${TYPE}.${VERSION}-Stable-${SHORT_RELEASE_DATE}-${SHORT_HASH}.signed.bin"

    # Calculate firmware hashes
    BUILT_FILE=$(ls /home/nixuser/output/${TYPE}*Stable*.bin | head -n1)
    BUILT_HASH=$(tail -c +1024 "$BUILT_FILE" | shasum -a 256 | awk "{print \$1}")
    BUILT_FULL_HASH=$(sha256sum "$BUILT_FILE" | awk "{print \$1}")
    GH_INC_HASH=$(sha256sum downloaded-firmware.bin | awk "{print \$1}")
    GH_EXC_HASH=$(tail -c +1024 downloaded-firmware.bin | shasum -a 256 | awk "{print \$1}")

    # Download OneKey CDN firmware using config.json
    CDN_URL=$(curl -s https://data.onekey.so/config.json | jq -r ".classic[\"firmware-v5\"][] | select(.version == [3,9,0]) | .url")
    wget -O cdn-firmware.bin "$CDN_URL"
    CDN_INC_HASH=$(sha256sum cdn-firmware.bin | awk "{print \$1}")
    CDN_EXC_HASH=$(tail -c +1024 cdn-firmware.bin | shasum -a 256 | awk "{print \$1}")

    # Display the results with the new formatting
    echo -e "\e[96m===== Begin Results ====="
    echo "${BUILT_HASH} - built firmware hash (excluding header)"
    echo "${BUILT_FULL_HASH} - built firmware hash (full, including header)"
    echo "${GH_INC_HASH} - downloaded firmware hash (including header) (from: github releases)"
    echo "${GH_EXC_HASH} - downloaded firmware hash (excluding header) (from: github releases)"
    echo "${CDN_INC_HASH} - downloaded firmware hash (including header) (from: OneKey CDN)"
    echo "${CDN_EXC_HASH} - downloaded firmware hash (excluding header) (from: OneKey CDN)"
    echo -e "===== End Results =====\e[0m"
    '

echo "Build completed. Check the 'output' directory for results."
trap 'sudo chmod -R 777 "${BUILD_DIR}" 2>/dev/null && sudo rm -rf "${BUILD_DIR}"' EXIT