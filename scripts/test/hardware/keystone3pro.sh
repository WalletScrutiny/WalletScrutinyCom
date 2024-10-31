#!/bin/bash

# Provide this script with the version (e.g., "1.7.2") without "v"
version=$1

cd /tmp
git clone https://github.com/KeystoneHQ/keystone3-firmware
cd keystone3-firmware
git -c submodule.keystone3-firmware-release.update=none submodule update --init --recursive

# Build the Docker image on the master branch
docker build -t keystonehq/keystone3_baker:latest .

# Checkout the specified version and rebuild
git checkout tags/${version}
docker run -v $(pwd):/keystone3-firmware keystonehq/keystone3_baker:latest python3 build.py -e production

# Verify and fetch remote binary for comparison
sha256sum ./build/mh1903.bin
wget https://keyst.one/contents/KeystoneFirmwareG3/v${version}/keystone3.bin

# Build fmm and fmc tools if not prebuilt
cd /tools/code/firmware-maker
cargo build --manifest-path tools/code/firmware-maker/Cargo.toml
./tools/code/firmware-maker/target/debug/fmm --source build/mh1903.bin --destination keystone3-unsigned.bin

cargo build --manifest-path tools/code/firmware-checker/Cargo.toml
./tools/code/firmware-checker/target/debug/fmc --source keystone3-unsigned.bin

# Display hashes for comparison
echo "------------------------"
echo "(SIGNED) Binary from Keystone Website:"
sha256sum keystone3.bin     
echo "------------------------"

echo "------------------------"
echo "Binary from build process:"
sha256sum ./build/mh1903.bin
echo "------------------------"

echo "------------------------"
echo "Unsigned Binary from Keystone Website:"
./tools/code/firmware-checker/target/debug/fmc --source keystone3-unsigned.bin
echo "------------------------"

echo "Unsigned .bin hash must be the same as mh1903.bin."
