#!/bin/bash

# Provide version without "v" as argument
version=$1

# Create archive directory if it doesn't exist
mkdir -p /var/shared/firmware/trezorSafe3/${version}

# Download firmware files
wget https://data.trezor.io/firmware/t2b1/trezor-t2b1-${version}.bin
wget https://data.trezor.io/firmware/t2b1/trezor-t2b1-${version}-bitcoinonly.bin

# Store initial hashes
INITIAL_HASHES=$(sha256sum *.bin)

# Copy to archive
cp trezor-t2b1-${version}.bin /var/shared/firmware/trezorSafe3/${version}/
cp trezor-t2b1-${version}-bitcoinonly.bin /var/shared/firmware/trezorSafe3/${version}/

# Clone and prepare repository
git clone https://github.com/trezor/trezor-firmware.git
cd trezor-firmware

# Checkout the version
git checkout core/v${version}

# Store commit hash
COMMIT_HASH=$(git rev-parse HEAD)

# Build firmware
bash -c "./build-docker.sh --models R core/v${version}"

# Store fingerprints
FINGERPRINTS=$(sha256sum build/core-R/bootloader/bootloader.bin
sha256sum build/core-R/firmware/firmware.bin
sha256sum build/core-R-bitcoinonly/bootloader/bootloader.bin
sha256sum build/core-R-bitcoinonly/firmware/firmware.bin)

# Zero out signatures
vendorHeaderSize=4608
seekSize=$((5567 - vendorHeaderSize + 512))

cp ../trezor-t2b1-${version}.bin trezor-t2b1-${version}.bin.zeroed
cp ../trezor-t2b1-${version}-bitcoinonly.bin trezor-t2b1-${version}-bitcoinonly.bin.zeroed

dd if=/dev/zero of=trezor-t2b1-${version}.bin.zeroed bs=1 seek=$seekSize count=65 conv=notrunc 2>/dev/null
dd if=/dev/zero of=trezor-t2b1-${version}-bitcoinonly.bin.zeroed bs=1 seek=$seekSize count=65 conv=notrunc 2>/dev/null

# Store zeroed comparison
ZEROED_COMPARISON=$(sha256sum *.zeroed build/core-R{,-bitcoinonly}/firmware/firmware.bin | sort)

# Cleanup downloaded and temporary files
cd ..
rm -f trezor-t2b1-${version}.bin trezor-t2b1-${version}-bitcoinonly.bin
rm -f trezor-t2b1-${version}.bin.zeroed trezor-t2b1-${version}-bitcoinonly.bin.zeroed
rm -rf trezor-firmware

# Output all results at the end in the correct order
echo "Hash of the binaries downloaded:"
echo "$INITIAL_HASHES"
echo
echo "Built from commit $COMMIT_HASH"
echo
echo "Fingerprints:"
echo "$FINGERPRINTS"
echo
echo "Comparing hashes of zeroed binaries with built firmware:"
echo "$ZEROED_COMPARISON"