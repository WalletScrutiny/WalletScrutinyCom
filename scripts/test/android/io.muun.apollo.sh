#!/bin/bash

repo=https://github.com/muun/apollo
tag=v$versionName
builtApk=$workDir/app/apk/apolloui-prod-release-unsigned.apk

test() {
  mkdir apk
  DOCKER_BUILDKIT=1 docker build -f android/Dockerfile -o apk .

  podman image prune -f
}
