#!/bin/bash
# Script to verify Cypherock X1 firmware reproducibility
# Instructions source: https://github.com/Cypherock/x1_wallet_firmware/blob/main/VERIFY.md

# Ensure a version is passed as an argument
if [ -z "$1" ]; then
  echo "Usage: $0 <version>"
  exit 1
fi

# Set version tag from the argument
VERSION_TAG="v$1"  # Added 'v' prefix here
export VERSION_TAG

# Define the path for the docker-compose file
COMPOSE_FILE="./scripts/test/hardware/docker-compose.yml"

# Create the docker-compose.yml file
echo "Creating docker-compose.yml file..."
cat > $COMPOSE_FILE <<'EOL'
version: '3'
services:
  build-firmware:
    image: cypherock/x1-firmware-builder:v0.0.0
    environment:
      - VERSION_TAG=${VERSION_TAG}
    command: |
      bash -c '
        set -e
        
        echo "Cloning repository..."
        if [ -d "x1_wallet_firmware" ]; then
          echo "Removing existing x1_wallet_firmware directory..."
          rm -rf x1_wallet_firmware
        fi
        
        git clone --branch ${VERSION_TAG} --depth 1 https://github.com/Cypherock/x1_wallet_firmware.git --recurse-submodules
        
        cd x1_wallet_firmware
        mkdir -p build
        cd build
        
        echo "Building firmware..."
        cmake -DCMAKE_BUILD_TYPE="Release" -DFIRMWARE_TYPE="Main" -DCMAKE_BUILD_PLATFORM="Device" -G "Ninja" ..
        ninja
        
        echo "Calculating SHA256 checksums for built binary..."
        sha256sum Cypherock-Main.bin > ../build_checksum.txt
        cat ../build_checksum.txt
        
        cd ..
        echo "Downloading released firmware binary from GitHub..."
        wget -O Cypherock-Main-released.bin "https://github.com/Cypherock/x1_wallet_firmware/releases/download/${VERSION_TAG}/Cypherock-Main.bin"
        
        echo "Calculating SHA256 checksums..."
        sha256sum Cypherock-Main-released.bin > release_checksum.txt
        cat release_checksum.txt
        
        echo "Compare built and released binaries..."
        cat build_checksum.txt
        cat release_checksum.txt
      '
EOL

echo "docker-compose.yml file created successfully."

# Run Docker Compose to execute the firmware build and verification
echo "Running Docker Compose to verify firmware build..."
docker-compose -f $COMPOSE_FILE up --exit-code-from build-firmware

# Store the exit code
EXIT_CODE=$?

# Cleanup the docker-compose.yml after running the script
echo "Cleaning up docker-compose.yml..."
rm -f $COMPOSE_FILE
echo "docker-compose.yml cleaned up successfully."

# Exit with the same code as the Docker container
exit $EXIT_CODE