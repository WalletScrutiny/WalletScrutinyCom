#!/bin/bash

test() {
  buildTarget=$1
  repo=https://github.com/mycelium-com/wallet-android
  tag=$( echo "v$versionName" | sed 's/-TESTNET//g' )
  builtApk=$workDir/app/mbw/build/outputs/apk/prodnet/release/mbw-prodnet-release.apk

  prepare

  git clone https://github.com/mycelium-com/wallet-android-modularization-tools
  git submodule update --init --recursive
  podman build --tag mycelium_builder .
  
  # build
  podman run \
      --rm \
      --device /dev/fuse \
      --cap-add SYS_ADMIN \
      --volume $workDir/app:/app \
      --interactive \
      --tty \
      mycelium_builder \
      bash -c "apt update;
        apt install -y disorderfs;
        mkdir /sorted/
        disorderfs --sort-dirents=yes --reverse-dirents=no /app/ /sorted/;
        cd /sorted/
        ./gradlew -x lint -x test clean $buildTarget;
        echo 'CTRL-D to continue';
        bash"

  result
}
