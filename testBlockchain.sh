#!/bin/bash

test() {
  repo=https://github.com/blockchain/My-Wallet-V3-Android
  tag="v$versionName($versionCode)"
  builtApk=$workDir/app/app/build/outputs/apk/envProd/release/blockchain-${versionName}-envProd-release-unsigned.apk
  
  prepare

  # build
  docker run -it --volume $PWD:/mnt --workdir /mnt --rm $wsDocker bash -x -c \
      './scripts/quick_start.sh; ./gradlew :app:assembleEnvProdRelease -x :app:lintVitalEnvProdRelease'
      
  # collect results
  result
}
