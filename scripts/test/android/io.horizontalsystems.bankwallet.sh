#!/bin/bash

repo=https://github.com/horizontalsystems/unstoppable-wallet-android
tag=$versionName
builtApk=$workDir/app/app/build/outputs/apk/release/app-release-unsigned.apk

test() {
  podman run -it --volume $PWD:/mnt --workdir /mnt --rm $wsContainer bash -x -c \
      'apt update && DEBIAN_FRONTEND=noninteractive apt install openjdk-11-jdk --yes && ./gradlew clean :app:assembleRelease'
}
