#!/bin/bash

### provide this script with the full version name for example 2023-06-19T1627-v4.1.8
### and the mk number 1, 2, 3 or 4

version=$1
mk_num=$2

if [[ $mk_num == 4 ]]; then
  version_suffix="-mk4"
  privileges=-u $(id -u):$(id -g)
else
  privileges=--privileged
fi

short_version=$(echo $version | grep -Po 'v\K[^-]*')

cd /tmp
rm -rf firmware
git clone https://github.com/Coldcard/firmware.git
cd firmware
git checkout ${version}
# ColdCard container picks this binary and splits its firmware from bootrom
# And stores it as check-fw.bin
cd releases
wget https://coldcard.com/downloads/${version}${version_suffix}-coldcard.dfu
cd ../stm32
docker build -t coldcard-build - < dockerfile.build
cd ..
docker run --rm -v $(realpath .):/work/src:ro -v $(realpath stm32/built):/work/built:rw ${privileges} \
           coldcard-build sh src/stm32/repro-build.sh ${short_version} ${mk_num}

# Remove signatures
xxd /tmp/firmware/stm32/built/firmware-signed.bin | sed -e 's/^00003f[89abcdef]0: .*/(firmware signature here)/' | xxd -r >firmware-nosig.bin
xxd /tmp/firmware/stm32/built/check-fw.bin | sed -e 's/^00003f[89abcdef]0: .*/(firmware signature here)/' | xxd -r >${version}${version_suffix}-nosig.bin
echo
echo "Hash of non-signature parts downloaded/compiled:"
sha256sum ${version}${version_suffix}-nosig.bin firmware-nosig.bin
echo
echo "Hash of the signed firmware:"
sha256sum /tmp/firmware/releases/${version}${version_suffix}-coldcard.dfu /tmp/firmware/stm32/built/firmware-signed.dfu
