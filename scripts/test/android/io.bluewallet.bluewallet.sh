#!/bin/bash

repo=https://github.com/BlueWallet/BlueWallet
tag="v$versionName"
builtApk=$workDir/app-release-unsigned.apk

test() {
  podman rmi bluewallet -f
  podman build --tag bluewallet --cgroup-manager cgroupfs --ulimit nofile=16384:16384 \
    --build-arg UID=$(id -u) --build-arg TAG=$tag --build-arg VERSION=$versionCode \
    --file $SCRIPT_DIR/test/container/io.bluewallet.bluewallet
  podman run -it --volume $workDir:/mnt --rm -u root bluewallet bash -c \
      'cp /Users/runner/work/1/s/android/app/build/outputs/apk/release/*.apk /mnt/'

  podman rmi bluewallet -f
  podman image prune -f
}
