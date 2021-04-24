#!/bin/bash

test() {
  repo=https://github.com/Blockstream/green_android/
  tag=release_$versionName
  builtApk=$workDir/app/app/build/outputs/apk/production/release/app-production-release-unsigned.apk
  
  prepare

  # build
  podman run -it --volume $PWD:/mnt --workdir /mnt --rm $wsContainer bash -x -c 'apt update; \
      apt install -y curl; \
      ./app/fetch_gdk_binaries.sh; \
      yes | /opt/android-sdk/tools/bin/sdkmanager "build-tools;29.0.2"; \
      ./gradlew -x test clean assembleProductionRelease'
      
  result
}
