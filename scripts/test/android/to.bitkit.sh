#!/bin/bash

repo=https://github.com/synonymdev/bitkit.git
tag="v$versionName"
builtApk=$workDir/app-release.apk

test() {
  podman rmi bitkit -f || true
  podman build \
    --tag bitkit \
    --cgroup-manager cgroupfs \
    --ulimit nofile=16384:16384 \
    --memory=6g \
    --build-arg UID=$(id -u) \
    --build-arg TAG=$tag \
    --file $SCRIPT_DIR/test/android/to.bitkit.dockerfile
  podman run \
    -it \
    --volume $workDir:/mnt \
    --rm \
    -u root \
    bitkit \
    bash -c \
      'cp /Users/runner/work/1/s/android/app/build/outputs/apk/release/*.apk /mnt/'

  podman rmi bitkit -f
  podman image prune -f
}
