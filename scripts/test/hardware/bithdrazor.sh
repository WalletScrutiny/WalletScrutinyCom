#!/bin/bash
export VERSION_TAG=v$1
export DEVICE_MODEL=BITHD_RAZOR

cd /tmp
rm -rf bithd-mcu
git clone https://github.com/bithd/bithd-mcu
cd bithd-mcu

wget "https://github.com/bithd/bithd-mcu/releases/download/${VERSION_TAG}/razor-${VERSION_TAG}-signed.bin"
cp "razor-${VERSION_TAG}-signed.bin" $ARCHIVE

git checkout $VERSION_TAG
pipenv --python 3 install
pipenv run ./build-firmware.sh $VERSION_TAG
# docker leaves the folder with wrong permissions ...
docker run --rm --volume "$(pwd)/build:/build:z" trezor-mcu-build /bin/sh -c "chown $(id -u):$(id -g) /build"
pipenv run ./script/prepare_firmware.py -f ./build/razor-$VERSION_TAG-unsigned.bin
sha256sum "razor-${VERSION_TAG}-signed.bin"
diff <(xxd build/razor-$VERSION_TAG-prepared.bin) <(xxd razor-$VERSION_TAG-signed.bin)

