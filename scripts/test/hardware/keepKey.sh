#!/bin/bash

### provide this script with the version without "v" and the published buildHash

version=$1
buildHash=$2

cd /tmp
git clone https://github.com/keepkey/keepkey-firmware
cd keepkey-firmware
git checkout v${version}
git submodule update --init --recursive
# rm deps/python-keepkey/keepkeylib/eth/ethereum-lists/src/tokens/eth/0x45804880de22913dafe09f4980848ece6ecbaf78.json
./scripts/build/docker/device/release.sh
wget https://github.com/keepkey/keepkey-firmware/releases/download/v${version}/firmware.keepkey.bin
sha256sum firmware.keepkey.bin
tail -c +257 firmware.keepkey.bin | sha256sum
tail -c +257 ./bin/firmware.keepkey.bin | sha256sum
