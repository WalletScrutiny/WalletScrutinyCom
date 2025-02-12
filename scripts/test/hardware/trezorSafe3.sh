#!/bin/bash

# Provide version without "v" as argument
version=$1

# Create archive directory if it doesn't exist
mkdir -p /var/shared/firmware/trezorSafe3/${version}

# Download firmware files
wget https://data.trezor.io/firmware/t2b1/trezor-t2b1-${version}.bin
wget https://data.trezor.io/firmware/t2b1/trezor-t2b1-${version}-bitcoinonly.bin
wget -O trezor-t2b1-bootloader-2.1.4.bin "https://github.com/trezor/data/raw/refs/heads/master/bootloader/t2b1/bootloader-t2b1-2.1.4.bin?download="

# Store initial hashes
INITIAL_HASHES=$(sha256sum trezor-t2b1-${version}.bin trezor-t2b1-${version}-bitcoinonly.bin trezor-t2b1-bootloader-2.1.4.bin)

# Copy to archive
cp trezor-t2b1-${version}.bin /var/shared/firmware/trezorSafe3/${version}/
cp trezor-t2b1-${version}-bitcoinonly.bin /var/shared/firmware/trezorSafe3/${version}/
cp trezor-t2b1-bootloader-2.1.4.bin /var/shared/firmware/trezorSafe3/${version}/

# Clone and prepare repository
git clone https://github.com/trezor/trezor-firmware.git
cd trezor-firmware

# Checkout the version
git checkout core/v${version}

# Store commit hash
COMMIT_HASH=$(git rev-parse HEAD)

# Build firmware
bash -c "./build-docker.sh --models R core/v${version}" >/dev/null

# Store fingerprints
FINGERPRINTS=$(sha256sum build/core-R/bootloader/bootloader.bin
sha256sum build/core-R/firmware/firmware.bin
sha256sum build/core-R-bitcoinonly/bootloader/bootloader.bin
sha256sum build/core-R-bitcoinonly/firmware/firmware.bin)

# Store bootloader comparison
BOOTLOADER_COMPARISON=$(sha256sum ../trezor-t2b1-bootloader-2.1.4.bin build/core-R/bootloader/bootloader.bin build/core-R-bitcoinonly/bootloader/bootloader.bin | sort)

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
rm -f trezor-t2b1-bootloader-2.1.4.bin
rm -rf trezor-firmware

# Output all results in the correct order
echo "Hash of the binaries downloaded:"
echo "$INITIAL_HASHES"
echo
echo "Built from commit $COMMIT_HASH"
echo
echo "Fingerprints:"
echo "$FINGERPRINTS"
echo
echo "Bootloader verification:"
echo "$BOOTLOADER_COMPARISON"
echo
echo "Comparing hashes of zeroed binaries with built firmware:"
echo "$ZEROED_COMPARISON"