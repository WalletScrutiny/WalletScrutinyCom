#!/bin/bash
# Run with trezorSafe5.sh <version> <build hash>
# Can find buildhash at https://github.com/trezor/data/blob/master/firmware/2/releases.json

# Set ARCHIVE to /tmp to ensure write permissions without sudo
ARCHIVE=/tmp

# Provide the version without "v" and the published buildHash as arguments.
version=$1
buildHash=$2

# Check if Docker is accessible without root
if ! docker info >/dev/null 2>&1; then
    echo "Error: Cannot access Docker. Please ensure:"
    echo "1. Docker is installed"
    echo "2. Docker daemon is running"
    echo "3. You are a member of the 'docker' group (run 'groups' to check)"
    echo "   To add yourself to docker group: 'sudo usermod -aG docker $USER'"
    echo "   After adding yourself to the group, you need to log out and back in"
    exit 1
fi

# Ensure firmware directory exists in ARCHIVE
echo "Creating necessary directories..."
if [ -z "$ARCHIVE" ]; then
    echo "Error: ARCHIVE environment variable is not set"
    exit 1
fi

mkdir -p "$ARCHIVE/firmware/trezorSafe5/${version}"

# Clean up and prepare the working directory.
cd /tmp
rm -rf trezor-firmware
git clone https://github.com/trezor/trezor-firmware.git
cd trezor-firmware

# Download the official firmware and Bitcoin-only firmware.
wget https://data.trezor.io/firmware/t3t1/trezor-t3t1-${version}.bin
wget https://data.trezor.io/firmware/t3t1/trezor-t3t1-${version}-bitcoinonly.bin

# Copy downloaded firmware to the archive directory.
cp trezor-t3t1-${version}.bin "$ARCHIVE/firmware/trezorSafe5/${version}/"
cp trezor-t3t1-${version}-bitcoinonly.bin "$ARCHIVE/firmware/trezorSafe5/${version}/"

# Checkout the specified version in the repository.
git checkout core/v${version}

# Run the build script with the correct command - only build T3T1 variants
bash build-docker.sh core/v${version} --skip-legacy --skip-core-model T2B1,T2T1 --models T3T1

# Verify standard firmware hash (zero out signature).
echo "Hash of non-signature parts downloaded/compiled standard:"
cp trezor-t3t1-${version}.bin trezor-t3t1-${version}.bin.zeroed
dd if=/dev/zero of=trezor-t3t1-${version}.bin.zeroed bs=1 seek=1983 count=65 conv=notrunc
sha256sum trezor-t3t1-${version}.bin.zeroed build/core-T3T1/firmware/firmware.bin

# Verify Bitcoin-only firmware hash (zero out signature).
echo
echo "Hash of non-signature parts downloaded/compiled bitcoinonly:"
cp trezor-t3t1-${version}-bitcoinonly.bin trezor-t3t1-${version}-bitcoinonly.bin.zeroed
dd if=/dev/zero of=trezor-t3t1-${version}-bitcoinonly.bin.zeroed bs=1 seek=1983 count=65 conv=notrunc
sha256sum trezor-t3t1-${version}-bitcoinonly.bin.zeroed build/core-T3T1-bitcoinonly/firmware/firmware.bin

# Display the hashes of the signed firmware files for reference.
echo
echo "Hash of the signed firmware:"
sha256sum trezor-t3t1-${version}.bin trezor-t3t1-${version}-bitcoinonly.bin
