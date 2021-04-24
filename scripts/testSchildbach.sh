#!/bin/bash

test() {
  repo=https://github.com/bitcoin-wallet/bitcoin-wallet
  tag=v$versionName
  builtApk=$workDir/app/wallet/build/outputs/apk/prod/release/bitcoin-wallet-prod-release-unsigned.apk
  
  prepare

  # build
  docker run -it --volume $workDir/app:/mnt --workdir /mnt --rm $wsContainer bash -x -c \
      'yes | /opt/android-sdk/tools/bin/sdkmanager "build-tools;29.0.2"; \
      apt update && apt install gradle -y; \
      gradle clean :wallet:assProdRel'
      
  result
}
