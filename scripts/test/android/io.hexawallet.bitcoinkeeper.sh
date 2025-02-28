#!/bin/bash

repo=https://github.com/bithyve/bitcoin-keeper.git
tag="v$versionName"
builtApk=$workDir/app/android/app/build/outputs/apk/production/release/app-production-release.apk

test() {
  docker rmi bitcoin-keeper-builder -f
  
  docker build \
    --tag bitcoin-keeper-builder \
    --build-arg UID=$(id -u) \
    --build-arg TAG=$tag \
    --build-arg VERSION=$versionCode \
    --file $SCRIPT_DIR/test/android/io.hexawallet.bitcoinkeeper.dockerfile .
  
  docker run \
    --volume $workDir:/mnt \
    --rm \
    -u root \
    bitcoin-keeper-builder \
    bash -c \
    'find /app -name "*.apk" -type f | xargs -I {} cp {} /mnt/'
  
  # Find the copied APK in the mount directory and set as builtApk
  builtApk=$(find $workDir -name "*.apk" -type f)
  
  docker rmi bitcoin-keeper-builder -f
  docker image prune -f
}