#!/bin/bash

repo=https://github.com/ACINQ/phoenix
tag="android-v$versionName"
builtApk="$workDir/app/phoenix-android/build/outputs/apk/release/phoenix-$versionCode-$versionName-mainnet-release.apk"

test() {
  podman build -t phoenix_build .
  podman run -it --rm --volume $PWD:/home/ubuntu/phoenix \
      --workdir /home/ubuntu/phoenix phoenix_build \
      bash -x -c "./gradlew :phoenix-android:assemble;
      $takeUserActionCommand" # just in case the compilation needs fixing, stop here and do not throw the docker container away just yet'

  podman image prune -f
}
