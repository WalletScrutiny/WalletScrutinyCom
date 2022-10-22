#!/bin/bash

repo=https://github.com/Blockstream/green_android/
tag=release_$versionName
builtApk="$workDir/app/green/build/outputs/apk/productionGoogle/release/BlockstreamGreen-v${versionName}-productionGoogle-release-unsigned.apk"

test() {
  podman run -it --volume $PWD:/mnt --rm $wsContainer bash -x -c "chmod 777 /tmp/;
      cd /mnt;
      apt update;
      DEBIAN_FRONTEND=noninteractive apt install -y curl jq openjdk-11-jdk;
      yes | /opt/android-sdk/tools/bin/sdkmanager \"build-tools;29.0.2\";
      ./gradlew -x test clean assembleProductionGoogleRelease;
      $takeUserActionCommand"
}
