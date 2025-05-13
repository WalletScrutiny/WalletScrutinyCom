#!/bin/bash -e
# BitBox02 Firmware Build and Validation Script
# Can be run as: ./scripts/test/hardware/bitBox2.sh 9.22.0

# Check if running in wrapper mode (just version number provided)
if [ $# -eq 1 ] && [[ $1 =~ ^[0-9]+\.[0-9]+\.[0-9]+$ ]]; then
    # Running in wrapper mode, reconfigure parameters
    VERSION_NUMBER=$1
    VERSION="firmware-btc-only/v${VERSION_NUMBER}"
    MAKE_COMMAND="make firmware-btc"
else
    # Running in direct mode (full parameters provided)
    if [ $# -ne 2 ]; then
        echo "Usage:"
        echo "  $0 <version_number>                    # For BTC-only version"
        echo "  $0 <version> <make_command>            # For direct version/command specification"
        echo "Examples:"
        echo "  $0 9.22.0                              # Build and validate BTC-only v9.22.0"
        echo "  $0 firmware-btc-only/v9.22.0 'make firmware-btc'  # Same as above"
        echo "  $0 firmware/v9.22.0 'make firmware'    # Build and validate full firmware v9.22.0"
        exit 1
    fi
    VERSION=$1
    MAKE_COMMAND=$2
    # Extract version number from full version string
    VERSION_NUMBER=$(echo "$VERSION" | grep -o '[0-9]\+\.[0-9]\+\.[0-9]\+')
fi

echo "Version: $VERSION"
echo "Version number: $VERSION_NUMBER"
echo "Make command: $MAKE_COMMAND"

# Detect system architecture
ARCH=$(uname -m)
echo "System Architecture: $ARCH"

# Extract firmware type (btc-only or full)
if [[ "$VERSION" == *"btc-only"* ]]; then
    FIRMWARE_TYPE="btc"
    FIRMWARE_RELEASE_PATH="firmware-btc-only"
else
    FIRMWARE_TYPE=""
    FIRMWARE_RELEASE_PATH="firmware"
fi

# delete previous clone
rm -rf temp

# Verbose clone
echo "Cloning repository for version: $VERSION"
git clone --depth 1 --branch "$VERSION" --recurse-submodules https://github.com/BitBoxSwiss/bitbox02-firmware temp
cd temp

# Fetch tags
git fetch --tags

# Patch for specific versions if needed
if [[ "$VERSION" == "firmware-btc-only/v9.15.0" || "$VERSION" == "firmware/v9.15.0" ]]; then
  sed -i 's/RUN CARGO_HOME=\/opt\/cargo cargo install bindgen-cli --version 0.65.1/RUN CARGO_HOME=\/opt\/cargo cargo install bindgen-cli --version 0.65.1 --locked/' Dockerfile
fi

# Debug: show Dockerfile content around Go download
echo "Dockerfile Go download section:"
sed -n '/go1.19.3.linux-/p' Dockerfile

# Modify Dockerfile to use explicit architecture
case "$ARCH" in
    x86_64)
        sed -i 's|go1.19.3.linux-${TARGETARCH}|go1.19.3.linux-amd64|g' Dockerfile
        ;;
    aarch64|arm64)
        sed -i 's|go1.19.3.linux-${TARGETARCH}|go1.19.3.linux-arm64|g' Dockerfile
        ;;
    *)
        echo "Unsupported architecture: $ARCH"
        exit 1
        ;;
esac

# Build the Docker image
echo "Building Docker image for firmware version: $VERSION"
docker build --pull --platform linux/amd64 --force-rm --no-cache -t bitbox02-firmware .

# Revert local Dockerfile patch
git checkout -- Dockerfile

# Run firmware build command inside Docker
echo "Running firmware build command: $MAKE_COMMAND"
docker run -it --rm --volume "$(pwd)":/bb02 bitbox02-firmware bash -c "git config --global --add safe.directory /bb02 && cd /bb02 && $MAKE_COMMAND"

# Download the official signed firmware
echo "Downloading official signed firmware..."
if [[ "$FIRMWARE_TYPE" == "btc" ]]; then
    DOWNLOAD_URL="https://github.com/BitBoxSwiss/bitbox02-firmware/releases/download/${FIRMWARE_RELEASE_PATH}%2Fv${VERSION_NUMBER}/firmware-btc.v${VERSION_NUMBER}.signed.bin"
    SIGNED_FILENAME="firmware-btc.v${VERSION_NUMBER}.signed.bin"
    BUILT_FIRMWARE_PATH="build/bin/firmware-btc.bin"
    FIRMWARE_PREFIX="firmware-btc"
else
    DOWNLOAD_URL="https://github.com/BitBoxSwiss/bitbox02-firmware/releases/download/${FIRMWARE_RELEASE_PATH}%2Fv${VERSION_NUMBER}/firmware.v${VERSION_NUMBER}.signed.bin"
    SIGNED_FILENAME="firmware.v${VERSION_NUMBER}.signed.bin"
    BUILT_FIRMWARE_PATH="build/bin/firmware.bin"
    FIRMWARE_PREFIX="firmware"
fi

echo "Downloading from: $DOWNLOAD_URL"
wget -O "$SIGNED_FILENAME" "$DOWNLOAD_URL"

# Calculate hash of signed download
signedHash=$(sha256sum "$SIGNED_FILENAME")
echo "Hash of signed download: $signedHash"

# Calculate hash of built binary
builtHash=$(sha256sum "$BUILT_FIRMWARE_PATH")
echo "Hash of built binary: $builtHash"

# Unpack signed binary
echo "Unpacking signed binary..."
head -c 588 "$SIGNED_FILENAME" > p_head.bin
tail -c +589 "$SIGNED_FILENAME" > p_${FIRMWARE_PREFIX}.bin
downloadStrippedSigHash=$(sha256sum p_${FIRMWARE_PREFIX}.bin)

# Extract version and calculate device firmware hash
cat p_head.bin | tail -c +$(( 8 + 6 * 64 + 1 )) | head -c 4 > p_version.bin
firmwareBytesCount=$(wc -c p_${FIRMWARE_PREFIX}.bin | sed 's/ .*//g')
maxFirmwareSize=884736
paddingBytesCount=$(( maxFirmwareSize - firmwareBytesCount ))
dd if=/dev/zero ibs=1 count=$paddingBytesCount 2>/dev/null | tr "\000" "\377" > p_padding.bin
downloadFirmwareHash=$( cat p_version.bin p_${FIRMWARE_PREFIX}.bin p_padding.bin | sha256sum | cut -c1-64 | xxd -r -p | sha256sum | cut -c1-64 )

echo "============================================================"
echo "Firmware Validation Results:"
echo "============================================================"
echo "Signed download:             $signedHash"
echo "Signed download minus sig:   $downloadStrippedSigHash"
echo "Built binary:                $builtHash"
echo "Firmware as shown in device: $downloadFirmwareHash"
echo "                            (The latter is a double sha256 over version,"
echo "                             firmware and padding)"
echo "============================================================"

# Print firmware binary locations
echo "Local firmware binary created at:"
echo "$(pwd)/$BUILT_FIRMWARE_PATH"

cd ..

echo "Validation complete."