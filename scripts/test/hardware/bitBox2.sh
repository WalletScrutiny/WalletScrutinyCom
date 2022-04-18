#!/bin/bash

### provide this script with the version without "v" and the published buildHash

version=$1

# recreate and cd into test folder
rm -rf ~/wsTest
mkdir ~/wsTest
cd ~/wsTest

git clone https://github.com/digitalbitbox/bitbox02-firmware
cd bitbox02-firmware/
wget https://github.com/digitalbitbox/bitbox02-firmware/releases/download/firmware-btc-only%2Fv${version}/firmware-btc.v${version}.signed.bin

# keep a copy of signed download for later ...
cp firmware-btc.v${version}.signed.bin $ARCHIVE/bitbox02-firmware-btc.v${version}.signed.bin

signedHash=$( sha256sum firmware-btc.v${version}.signed.bin )

# build btc only version
releases/build.sh firmware-btc-only/v${version} "make firmware-btc"
builtHash=$( sha256sum temp/build/bin/firmware-btc.bin )

# unpack signed binary
head -c 588 firmware-btc.v${version}.signed.bin > p_head.bin
tail -c +589 firmware-btc.v${version}.signed.bin > p_firmware-btc.bin
downloadStrippedSigHash=$( sha256sum p_firmware-btc.bin )
cat p_head.bin | tail -c +$(( 8 + 6 * 64 + 1 )) | head -c 4 > p_version.bin
firmwareBytesCount=$(wc -c p_firmware-btc.bin | sed 's/ .*//g')
maxFirmwareSize=884736
paddingBytesCount=$(( $maxFirmwareSize - $firmwareBytesCount ))
dd if=/dev/zero ibs=1 count=$paddingBytesCount 2>/dev/null | tr "\000" "\377" > p_padding.bin
downloadFirmwareHash=$( cat p_version.bin p_firmware-btc.bin p_padding.bin | sha256sum | cut -c1-64 | xxd -r -p | sha256sum | cut -c1-64 )

echo "Hashes of
signed download             $signedHash
signed download minus sig.  $downloadStrippedSigHash
built binary                $builtHash
firmware as shown in device $downloadFirmwareHash
                            (The latter is a double sha256 over version,
                             firmware and padding)"
