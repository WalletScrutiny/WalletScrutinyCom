#!/bin/bash

test() {
  repo=https://github.com/LN-Zap/zap-android
  tag=v$versionName
# builtApk="$workDir/app/build/outputs/apk/release/*"
  
  prepare

  # build
  podman run --rm --volume=$PWD:/mnt --workdir /mnt mreichelt/android:latest bash -x -c \
      './gradlew assembleRelease'
  builtApk=$(ls $workDir/app/app/build/outputs/apk/release/*.apk)

  result
}
