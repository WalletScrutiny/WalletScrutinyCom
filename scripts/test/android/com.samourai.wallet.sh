#!/bin/bash

repo=https://code.samourai.io/wallet/samourai-wallet-android
tag=$versionName
builtApk=$workDir/app/app/build/outputs/apk/production/release/app-production-release-unsigned.apk

test() {
  podman run -it --rm --volume $PWD:/mnt --workdir=/mnt $wsContainer bash -x -c \
        'apt update && DEBIAN_FRONTEND=noninteractive apt install openjdk-11-jdk --yes && ./gradlew assembleRelease'
}
