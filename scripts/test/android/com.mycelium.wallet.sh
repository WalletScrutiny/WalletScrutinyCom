#!/bin/bash

repo=https://github.com/mycelium-com/wallet-android
tag="v$versionName"
builtApk=$workDir/app/mbw/build/outputs/apk/prodnet/release/mbw-prodnet-release.apk

test() {
  # a hack to fetch submodules through https instead of ssh
  sed -i 's/git@github.com:/https:\/\/github.com\//g' .gitmodules

  git submodule update --init --recursive
  podman build --tag mycelium_builder .

  # build
  podman run \
      --rm \
      --device /dev/fuse \
      --cap-add SYS_ADMIN \
      --security-opt apparmor=unconfined \
      --volume $workDir/app:/app \
      --interactive \
      --tty \
      mycelium_builder \
      bash -c "apt update;
        apt install -y disorderfs;
        mkdir /project/
        disorderfs --sort-dirents=yes --reverse-dirents=no /app/ /project/;
        cd /project/
        ./gradlew -x lint -x test clean :mbw:assembleProdnetRelease;
        $takeUserActionCommand"

  podman rmi mycelium_builder -f
  podman image prune -f
}
