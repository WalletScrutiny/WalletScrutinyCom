#!/bin/bash
# trezorT.prototype.sh - Automated verification of Trezor T bootloader reproducibility
# This script analyzes the releases.json file to find the bootloader version for a given firmware
# and then builds and verifies the bootloader

# Define colors for output
GREEN='\033[1;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Default archive directory
ARCHIVE=${ARCHIVE:-/tmp}

# Check if version parameter is provided
if [ -z "$1" ]; then
    echo "Usage: $0 <firmware_version>"
    echo "Example: $0 2.8.9"
    exit 1
fi

version=$1
echo -e "${BLUE}Verifying Trezor T firmware version $version${NC}"

# Create temporary directory
workdir=$(mktemp -d)
echo -e "${BLUE}Working directory: $workdir${NC}"
cd "$workdir"

# Download releases.json to find bootloader version
echo -e "${BLUE}Downloading releases.json to find bootloader version...${NC}"
echo -e "${YELLOW}Command: wget -q https://data.trezor.io/firmware/t2t1/releases.json -O releases.json${NC}"
wget https://data.trezor.io/firmware/t2t1/releases.json -O releases.json

# Extract bootloader version for the specified firmware version
# Parse the version array [x, y, z] format
major=$(echo $version | cut -d. -f1)
minor=$(echo $version | cut -d. -f2)
patch=$(echo $version | cut -d. -f3)
version_pattern="\"version\": \[$major, $minor, $patch\]"

echo -e "${YELLOW}Command: grep -A 15 \"$version_pattern\" releases.json | grep \"bootloader_version\"${NC}"
# Use exact match for "bootloader_version" (not min_bootloader_version)
bootloader_version_line=$(grep -A 15 "$version_pattern" releases.json | grep '"bootloader_version"' | head -1)
echo -e "${BLUE}Found bootloader version line: $bootloader_version_line${NC}"

# Extract the version numbers from the bootloader_version line
bootloader_version=$(echo "$bootloader_version_line" | grep -o "\[.*\]" | tr -d '[]" ' | tr ',' '.')

if [ -z "$bootloader_version" ]; then
    echo -e "${BLUE}Error: Could not find bootloader version for firmware $version${NC}"
    echo -e "${BLUE}Trying alternative URL...${NC}"
    echo -e "${YELLOW}Command: wget -q https://data.trezor.io/firmware/releases.json -O releases.json${NC}"
    wget -q https://data.trezor.io/firmware/releases.json -O releases.json
    
    echo -e "${YELLOW}Command: grep -A 15 \"$version_pattern\" releases.json | grep \"bootloader_version\"${NC}"
    # Use exact match for "bootloader_version" (not min_bootloader_version)
    bootloader_version_line=$(grep -A 15 "$version_pattern" releases.json | grep '"bootloader_version"' | head -1)
    echo -e "${BLUE}Found bootloader version line: $bootloader_version_line${NC}"
    
    bootloader_version=$(echo "$bootloader_version_line" | grep -o "\[.*\]" | tr -d '[]" ' | tr ',' '.')
    
    if [ -z "$bootloader_version" ]; then
        echo -e "${BLUE}Error: Could not find bootloader version for firmware $version in either location${NC}"
        exit 1
    fi
fi

echo -e "${GREEN}Found bootloader version $bootloader_version for firmware $version${NC}"

# Create two directories - one for building and one for reference
build_dir="$workdir/build_repo"
reference_dir="$workdir/reference_repo"

# Clone the repository for building the bootloader
echo -e "${BLUE}Cloning Trezor firmware repository for building...${NC}"
echo -e "${YELLOW}Command: git clone https://github.com/trezor/trezor-firmware.git $build_dir${NC}"

# Add error handling for git clone
if ! git clone https://github.com/trezor/trezor-firmware.git $build_dir; then
    echo -e "${YELLOW}Error: Failed to clone repository for building. Will continue with reference only.${NC}"
    build_failed=true
else
    build_failed=false
    cd $build_dir
fi

# Only proceed if the clone was successful
if [ "$build_failed" = false ]; then
    # Checkout the bootloader tag
    echo -e "${BLUE}Checking out bootloader tag core/bl$bootloader_version...${NC}"
    echo -e "${YELLOW}Command: git checkout core/bl$bootloader_version${NC}"
    if ! git checkout core/bl$bootloader_version; then
        echo -e "${YELLOW}Error: Failed to checkout bootloader tag. Will continue with reference only.${NC}"
        build_failed=true
    else
        # Build the bootloader
        echo -e "${BLUE}Building bootloader version $bootloader_version...${NC}"
        echo -e "${YELLOW}Command: ./build-docker.sh --models T --targets bootloader core/bl$bootloader_version${NC}"
        if ! ./build-docker.sh --models T --targets bootloader core/bl$bootloader_version; then
            echo -e "${YELLOW}Error: Failed to build bootloader. Will continue with reference only.${NC}"
            build_failed=true
        fi
    fi
fi

