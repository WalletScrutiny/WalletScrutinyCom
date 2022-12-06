#!/bin/bash

repo=https://github.com/bitcoin-wallet/bitcoin-wallet
tag=v$versionName
builtApk=$workDir/app/wallet/build/outputs/apk/prod/release/bitcoin-wallet-prod-release-unsigned.apk

test() {
  podman run \
      -it \
      --rm \
      --volume $workDir/app:/app \
      ubuntu:jammy \
      bash -x -c "apt update
        apt -y upgrade
        apt install -y sdkmanager gradle openjdk-11-jdk-headless wget
        yes | sdkmanager --licenses >/dev/null || true
        cd /app
        gradle :wallet:assProdRel
        $takeUserActionCommand"
}
