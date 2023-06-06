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
# Remove signatures
cp trezor-${version}.bin trezor-${version}-nosig.bin
cp trezor-${version}-bitcoinonly.bin trezor-${version}-bitcoinonly-nosig.bin
dd if=/dev/zero of=trezor-${version}-nosig.bin bs=1 seek=544 count=195 conv=notrunc
dd if=/dev/zero of=trezor-${version}-bitcoinonly-nosig.bin bs=1 seek=544 count=195 conv=notrunc
echo
echo "Hash of non-signature parts downloaded/compiled standard:"
sha256sum trezor-${version}-nosig.bin build/legacy/firmware/firmware.bin
echo
echo "Hash of non-signature parts downloaded/compiled bitcoinonly:"
sha256sum trezor-${version}-bitcoinonly-nosig.bin build/legacy-bitcoinonly/firmware/firmware.bin
echo
echo "Hash of the signed firmware:"
sha256sum trezor-${version}.bin trezor-${version}-bitcoinonly.bin