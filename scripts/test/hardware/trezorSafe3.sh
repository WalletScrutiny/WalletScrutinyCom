#!/bin/bash
set -x

# Redirect all output to a log file
exec &> >(tee -a "trezorSafe3-build-log.txt") 2>&1

# Define bright/bold colors for messages
RED='\033[1;31m'
CYAN='\033[1;36m'
NC='\033[0m' # No Color

### Provide this script with the version without "v" as a parameter
version=$1

# Check if version is provided
if [[ -z "$version" ]]; then
  echo -e "${RED}-----------------------------------------------------------------"
  echo -e "Error: Version is a required argument."
  echo -e "-----------------------------------------------------------------${NC}"
  exit 1
fi

# Set up temporary workspace
cd /tmp
rm -rf trezor-firmware

# Clone the Trezor firmware repository
if ! git clone https://github.com/trezor/trezor-firmware.git; then
  echo -e "${RED}-----------------------------------------------------------------"
  echo -e "Error: Failed to clone the Trezor firmware repository."
  echo -e "-----------------------------------------------------------------${NC}"
  exit 1
fi

cd trezor-firmware

# Ensure all submodules are initialized
git submodule update --init --recursive

# Download the firmware binaries
if ! wget https://data.trezor.io/firmware/t2b1/trezor-t2b1-${version}.bin; then
  echo -e "${RED}-----------------------------------------------------------------"
  echo -e "Error: Failed to download trezor-t2b1-${version}.bin."
  echo -e "-----------------------------------------------------------------${NC}"
  exit 1
fi

if ! wget https://data.trezor.io/firmware/t2b1/trezor-t2b1-${version}-bitcoinonly.bin; then
  echo -e "${RED}-----------------------------------------------------------------"
  echo -e "Error: Failed to download trezor-t2b1-${version}-bitcoinonly.bin."
  echo -e "-----------------------------------------------------------------${NC}"
  exit 1
fi

sha256sum *.bin

# Checkout the specific version for building
if ! git checkout core/v${version}; then
  echo -e "${RED}-----------------------------------------------------------------"
  echo -e "Error: Failed to checkout the specified firmware version (core/v${version})."
  echo -e "-----------------------------------------------------------------${NC}"
  exit 1
fi

# Build the firmware using Docker
if ! bash -c "./build-docker.sh --models R core/v${version} --no-cache --verbose > docker_build.log 2>&1"; then
  echo -e "${RED}-----------------------------------------------------------------"
  echo -e "Error: Failed to build the firmware with Docker."
  echo -e "-----------------------------------------------------------------${NC}"
  exit 1
fi

# Remove signatures from downloaded binaries
cp trezor-t2b1-${version}.bin trezor-t2b1-${version}.bin.zeroed
cp trezor-t2b1-${version}-bitcoinonly.bin trezor-t2b1-${version}-bitcoinonly.bin.zeroed
vendorHeaderSize=4608
seekSize=$(( 5567 - $vendorHeaderSize + 512 ))
dd if=/dev/zero of=trezor-t2b1-${version}.bin.zeroed bs=1 seek=$seekSize count=65 conv=notrunc
dd if=/dev/zero of=trezor-t2b1-${version}-bitcoinonly.bin.zeroed bs=1 seek=$seekSize count=65 conv=notrunc

# Compare hashes to verify reproducibility
hash_standard=$(sha256sum trezor-t2b1-${version}.bin.zeroed build/core-R/firmware/firmware.bin | awk '{print $1}' | sort | uniq)
hash_bitcoinonly=$(sha256sum trezor-t2b1-${version}-bitcoinonly.bin.zeroed build/core-R-bitcoinonly/firmware/firmware.bin | awk '{print $1}' | sort | uniq)

if [[ "$hash_standard" == 1 && "$hash_bitcoinonly" == 1 ]]; then
  echo -e "${CYAN}-----------------------------------------------------------------"
  echo -e "Version ${version} is reproducible"
  echo -e "-----------------------------------------------------------------${NC}"
else
  echo -e "${RED}-----------------------------------------------------------------"
  echo -e "Version ${version} is NOT reproducible"
  echo -e "-----------------------------------------------------------------${NC}"
fi
