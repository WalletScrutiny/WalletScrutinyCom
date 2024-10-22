#!/usr/bin/env nix-shell
#! nix-shell -i bash --pure
#! nix-shell android-shell2.nix

takeUserActionCommand='echo "CTRL-D to continue";
  bash'
versionName=10.16
workDir=/tmp/test_de.schildbach.wallet
repo=https://github.com/bitcoin-wallet/bitcoin-wallet
tag=v$versionName
builtApk=$workDir/app/wallet/build/outputs/apk/prod/release/bitcoin-wallet-prod-release-unsigned.apk

test() {
  sortedDir="/tmp/sorted/"

  echo "Setting up build directory with disorderfs..."
  
  # Check if the directory exists, and remove it if it does
  if [ -d "$sortedDir" ]; then
    echo "Directory $sortedDir exists. Deleting it."
    rm -rf "$sortedDir"
  fi

  # Create the directory
  mkdir "$sortedDir"

  # Use disorderfs to ensure deterministic builds
  disorderfs --sort-dirents=yes --reverse-dirents=no $workDir/app "$sortedDir"

  echo "Building APK with Gradle..."
  cd "$sortedDir"
  
  ANDROID_HOME=/opt/android-sdk

  echo "ANDROID_HOME=$ANDROID_HOME"
  
  gradle \
    --no-build-cache \
    --no-daemon \
    --no-parallel \
    clean :wallet:assembleRelease

  echo "Executing user action: $takeUserActionCommand"
  $takeUserActionCommand
}

# Call the test function
test
