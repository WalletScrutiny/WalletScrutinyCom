#!/bin/bash

### provide this script with the version without "v"

version=$1

cd /tmp
git clone https://github.com/Blockstream/jade
cd jade
git checkout ${version}
git submodule update --init --recursive
DOCKER_BUILDKIT=1 docker build -f ./Dockerfile -t jade_builder .
docker run --rm -v ${PWD}:/builds/blockstream/jade --name jade_builder -it jade_builder bash -c "\
    . /root/esp/esp-idf/export.sh; \
    cd /builds/blockstream/jade; \
    cp ./production/sdkconfig_jade_prod.defaults sdkconfig.defaults; \
    rm -f sdkconfig; \
    idf.py fullclean all; \
    espsecure.py sign_data --keyfile ./release/scripts/dev_fw_signing_key.pem --version 2 --output ./build/jade_signed.bin ./build/jade.bin"

binary_file=$(curl "https://jadefw.blockstream.com/bin/jade/index.json" | grep -o "\"${version}_ble.*" | cut -d '"' -f 2)
wget -O "downloaded-firmware.bin.gz" "https://jadefw.blockstream.com/bin/jade/${binary_file}"
pigz -z -d downloaded-firmware.bin.gz
sha256sum downloaded-firmware.bin build/jade_signed.bin build/jade.bin
