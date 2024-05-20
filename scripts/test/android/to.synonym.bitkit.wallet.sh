#!/bin/bash

repo=https://github.com/synonymdev/bitkit.git
# TODO: The tag should be passed from the test.sh script, update it later.
# That's because one can pass a different tag using revision-override .
# For now, change the hardcoded version name to test another release
# tag=$1
tag="beta-release-118"
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
    --file $SCRIPT_DIR/test/android/to.synonym.bitkit.wallet.dockerfile
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
