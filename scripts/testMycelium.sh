#!/bin/bash

test() {
  buildTarget=$1
  repo=https://github.com/mycelium-com/wallet-android
  tag=$( echo "v$versionName" | sed 's/-TESTNET//g' )
  builtApk=$workDir/app/mbw/build/outputs/apk/prodnet/release/mbw-prodnet-release.apk

  prepare

  git clone https://github.com/mycelium-com/wallet-android-modularization-tools
  git submodule update --init --recursive
  docker build --tag mycelium_builder .
  
  # build
  sudo rm -rf $workDir/sorted
  mkdir $workDir/sorted
  sudo disorderfs --sort-dirents=yes --reverse-dirents=no --multi-user=yes $workDir/app $workDir/sorted
  docker run --volume $workDir/sorted:/mnt --workdir /mnt -it --rm mycelium_builder \
      bash -c "./gradlew -x lint -x test clean $buildTarget;chown $(id -u):$(id -g) -R /mnt/;
        echo 'CTRL-D to continue';
        bash"
  sudo umount $workDir/sorted

  result
}
