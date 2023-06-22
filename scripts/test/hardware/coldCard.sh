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
PUBLISHED_BIN=${version}${version_suffix}-coldcard.dfu

short_version=$(echo $version | grep -Po 'v\K[^-]*')

rm -rf /tmp/firmware
cd /tmp
git clone https://github.com/Coldcard/firmware.git
cd firmware
TAG=$(basename $PUBLISHED_BIN | cut -d "-" -f1,2,3,4)
SOURCE_DATE_EPOCH=$(git show -s --format=%at $TAG | tail -n1)
git checkout ${version}
# ColdCard container picks this binary and splits its firmware from bootrom
# And stores it as check-fw.bin
cd releases
wget https://coldcard.com/downloads/$PUBLISHED_BIN
cd ../stm32
docker build -t coldcard-build - < dockerfile.build
cd ..
docker run \
  --rm \
  --volume $(realpath .):/work/src:ro \
  --volume $(realpath stm32/built):/work/built:rw ${privileges} \
  coldcard-build \
  sh -c "export SOURCE_DATE_EPOCH=$SOURCE_DATE_EPOCH; \
    sh src/stm32/repro-build.sh ${short_version} ${mk_num}"

# Remove signatures
xxd /tmp/firmware/stm32/built/firmware-signed.bin | sed -e 's/^00003f[89abcdef]0: .*/(firmware signature here)/' | xxd -r >firmware-nosig.bin
xxd /tmp/firmware/stm32/built/check-fw.bin | sed -e 's/^00003f[89abcdef]0: .*/(firmware signature here)/' | xxd -r >${version}${version_suffix}-nosig.bin
echo
echo "Hash of non-signature parts downloaded/compiled:"
sha256sum ${version}${version_suffix}-nosig.bin firmware-nosig.bin
echo
echo "Hash of the signed firmware:"
sha256sum /tmp/firmware/releases/$PUBLISHED_BIN /tmp/firmware/stm32/built/firmware-signed.dfu
