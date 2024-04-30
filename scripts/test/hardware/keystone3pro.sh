#!/bin/bash

### provide this script with the version without "v" and the published buildHash

version=$1

cd /tmp
git clone https://github.com/KeystoneHQ/keystone3-firmware
cd keystone3-firmware
git -c submodule.keystone3-firmware-release.update=none submodule update --init --recursive
docker build -t keystonehq/keystone3_baker:1.0.2 
git checkout tags/${version}
docker run -v $(pwd):/keystone3-firmware keystonehq/keystone3_baker:1.0.2 python3 build.py -e production
sha256sum ./build/mh1903.bin
wget https://keyst.one/contents/KeystoneFirmwareG3/v${version}/keystone3.bin
cd /tools/code/firmware-maker
cargo build --manifest-path tools/code/firmware-maker/Cargo.toml
./tools/code/firmware-maker/target/debug/fmm --source build/mh1903.bin --destination keystone3-unsigned.bin

cargo build --manifest-path tools/code/firmware-checker/Cargo.toml

./tools/code/firmware-checker/target/debug/fmc --source keystone3-unsigned.bin


echo "All builds complete."
echo "------------------------"
echo "(SIGNED) Binary from Keystone Website :"
sha256sum keystone3.bin     
echo "------------------------"
echo "^^^^^^^^^^^^^^^^^^^^^^^^"

echo "------------------------"
echo "Binary from build process:"
sha256sum ./build/mh1903.bin
echo "------------------------"
echo "^^^^^^^^^^^^^^^^^^^^^^^^"

echo "------------------------"
echo "Unsigned Binary from Keystone Website :"
./tools/code/firmware-checker/target/debug/fmc --source keystone3-unsigned.bin
echo "------------------------"
echo "^^^^^^^^^^^^^^^^^^^^^^^^"

echo "Unsigned .bin hash must be the same as mh1903.bin."
