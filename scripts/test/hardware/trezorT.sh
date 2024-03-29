#!/bin/bash

### provide this script with the version without "v" and the published buildHash

version=$1
buildHash=$2

cd /tmp
rm -rf trezor-firmware
git clone https://github.com/trezor/trezor-firmware.git
cd trezor-firmware
wget https://data.trezor.io/firmware/2/trezor-${version}.bin
wget https://data.trezor.io/firmware/2/trezor-${version}-bitcoinonly.bin
cp trezor-${version}.bin $ARCHIVE/trezor-core-${version}.bin
cp trezor-${version}-bitcoinonly.bin $ARCHIVE/trezor-core-${version}-bitcoinonly.bin
git checkout core/v${version}
bash -c "./build-docker.sh --skip-legacy core/v${version}"
echo
echo "Hash of non-signature parts downloaded/compiled standard:"
cp trezor-${version}.bin trezor-${version}.bin.zeroed
dd if=/dev/zero of=trezor-${version}.bin.zeroed bs=1 seek=5567 count=65 conv=notrunc
sha256sum trezor-${version}.bin.zeroed build/core/firmware/firmware.bin
echo
echo "Hash of non-signature parts downloaded/compiled bitcoinonly:"
cp trezor-${version}-bitcoinonly.bin trezor-${version}-bitcoinonly.bin.zeroed
dd if=/dev/zero of=trezor-${version}-bitcoinonly.bin.zeroed bs=1 seek=5567 count=65 conv=notrunc
sha256sum trezor-${version}-bitcoinonly.bin.zeroed build/core-bitcoinonly/firmware/firmware.bin
echo
echo "Hash of the signed firmware:"
sha256sum trezor-${version}.bin trezor-${version}-bitcoinonly.bin
