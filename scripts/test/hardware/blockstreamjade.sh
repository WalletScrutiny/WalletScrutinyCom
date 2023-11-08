#!/bin/bash

### provide this script with the version without "v"

version=$1

set -xe
rm -rf /tmp/jade/
cd /tmp
git clone https://github.com/Blockstream/jade
cd jade
git checkout ${version}
git submodule update --init --recursive
DOCKER_BUILDKIT=1 docker build -f ./Dockerfile -t jade_builder .
docker run --rm -v ${PWD}:/builds/blockstream/jade --name jade_builder -it \
    jade_builder \
    bash -c "\
    . /root/esp/esp-idf/export.sh; \
    cd /builds/blockstream/jade; \
    git config --global --add safe.directory /builds/blockstream/jade; \
    cp ./production/sdkconfig_jade_prod.defaults sdkconfig.defaults; \
    rm -f sdkconfig; \
    idf.py fullclean all; \
    espsecure.py sign_data --keyfile ./release/scripts/dev_fw_signing_key.pem --version 2 --output ./build/jade_signed.bin ./build/jade.bin"

binary_file=$(curl --silent https://jadefw.blockstream.com/bin/jade/index.json | jq -r "(.stable.full + .previous.full)[] | select(.version == \"${version}\" and .config == \"ble\") | .filename")
wget -O "downloaded-firmware.bin.gz" "https://jadefw.blockstream.com/bin/jade/${binary_file}"
pigz -z -d downloaded-firmware.bin.gz
head -c -4096 downloaded-firmware.bin > downloaded-firmware_stripped.bin
set +x
echo
echo "Results:"
sha256sum downloaded-firmware* build/jade.bin
expectedHash=$(sha256sum downloaded-firmware_stripped.bin | awk '{print $1}')
actualHash=$(sha256sum build/jade.bin | awk '{print $1}')
if [ "$expectedHash" == "$actualHash" ]; then
  echo "The Jade firmware version ${version} is reproducible with above hashes."
else
  echo "The Jade firmware version ${version} is **not** reproducible with above hashes."
fi
