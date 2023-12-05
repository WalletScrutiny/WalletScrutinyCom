#!/bin/bash

repo=https://github.com/bitcoin-wallet/bitcoin-wallet
tag=v$versionName
builtApk=$workDir/app/wallet/build/outputs/apk/prod/release/bitcoin-wallet-prod-release-unsigned.apk

test() {
  podman run \
      --rm \
      --device /dev/fuse \
      --cap-add SYS_ADMIN \
      --security-opt apparmor=unconfined \
      --volume $workDir/app:/app \
      --interactive \
      --tty \
      ubuntu:jammy \
      bash -x -c "apt update
        apt -y upgrade
        apt install -y sdkmanager gradle openjdk-11-jdk-headless wget disorderfs
        yes | sdkmanager --licenses >/dev/null || true
        mkdir /sorted/
        disorderfs --sort-dirents=yes --reverse-dirents=no /app/ /sorted/
        cd /sorted/
        ANDROID_HOME=/opt/android-sdk gradle --no-build-cache --no-daemon --no-parallel clean :wallet:assembleRelease
        $takeUserActionCommand"
}
