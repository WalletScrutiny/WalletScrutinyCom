#!/bin/bash
export VERSION_TAG=v$1
export DEVICE_MODEL=BITHD_BITHD

cd /tmp
rm -rf bithd-mcu
git clone https://github.com/bithd/bithd-mcu
cd bithd-mcu

wget "https://github.com/bithd/bithd-mcu/releases/download/${VERSION_TAG}/bithd-${VERSION_TAG}-signed.bin"
cp "bithd-${VERSION_TAG}-signed.bin"

git checkout $VERSION_TAG
pipenv --python 3 install
pipenv run ./build-firmware.sh $VERSION_TAG
# docker leaves the folder with wrong permissions ...
docker run --rm --volume "$(pwd)/build:/build:z" trezor-mcu-build /bin/sh -c "chown $(id -u):$(id -g) /build"
pipenv run ./script/prepare_firmware.py -f ./build/bithd-$VERSION_TAG-unsigned.bin
sha256sum "bithd-${VERSION_TAG}-signed.bin"
diff <(xxd build/bithd-$VERSION_TAG-prepared.bin) <(xxd bithd-$VERSION_TAG-signed.bin)
