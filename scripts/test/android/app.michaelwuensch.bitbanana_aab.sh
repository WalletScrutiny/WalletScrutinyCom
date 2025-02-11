#!/bin/bash

# Executing this script with test.sh will only help to verify the github release (universal apk) not the PlayStore release (AAB -> device specific apks)
# Therefore use the apk found on the github releases when using this script.

repo=https://github.com/michaelWuensch/BitBanana
tag=v$versionName

test() {
  # build
  docker run --rm -v `pwd`:/project mingc/android-build-box:1.25.0 bash -c 'cd /project; ./gradlew bundleRelease'
  builtAab=$(ls $workDir/app/app/build/outputs/bundle/release/*.aab)

  docker rmi mingc/android-build-box:1.25.0 -f
  docker image prune -f
}
