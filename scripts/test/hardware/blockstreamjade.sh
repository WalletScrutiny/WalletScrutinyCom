#!/bin/bash

### provide this script with the version without "v"

version=$1

set -xe # error out early
rm --recursive --force /tmp/jade/ # cleanup prior runs
# get code at provided revision
cd /tmp
git clone https://github.com/Blockstream/jade
cd jade
git checkout ${version}

# Temporary fix: Remove --recursive flag from QEMU cloning in Dockerfile
# This fix can be removed once Blockstream merges their fix (see: espressif/qemu#106)
# https://github.com/Blockstream/Jade/issues/191
sed -i '/^RUN git clone.*qemu.git/s/--recursive --shallow-submodules/--shallow-submodules/' Dockerfile

git submodule update --init --recursive
# download 4 binaries
jade10index=jade1.0.json
jade11index=jade1.1.json
curl --silent \
  --output ${jade10index} \
  --output ${jade11index} \
  https://jadefw.blockstream.com/bin/jade{,1.1}/index.json
filename_10_ble=$(jq -r "(.stable.full + .previous.full)[] | select(.version == \"${version}\" and .config == \"ble\"    ) | .filename" $jade10index)
filename_11_ble=$(jq -r "(.stable.full + .previous.full)[] | select(.version == \"${version}\" and .config == \"ble\"    ) | .filename" $jade11index)
filename_10_noR=$(jq -r "(.stable.full + .previous.full)[] | select(.version == \"${version}\" and .config == \"noradio\") | .filename" $jade10index)
filename_11_noR=$(jq -r "(.stable.full + .previous.full)[] | select(.version == \"${version}\" and .config == \"noradio\") | .filename" $jade11index)
wget --quiet --output-document "jade_${version}_10_ble.bin.gz" "https://jadefw.blockstream.com/bin/jade/${filename_10_ble}"
wget --quiet --output-document "jade_${version}_11_ble.bin.gz" "https://jadefw.blockstream.com/bin/jade1.1/${filename_11_ble}"
wget --quiet --output-document "jade_${version}_10_noR.bin.gz" "https://jadefw.blockstream.com/bin/jade/${filename_10_noR}"
wget --quiet --output-document "jade_${version}_11_noR.bin.gz" "https://jadefw.blockstream.com/bin/jade1.1/${filename_11_noR}"
pigz --zlib --decompress --keep *.gz

DOCKER_BUILDKIT=1 docker build -f ./Dockerfile -t jade_builder .

buildFW() {
  local sdkconfig=$1
  local output=$2
  docker run \
      --rm \
      --volume ${PWD}:/builds/blockstream/jade \
      --name jade_builder \
      jade_builder \
      bash -c "\
      . /root/esp/esp-idf/export.sh; \
      cd /builds/blockstream/jade; \
      git config --global --add safe.directory /builds/blockstream/jade; \
      git stash; \
      cp ./production/${sdkconfig}.defaults sdkconfig.defaults; \
      rm -f sdkconfig; \
      idf.py fullclean all; \
      mv ./build/jade.bin ${output};"
}
buildFW "sdkconfig_jade_prod"              "jade_${version}_10_ble.built.bin"
buildFW "sdkconfig_jade_v1_1_prod"         "jade_${version}_11_ble.built.bin"
buildFW "sdkconfig_jade_noradio_prod"      "jade_${version}_10_noR.built.bin"
buildFW "sdkconfig_jade_v1_1_noradio_prod" "jade_${version}_11_noR.built.bin"

set +x
echo
echo "Results:"
for variant in {10,11}_{ble,noR}; do
  downloaded="jade_${version}_${variant}.bin"
  stripped="jade_${version}_${variant}_stripped.bin"
  built="jade_${version}_${variant}.built.bin"
  head -c -4096 $downloaded > $stripped
  expectedHash=$(sha256sum $stripped | awk '{print $1}')
  actualHash=$(sha256sum $built | awk '{print $1}')
  sha256sum *${variant}*.bin{,.gz}
  if [ "$expectedHash" == "$actualHash" ]; then
    echo "The Jade firmware version ${version} ${variant} is reproducible with above hashes."
  else
    echo "The Jade firmware version ${version} ${variant} is **not** reproducible with above hashes."
  fi
done
