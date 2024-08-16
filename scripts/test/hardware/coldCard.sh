#!/bin/bash

### provide this script with the full version name for example 2023-06-19T1627-v4.1.8
### and the mk number q1 or mk4
### ( eg: ./scripts/test/hardware/coldcard.sh "2024-05-09T1527-v5.3.1" mk4 )
### Third parameter may be left empty **UNLESS** the name of the tagged release and the name of the downloadable binary do not match. 
### In that case simply add a third parameter with the version, mk number, and "-coldcard.dfu" at the end. 
### (eg: ./scripts/test/hardware/coldcard.v1.sh "2024-07-05T1349-v5.3.3" mk4 2024-07-05T1348-v5.3.3-mk4-coldcard.dfu)

version=$1
mk=$2
custom_download=$3

dfu_filename=${version}-${mk}-coldcard.dfu

if [[ -z "$custom_download" ]]; then
  PUBLISHED_BIN=$dfu_filename
  else
  PUBLISHED_BIN=$custom_download
fi

if [[ $mk == 'mk4' ]]; then
  privileges=--privileged
  mkfile='MK4-Makefile'
else
  privileges=--privileged
fi

if [[ $mk == 'q1' ]]; then
  privileges=--privileged
  mkfile='Q1-Makefile'
fi

short_version=$(echo $version | grep -Po 'v\K[^-]*')

rm -rf /tmp/firmware
  cd /tmp
  git clone https://github.com/Coldcard/firmware.git
  cd firmware
  TAG=$(basename $version | cut -d "-" -f1,2,3,4)
  SOURCE_DATE_EPOCH=$(git show -s --format=%at $TAG | tail -n1)
  git checkout ${version}
  cd releases
  ## In case the binary's name doesn't match up with the tagged release from GitHub, it will be renamed to match upon download.
  wget -O  $dfu_filename https://coldcard.com/downloads/$PUBLISHED_BIN
  cd ../stm32
  docker build -t coldcard-build - < dockerfile.build
  cd ..
  docker run \
    --volume $(realpath .):/work/src:ro \
    --volume $(realpath stm32/built):/work/built:rw ${privileges} \
    coldcard-build \
    sh -c "sh src/stm32/repro-build.sh ${short_version} ${mk} ${mkfile}"


# Building is finished. Remove signatures and compare hashes...
xxd /tmp/firmware/stm32/built/firmware-signed.bin | sed -e 's/^00003f[89abcdef]0: .*/(firmware signature here)/' | xxd -r >firmware-nosig.bin
xxd /tmp/firmware/stm32/built/check-fw.bin | sed -e 's/^00003f[89abcdef]0: .*/(firmware signature here)/' | xxd -r >${version}-${mk}-nosig.bin
echo
echo "Hash of non-signature parts downloaded/compiled:"
sha256sum *-v${short_version}-${mk}-nosig.bin firmware-nosig.bin
echo
echo "Hash of the signed firmware:"
sha256sum /tmp/firmware/releases/$dfu_filename /tmp/firmware/stm32/built/firmware-signed.dfu
