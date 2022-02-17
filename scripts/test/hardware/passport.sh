#!/bin/bash


### provide this script with the version without "v" and the published buildHash

version=$1
buildHash=$2

rm -rf /tmp/passport/
rm /tmp/passport-fw-${version}.bin

cd /tmp
wget https://github.com/Foundation-Devices/passport-firmware/releases/download/v${version}/passport-fw-${version}.bin
sha256sum passport-fw-${version}.bin 
mkdir passport
cd passport
podman run --rm -it --volume=$(pwd):/work/ ubuntu:18.04 bash -c "apt update; \
    apt install --yes git python3-pip gcc-arm-none-eabi autotools-dev automake libusb-1.0-0-dev libtool; \
    git clone https://github.com/Foundation-Devices/passport-firmware.git; \
    cd passport-firmware; \
    git checkout v${version}; \
    make -C mpy-cross; \
    cd ports/stm32/; \
    make BOARD=Passport; \
    sha256sum build-Passport/firmware.bin;echo $buildHash; \
    mv build-Passport/firmware.bin /work/firmware-passport-v${version}.bin; \
    bash"
tail -c +2049 ../passport-fw-${version}.bin | sha256sum ; \
    sha256sum firmware-passport-v${version}.bin; \
    echo $buildHash
