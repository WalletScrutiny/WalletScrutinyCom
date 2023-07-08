#!/bin/bash

repo=https://github.com/ZeusLN/zeus
tag=v$versionName
# builtApk="$workDir/app/build/outputs/apk/release/*"

test() {
  # build
  podman build \
    --rm \
    --ulimit nofile=8192:8192 \
    -t zeus_rb_build_ubuntu_base \
    --build-arg version=$versionName \
    -f ../container/app.zeusln.zeus
  builtApk=$(ls $workDir/app/app/build/outputs/apk/release/*.apk)
}
