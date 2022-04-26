#!/bin/bash

repo=https://github.com/bitcoin-wallet/bitcoin-wallet
tag=v$versionName
builtApk=$workDir/app/wallet/build/outputs/apk/prod/release/bitcoin-wallet-prod-release-unsigned.apk

test() {
  podman run \
      -it \
      --rm \
      --device /dev/fuse \
      --cap-add SYS_ADMIN \
      --volume $workDir/app:/app \
      $wsContainer \
      bash -x -c 'apt update
        apt install -y disorderfs gradle
        mkdir /sorted/
        disorderfs --sort-dirents=yes --reverse-dirents=no /app/ /sorted/
        cd /sorted/
        yes | /opt/android-sdk/tools/bin/sdkmanager "build-tools;29.0.2"
        gradle clean :wallet:assProdRel
        $takeUserActionCommand'
}
