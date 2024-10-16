#!/bin/bash

# Provide the version without "v" and the published buildHash as arguments.
version=$1
buildHash=$2

# Ensure necessary directories are created with proper permissions.
echo "Creating necessary directories..."
if [ ! -d "/var" ]; then
    echo "/var directory not found. Creating /var..."
    sudo mkdir /var
fi

if [ ! -d "/var/shared" ]; then
    echo "/var/shared directory not found. Creating /var/shared..."
    sudo mkdir /var/shared
fi

if [ ! -d "/var/shared/firmware" ]; then
    echo "/var/shared/firmware directory not found. Creating /var/shared/firmware..."
    sudo mkdir /var/shared/firmware
fi

sudo mkdir -p /var/shared/firmware/trezorSafe5/${version}
sudo chown -R $USER:$USER /var/shared

# --- IMPORTANT ---
# Ensure that your user is part of the Docker group to avoid permission errors.
# Run the following commands manually if not done yet:
#   sudo usermod -aG docker $USER
#   newgrp docker
# Failing to do so will result in Docker permission errors during the build process.

# Clean up and prepare the working directory.
cd /tmp
rm -rf trezor-firmware
git clone https://github.com/trezor/trezor-firmware.git
cd trezor-firmware

# Download the official firmware and Bitcoin-only firmware.
wget https://data.trezor.io/firmware/t3t1/trezor-t3t1-${version}.bin
wget https://data.trezor.io/firmware/t3t1/trezor-t3t1-${version}-bitcoinonly.bin

# Copy downloaded firmware to the archive directory.
cp trezor-t3t1-${version}.bin /var/shared/firmware/trezorSafe5/${version}/
cp trezor-t3t1-${version}-bitcoinonly.bin /var/shared/firmware/trezorSafe5/${version}/

# Checkout the specified version in the repository.
git checkout core/v${version}

# Run the build script with the correct command.
bash build-docker.sh core/v${version} --skip-legacy --models T3T1

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
