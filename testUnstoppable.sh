#!/bin/bash

test() {
  repo=https://github.com/horizontalsystems/unstoppable-wallet-android
  tag=$versionName
  builtApk=$workDir/app/app/build/outputs/apk/release/app-release-unsigned.apk
  
  prepare

  # build
  docker run -it --volume $PWD:/mnt --workdir /mnt --rm $wsDocker bash -x -c \
      './gradlew clean :app:assembleRelease'
      
  # collect results
  result
}
