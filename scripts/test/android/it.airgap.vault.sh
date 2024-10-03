#!/bin/bash

repo=https://github.com/airgap-it/airgap-vault
tag=v$versionName
builtApk=$workDir/app/airgap-vault-release-unsigned.apk

test() {
  # cleanup
  docker rmi airgap-vault -f
  docker rm airgap-vault-build -f
  docker image prune -f
  # build
  sed -i -e "s/versionName \"0.0.0\"/versionName \"$versionName\"/g" android/app/build.gradle
  docker build -f build/android/Dockerfile -t airgap-vault --ulimit=nofile=10000:10000 --build-arg BUILD_NR="$versionCode" --build-arg VERSION="$versionName" .
  docker run --name "airgap-vault-build" airgap-vault echo "container ran."
  docker cp airgap-vault-build:/app/android-release-unsigned.apk airgap-vault-release-unsigned.apk
  docker rmi airgap-vault -f
  docker rm airgap-vault-build -f
  docker image prune -f
}
