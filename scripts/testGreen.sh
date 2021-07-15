#!/bin/bash

test() {
  repo=https://github.com/Blockstream/green_android/
  tag=release_$versionName
  builtApk=$workDir/app/green/build/outputs/apk/production/release/green-production-release-unsigned.apk
  
  prepare

  # build
  podman run -it --volume $PWD:/mnt --rm $wsContainer bash -x -c 'cd /mnt;
      apt update;
      apt install -y curl jq;
      yes | /opt/android-sdk/tools/bin/sdkmanager "build-tools;29.0.2";
      ./gradlew -x test clean assembleProductionRelease
      $takeUserActionCommand'
      
  result
}
