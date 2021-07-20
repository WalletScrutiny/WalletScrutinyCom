#!/bin/bash

test() {
  repo=https://github.com/airgap-it/airgap-vault
  tag=v$versionName
  builtApk=$workDir/app/airgap-vault-release-unsigned.apk
  
  prepare

  # cleanup
  podman rmi airgap-vault -f
  podman rm airgap-vault-build -f
  podman image prune -f
  # build
  sed -i -e "s/versionName \"0.0.0\"/versionName \"$versionName\"/g" android/app/build.gradle
  podman build -f build/android/Dockerfile -t airgap-vault --build-arg BUILD_NR="$versionCode" --build-arg VERSION="$versionName" .
  podman run --name "airgap-vault-build" airgap-vault echo "container ran."
  podman cp airgap-vault-build:/app/android-release-unsigned.apk airgap-vault-release-unsigned.apk
  podman rmi airgap-vault -f
  podman rm airgap-vault-build -f
  podman image prune -f
  
  result
}
