#!/bin/bash
# trezorT.firmware.sh - Analyze Trezor T firmware using headertool.py
# This script compares the built firmware with the downloaded firmware

# Define colors for output
GREEN='\033[1;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if version parameter is provided
if [ -z "$1" ]; then
    echo "Usage: $0 <firmware_version>"
    echo "Example: $0 2.8.9"
    exit 1
fi

version=$1
echo -e "${BLUE}Analyzing Trezor T firmware version $version${NC}"

# Create temporary directory
workdir=$(mktemp -d)
echo -e "${BLUE}Working directory: $workdir${NC}"
cd "$workdir"

# Download the firmware files
echo -e "${BLUE}Downloading firmware files...${NC}"
wget -q "https://data.trezor.io/firmware/t2t1/trezor-t2t1-$version.bin" -O trezor-firmware.bin
wget -q "https://data.trezor.io/firmware/t2t1/trezor-t2t1-$version-bitcoinonly.bin" -O trezor-firmware-bitcoinonly.bin

# Check if download was successful
if [ ! -s trezor-firmware.bin ]; then
    echo -e "${YELLOW}Error: Failed to download firmware. Trying alternative URL...${NC}"
    wget -q "https://data.trezor.io/firmware/t2t1/trezor-core-$version.bin" -O trezor-firmware.bin
    wget -q "https://data.trezor.io/firmware/t2t1/trezor-core-$version-bitcoinonly.bin" -O trezor-firmware-bitcoinonly.bin
fi

if [ ! -s trezor-firmware.bin ]; then
    echo -e "${YELLOW}Error: Failed to download firmware from either location.${NC}"
    exit 1
fi

# Clone the repository for building the firmware
echo -e "${BLUE}Cloning Trezor firmware repository...${NC}"
git clone https://github.com/trezor/trezor-firmware.git
cd trezor-firmware

# Checkout the firmware version tag
echo -e "${BLUE}Checking out firmware tag core/v$version...${NC}"
git checkout core/v$version

# Build the firmware
echo -e "${BLUE}Building firmware version $version...${NC}"
./build-docker.sh --models T2T1 --targets firmware --no-init core/v$version

# Activate virtual environment if it exists
if [ -d ~/trezor-venv ]; then
    echo -e "${BLUE}Activating Trezor virtual environment...${NC}"
    source ~/trezor-venv/bin/activate
fi

# Analyze the downloaded firmware
echo -e "\n${GREEN}Analyzing downloaded firmware:${NC}"
echo -e "${GREEN}========================================${NC}"
echo -e "${YELLOW}Standard firmware:${NC}"
python3 -m core.tools.trezor_core_tools.headertool "$workdir/trezor-firmware.bin"

echo -e "\n${YELLOW}Bitcoin-only firmware:${NC}"
python3 -m core.tools.trezor_core_tools.headertool "$workdir/trezor-firmware-bitcoinonly.bin"

# Analyze the built firmware
echo -e "\n${GREEN}Analyzing built firmware:${NC}"
echo -e "${GREEN}========================================${NC}"
echo -e "${YELLOW}Standard firmware:${NC}"
python3 -m core.tools.trezor_core_tools.headertool build/core-T2T1/firmware/firmware.bin

echo -e "\n${YELLOW}Bitcoin-only firmware:${NC}"
python3 -m core.tools.trezor_core_tools.headertool build/core-T2T1-bitcoinonly/firmware/firmware.bin

# Extract and compare fingerprints
echo -e "\n${GREEN}Comparing firmware fingerprints:${NC}"
echo -e "${GREEN}========================================${NC}"

# Get fingerprints from downloaded firmware
downloaded_fingerprint=$(python3 -m core.tools.trezor_core_tools.headertool "$workdir/trezor-firmware.bin" | grep "Fingerprint:" | head -1 | awk '{print $2}')
downloaded_bitcoinonly_fingerprint=$(python3 -m core.tools.trezor_core_tools.headertool "$workdir/trezor-firmware-bitcoinonly.bin" | grep "Fingerprint:" | head -1 | awk '{print $2}')

# Get fingerprints from built firmware
built_fingerprint=$(python3 -m core.tools.trezor_core_tools.headertool build/core-T2T1/firmware/firmware.bin | grep "Fingerprint:" | head -1 | awk '{print $2}')
built_bitcoinonly_fingerprint=$(python3 -m core.tools.trezor_core_tools.headertool build/core-T2T1-bitcoinonly/firmware/firmware.bin | grep "Fingerprint:" | head -1 | awk '{print $2}')

# Compare standard firmware
echo -e "${YELLOW}Standard firmware comparison:${NC}"
echo -e "${BLUE}File: $workdir/trezor-firmware.bin${NC}"
echo -e "${GREEN}Downloaded: $downloaded_fingerprint${NC}"
echo -e "${BLUE}File: trezor-firmware/build/core-T2T1/firmware/firmware.bin${NC}"
echo -e "${GREEN}Built:      $built_fingerprint${NC}"

if [ "$downloaded_fingerprint" = "$built_fingerprint" ]; then
    echo -e "${GREEN}MATCH: The built standard firmware matches the downloaded firmware!${NC}"
