#!/bin/bash
# Extremely basic OneKey verification script
# Usage: ./onekey-basic.sh

set -e

# Create temp directory
TEMP_DIR="/tmp/onekey-basic"
rm -rf "${TEMP_DIR}"
mkdir -p "${TEMP_DIR}"
cd "${TEMP_DIR}"

# Clone and build
echo "Building firmware..."
git clone --depth 1 https://github.com/OneKeyHQ/firmware-pro.git
cd firmware-pro
git submodule update --init --recursive

# Build the firmware
chmod +x build-docker.sh
./build-docker.sh -f touch || true

# Find built firmware
BUILT_FIRMWARE=$(find . -name "firmware.bin" | grep "touch/firmware" | head -1)
if [ -z "${BUILT_FIRMWARE}" ]; then
  echo "Error: Could not find built firmware"
  exit 1
fi

# Download official firmware 
echo "Downloading firmware..."
wget -O downloaded.bin "https://github.com/OneKeyHQ/firmware-pro/releases/download/v4.12.0/pro.4.12.0-Stable-0225-5379167_thd89_app_PROD_20250221_1.1.5_dfc6ccf_0x10.signed.bin"

# Calculate checksums
echo "Calculating checksums..."
echo "RESULTS=========================================="
echo "Built firmware hash:"
sha256sum "${BUILT_FIRMWARE}"
echo "Downloaded firmware hash:"
sha256sum downloaded.bin
echo "================================================="