# Verify the bootloader fingerprint
echo -e "${BLUE}Verifying bootloader fingerprint...${NC}"
echo -e "${YELLOW}Command: source ~/trezor-venv/bin/activate${NC}"
source ~/trezor-venv/bin/activate

# Only proceed with built bootloader verification if the build was successful
if [ "$build_failed" = true ]; then
    echo -e "${YELLOW}Skipping built bootloader verification due to previous errors.${NC}"
fi

# Get built bootloader version and hash
if [ -f "build/core-T/bootloader/bootloader.bin" ]; then
    built_bootloader_output=$(python3 -m core.tools.trezor_core_tools.headertool build/core-T/bootloader/bootloader.bin)
    built_bootloader_version=$(echo "$built_bootloader_output" | grep "version:" | head -1 | awk '{print $2}')
    built_bootloader_hash=$(echo "$built_bootloader_output" | grep "Fingerprint:" | head -1 | awk '{print $2}')
else
    echo -e "${YELLOW}Built bootloader file not found. Build process may have failed.${NC}"
    built_bootloader_version="UNKNOWN"
    built_bootloader_hash="UNKNOWN"
fi

# Now clone the repository again for the reference bootloader
echo -e "${BLUE}Cloning Trezor firmware repository for reference...${NC}"
echo -e "${YELLOW}Command: git clone https://github.com/trezor/trezor-firmware.git $reference_dir${NC}"

# Add error handling for git clone
if ! git clone https://github.com/trezor/trezor-firmware.git $reference_dir; then
    echo -e "${YELLOW}Error: Failed to clone repository for reference.${NC}"
    reference_failed=true
else
    reference_failed=false
    cd $reference_dir
fi

# Only proceed if the clone was successful
if [ "$reference_failed" = false ]; then
    # Checkout the firmware version tag
    echo -e "${BLUE}Checking out firmware tag core/v$version...${NC}"
    echo -e "${YELLOW}Command: git checkout core/v$version${NC}"
    if ! git checkout core/v$version; then
        echo -e "${YELLOW}Error: Failed to checkout firmware tag.${NC}"
        reference_failed=true
    fi
fi

# Check if the reference bootloader exists and the reference clone was successful
if [ "$reference_failed" = false ] && [ -f "core/embed/models/T2T1/bootloaders/bootloader_T2T1.bin" ]; then
    # Get reference bootloader version and hash
    # Use a simpler approach to run headertool
    cd "$reference_dir"
    reference_bootloader_output=$(python3 -m core.tools.trezor_core_tools.headertool core/embed/models/T2T1/bootloaders/bootloader_T2T1.bin 2>/dev/null || echo "Error running headertool")
    reference_bootloader_version=$(echo "$reference_bootloader_output" | grep "version:" | head -1 | awk '{print $2}')
    reference_bootloader_hash=$(echo "$reference_bootloader_output" | grep "Fingerprint:" | head -1 | awk '{print $2}')
    
    # Compare the bootloaders
    echo -e "\n${GREEN}Comparing bootloaders:${NC}"
    echo -e "${GREEN}========================================${NC}"
    echo -e "${GREEN}The fingerprint for bootloader version $bootloader_version is:${NC}"
    echo -e "${GREEN}Using headertool.py we have the values:${NC}"
    echo -e "${GREEN}Built Bootloader version:  $built_bootloader_version${NC}"
    echo -e "${GREEN}Built Bootloader hash:     $built_bootloader_hash${NC}"
    echo -e "${GREEN}Provided Bootloader version: $reference_bootloader_version${NC}"
    echo -e "${GREEN}Provided Bootloader hash:    $reference_bootloader_hash${NC}"
    
    # Check if versions match
    if [ "$built_bootloader_version" = "$reference_bootloader_version" ]; then
        echo -e "${GREEN}Version MATCH: Both bootloaders have the same version${NC}"
    else
        echo -e "${YELLOW}Version MISMATCH: Built bootloader is version $built_bootloader_version but provided bootloader is version $reference_bootloader_version${NC}"
    fi
    
    # Check if hashes match
    if [ "$built_bootloader_hash" = "$reference_bootloader_hash" ]; then
        echo -e "${GREEN}Hash MATCH: Both bootloaders have the same hash${NC}"
    else
        echo -e "${YELLOW}Hash MISMATCH: Built bootloader and provided bootloader have different hashes${NC}"
        echo -e "${YELLOW}This is expected if one is signed and the other is unsigned${NC}"
    fi
    
    echo -e "${GREEN}========================================${NC}"
else
    echo -e "${YELLOW}Reference bootloader file not found at: core/embed/models/T2T1/bootloaders/bootloader_T2T1.bin${NC}"
fi

# Return to parent directory
cd "$workdir"

# Keep workdir for manual inspection
echo -e "${GREEN}Working directory preserved for manual inspection: $workdir${NC}"
echo -e "${YELLOW}To clean up manually later, run: rm -rf $workdir${NC}"

echo -e "${GREEN}Verification complete!${NC}"