else
    echo -e "${YELLOW}MISMATCH: The built standard firmware does not match the downloaded firmware.${NC}"
    echo -e "${YELLOW}This is expected if the downloaded firmware is signed and the built firmware is unsigned.${NC}"
fi

# Compare Bitcoin-only firmware
echo -e "\n${YELLOW}Bitcoin-only firmware comparison:${NC}"
echo -e "${BLUE}File: $workdir/trezor-firmware-bitcoinonly.bin${NC}"
echo -e "${GREEN}Downloaded: $downloaded_bitcoinonly_fingerprint${NC}"
echo -e "${BLUE}File: trezor-firmware/build/core-T2T1-bitcoinonly/firmware/firmware.bin${NC}"
echo -e "${GREEN}Built:      $built_bitcoinonly_fingerprint${NC}"

if [ "$downloaded_bitcoinonly_fingerprint" = "$built_bitcoinonly_fingerprint" ]; then
    echo -e "${GREEN}MATCH: The built Bitcoin-only firmware matches the downloaded firmware!${NC}"
else
    echo -e "${YELLOW}MISMATCH: The built Bitcoin-only firmware does not match the downloaded firmware.${NC}"
    echo -e "${YELLOW}This is expected if the downloaded firmware is signed and the built firmware is unsigned.${NC}"
fi

# Compare zeroed firmware (removing signatures)
echo -e "\n${GREEN}Comparing zeroed firmware (signatures removed):${NC}"
echo -e "${GREEN}========================================${NC}"

# Create zeroed versions of the firmware files
cp "$workdir/trezor-firmware.bin" "$workdir/trezor-firmware.bin.zeroed"
dd if=/dev/zero of="$workdir/trezor-firmware.bin.zeroed" bs=1 seek=5567 count=65 conv=notrunc status=none

cp build/core-T2T1/firmware/firmware.bin "$workdir/built-firmware.bin.zeroed"
dd if=/dev/zero of="$workdir/built-firmware.bin.zeroed" bs=1 seek=5567 count=65 conv=notrunc status=none

cp "$workdir/trezor-firmware-bitcoinonly.bin" "$workdir/trezor-firmware-bitcoinonly.bin.zeroed"
dd if=/dev/zero of="$workdir/trezor-firmware-bitcoinonly.bin.zeroed" bs=1 seek=5567 count=65 conv=notrunc status=none

cp build/core-T2T1-bitcoinonly/firmware/firmware.bin "$workdir/built-firmware-bitcoinonly.bin.zeroed"
dd if=/dev/zero of="$workdir/built-firmware-bitcoinonly.bin.zeroed" bs=1 seek=5567 count=65 conv=notrunc status=none

# Calculate hashes of zeroed firmware
echo -e "${YELLOW}Standard firmware (zeroed):${NC}"
downloaded_zeroed_hash=$(sha256sum "$workdir/trezor-firmware.bin.zeroed" | cut -d' ' -f1)
built_zeroed_hash=$(sha256sum "$workdir/built-firmware.bin.zeroed" | cut -d' ' -f1)

echo -e "${BLUE}File: $workdir/trezor-firmware.bin.zeroed${NC}"
echo -e "${GREEN}Downloaded: $downloaded_zeroed_hash${NC}"
echo -e "${BLUE}File: $workdir/built-firmware.bin.zeroed${NC}"
echo -e "${GREEN}Built:      $built_zeroed_hash${NC}"

if [ "$downloaded_zeroed_hash" = "$built_zeroed_hash" ]; then
    echo -e "${GREEN}MATCH: The zeroed standard firmware hashes match!${NC}"
else
    echo -e "${YELLOW}MISMATCH: The zeroed standard firmware hashes do not match.${NC}"
fi

# Calculate hashes of zeroed Bitcoin-only firmware
echo -e "\n${YELLOW}Bitcoin-only firmware (zeroed):${NC}"
downloaded_bitcoinonly_zeroed_hash=$(sha256sum "$workdir/trezor-firmware-bitcoinonly.bin.zeroed" | cut -d' ' -f1)
built_bitcoinonly_zeroed_hash=$(sha256sum "$workdir/built-firmware-bitcoinonly.bin.zeroed" | cut -d' ' -f1)

echo -e "${BLUE}File: $workdir/trezor-firmware-bitcoinonly.bin.zeroed${NC}"
echo -e "${GREEN}Downloaded: $downloaded_bitcoinonly_zeroed_hash${NC}"
echo -e "${BLUE}File: $workdir/built-firmware-bitcoinonly.bin.zeroed${NC}"
echo -e "${GREEN}Built:      $built_bitcoinonly_zeroed_hash${NC}"

if [ "$downloaded_bitcoinonly_zeroed_hash" = "$built_bitcoinonly_zeroed_hash" ]; then
    echo -e "${GREEN}MATCH: The zeroed Bitcoin-only firmware hashes match!${NC}"
else
    echo -e "${YELLOW}MISMATCH: The zeroed Bitcoin-only firmware hashes do not match.${NC}"
fi

# Return to parent directory
cd "$workdir"

# Keep workdir for manual inspection
echo -e "${GREEN}Working directory preserved for manual inspection: $workdir${NC}"
echo -e "${YELLOW}To clean up manually later, run: rm -rf $workdir${NC}"

echo -e "${GREEN}Analysis complete!${NC}"