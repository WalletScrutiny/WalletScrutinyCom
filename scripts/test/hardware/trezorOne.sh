#!/bin/bash

### provide this script with the version without "v" and the published buildHash

version=$1
buildHash=$2

cd /tmp
rm -rf trezor-firmware
git clone https://github.com/trezor/trezor-firmware.git
cd trezor-firmware
wget https://data.trezor.io/firmware/1/trezor-${version}.bin
wget https://data.trezor.io/firmware/1/trezor-${version}-bitcoinonly.bin
cp trezor-${version}.bin $ARCHIVE/trezor-legacy-${version}.bin
cp trezor-${version}-bitcoinonly.bin $ARCHIVE/trezor-legacy-${version}-bitcoinonly.bin
git checkout legacy/v${version}
bash -c "./build-docker.sh --skip-core legacy/v${version}"
echo
echo "Hash of non-signature parts downloaded/compiled standard:"
tail -c +1281 trezor-${version}.bin | sha256sum
tail -c +1025 build/legacy/firmware/firmware.bin | sha256sum
echo
echo "Hash of non-signature parts downloaded/compiled bitcoinonly:"
tail -c +1281 trezor-${version}-bitcoinonly.bin | sha256sum
tail -c +1025 build/legacy-bitcoinonly/firmware/firmware.bin | sha256sum
echo
echo "Hash of the signed firmware:"
sha256sum trezor-${version}.bin "trezor-${version}-bitcoinonly.bin"
