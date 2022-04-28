#!/bin/bash

repo=https://github.com/ACINQ/phoenix
tag="android-legacy-v$versionName"
builtApk="$workDir/app/apk/release/phoenix-$versionCode-$versionName-mainnet-universal-release.apk"

test() {
  podman build -t phoenix_build .
  podman run -it --rm --volume $PWD:/home/ubuntu/phoenix/app/build/outputs \
      --workdir /home/ubuntu/phoenix phoenix_build \
      bash -x -c './gradlew assemble;
      $takeUserActionCommand # just in case the compilation needs fixing, stop here and do not throw the docker container away just yet'

  podman rmi phoenix_build -f
  podman image prune -f
}
