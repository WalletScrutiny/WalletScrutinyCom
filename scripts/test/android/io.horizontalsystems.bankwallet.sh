#!/bin/bash

repo=https://github.com/horizontalsystems/unstoppable-wallet-android
tag=$versionName
# This is the expected location for test.sh
expectedApkPath=$workDir/app/app/build/outputs/apk/release/app-release-unsigned.apk

# Define the actual build paths for each flavor
baseApkPath=$workDir/app/app/build/outputs/apk/base/release/app-base-release.apk
fdroidApkPath=$workDir/app/app/build/outputs/apk/fdroid/release/app-fdroid-release-unsigned.apk
ciApkPath=$workDir/app/app/build/outputs/apk/ci/release/app-ci-release.apk

test() {
  echo "===== Unstoppable Wallet Build Options ====="
  echo "1. Base - Standard version (Google Play version)"
  echo "2. F-Droid - Open source version without proprietary components"
  echo "3. CI - Continuous Integration build with appCenter suffix"
  echo "Please select a build flavor (1-3): "
  read -r flavor_choice
  
  # Build only the selected flavor
  case $flavor_choice in
    1)
      echo "Building Base flavor..."
      build_task="assembleBaseRelease"
      ;;
    2)
      echo "Building F-Droid flavor..."
      build_task="assembleFdroidRelease"
      ;;
    3)
      echo "Building CI flavor..."
      build_task="assembleCiRelease"
      ;;
    *)
      echo "Invalid choice, defaulting to Base flavor"
      build_task="assembleBaseRelease"
      ;;
  esac
  
  podman run -it --volume $PWD:/mnt --workdir /mnt --rm $wsContainer bash -x -c \
      "apt update && DEBIAN_FRONTEND=noninteractive apt install openjdk-17-jdk --yes && ./gradlew clean :app:${build_task}"
  
  # Create the directory if it doesn't exist
  mkdir -p $(dirname "$expectedApkPath")
  
  # Copy the selected APK to the expected location
  case $flavor_choice in
    1)
      echo "Using Base flavor"
      cp "$baseApkPath" "$expectedApkPath"
      ;;
    2)
      echo "Using F-Droid flavor"
      cp "$fdroidApkPath" "$expectedApkPath"
      ;;
    3)
      echo "Using CI flavor"
      cp "$ciApkPath" "$expectedApkPath"
      ;;
    *)
      echo "Invalid choice, defaulting to Base flavor"
      cp "$baseApkPath" "$expectedApkPath"
      ;;
  esac
  
  # Set the builtApk variable to the expected path for test.sh
  builtApk=$expectedApkPath
}
