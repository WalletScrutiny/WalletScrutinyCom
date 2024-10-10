#!/bin/bash

### provide this script with the version without "v" and the published buildHash

version=$1
buildHash=$2

cd /tmp
rm -rf trezor-firmware
git clone https://github.com/trezor/trezor-firmware.git
cd trezor-firmware

# Download firmware files with correct paths and filenames
wget https://data.trezor.io/firmware/t2/trezor-${version}.bin -O trezor-core-${version}.bin
wget https://data.trezor.io/firmware/t2/trezor-${version}-bitcoinonly.bin -O trezor-core-${version}-bitcoinonly.bin

# Copy downloaded files to the archive directory
cp trezor-core-${version}.bin $ARCHIVE/trezor-core-${version}.bin
cp trezor-core-${version}-bitcoinonly.bin $ARCHIVE/trezor-core-${version}-bitcoinonly.bin

# Checkout the correct version in the repository
git checkout core/v${version}

# Build the firmware using Docker
bash -c "./build-docker.sh --skip-legacy core/v${version}"

echo
echo "Hash of non-signature parts downloaded/compiled standard:"

# Zero out the signature and compare hash for standard firmware
cp trezor-core-${version}.bin trezor-core-${version}.bin.zeroed
dd if=/dev/zero of=trezor-core-${version}.bin.zeroed bs=1 seek=5567 count=65 conv=notrunc
sha256sum trezor-core-${version}.bin.zeroed build/core-T/firmware/firmware.bin

echo
echo "Hash of non-signature parts downloaded/compiled bitcoinonly:"

# Zero out the signature and compare hash for bitcoin-only firmware
cp trezor-core-${version}-bitcoinonly.bin trezor-core-${version}-bitcoinonly.bin.zeroed
dd if=/dev/zero of=trezor-core-${version}-bitcoinonly.bin.zeroed bs=1 seek=5567 count=65 conv=notrunc
sha256sum trezor-core-${version}-bitcoinonly.bin.zeroed build/core-T-bitcoinonly/firmware/firmware.bin

echo
echo "Hash of the signed firmware:"
sha256sum trezor-core-${version}.bin trezor-core-${version}-bitcoinonly.bin