#!/bin/bash

repo=https://github.com/horizontalsystems/unstoppable-wallet-android
tag=$versionName
# This is the expected location for test.sh
expectedApkPath=$workDir/app/app/build/outputs/apk/release/app-release-unsigned.apk

# Define the actual build paths for each flavor
baseApkPath=$workDir/app/app/build/outputs/apk/base/release/app-base-release.apk
fdroidApkPath=$workDir/app/app/build/outputs/apk/fdroid/release/app-fdroid-release-unsigned.apk
ciApkPath=$workDir/app/app/build/outputs/apk/ci/release/app-ci-release.apk

assembleBaseRelease="assembleBaseRelease"

test() {
  echo "===== Unstoppable Wallet Build Options ====="
  echo "As of version 0.42.1, Horizontal Systems has changed the build process to include multiple flavors."
  echo "The options are base, fdroid, or ci. By default, the script will build the base flavor."
  echo "If you want to test a different variant, replace assembleBaseRelease with either of these two:"
  echo "assembleFdroidRelease or assembleCiRelease. Then set the expectedApkPath variable to the correct path."
  
  podman run -it --volume $PWD:/mnt --workdir /mnt --rm $wsContainer bash -x -c \
      "apt update && DEBIAN_FRONTEND=noninteractive apt install openjdk-17-jdk --yes && ./gradlew clean :app:${assembleBaseRelease}"
  
  # Create the directory if it doesn't exist
  mkdir -p $(dirname "$expectedApkPath")
  
  # Determine which APK to use based on the gradle task
  if [[ ${assembleBaseRelease} == "assembleFdroidRelease" ]]; then
    builtApk=$fdroidApkPath
  elif [[ ${assembleBaseRelease} == "assembleCiRelease" ]]; then
    builtApk=$ciApkPath
  else
    builtApk=$baseApkPath
  fi
  
  # Set the builtApk variable to the expected path for test.sh
  cp "$builtApk" "$expectedApkPath"
}
