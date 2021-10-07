#!/bin/bash

### provide this script with the version without "v" and the published buildHash

version=$1
buildHash=$2

cd /tmp
rm -rf bitbox02-firmware/
git clone https://github.com/digitalbitbox/bitbox02-firmware
cd bitbox02-firmware/
wget https://github.com/digitalbitbox/bitbox02-firmware/releases/download/firmware-btc-only%2Fv${version}/firmware-btc.v${version}.signed.bin
cp firmware-btc.v${version}.signed.bin $ARCHIVE/bitbox02-firmware-btc.v${version}.signed.bin
echo ${buildHash}; sha256sum *.bin
releases/build.sh firmware-btc-only/v${version} "make firmware-btc"
sha256sum temp/build/bin/firmware-btc.bin firmware-btc.v${version}.bin

head -c 588 firmware-btc.v${version}.signed.bin > p_head.bin
tail -c +589 firmware-btc.v${version}.signed.bin > p_firmware.bin
cat p_head.bin | tail -c +$(( 8 + 6 * 64 + 1 )) | head -c 4 > p_version.bin
firmwareBytesCount=$(wc -c p_firmware.bin | sed 's/ .*//g')
paddingBytesCount=$(( 884736 - $firmwareBytesCount ))
dd if=/dev/zero ibs=1 count=$paddingBytesCount 2>/dev/null | tr "\000" "\377" > p_padding.bin
cat p_version.bin p_firmware.bin p_padding.bin | sha256sum | cut -c1-64 | xxd -r -p | sha256sum | cut -c1-64
echo $buildHash
