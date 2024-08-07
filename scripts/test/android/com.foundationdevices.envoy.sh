#!/bin/bash
repo="https://github.com/Foundation-Devices/envoy"
tag="v$versionName"
workDir="/tmp/test_com.foundationdevices.envoy"
builtApk="$workDir/build/app/outputs/flutter-apk/app-release.apk"

cleanup() {
  echo "Cleaning up..."
  cd /tmp
  rm -rf "$workDir"
}

test() {
  cleanup
  git clone --branch "$tag" --depth 1 "$repo" "$workDir"
  cd "$workDir" || { echo "Failed to change directory to $workDir"; return 1; }
  
  if [ ! -f "Dockerfile" ]; then
    echo "Error: Dockerfile not found in $workDir"
    return 1
  fi
  
  docker build --tag envoy_builder .
  
  docker run \
    --rm \
    --volume "$workDir:/app" \
    --workdir /app \
    --env ANDROID_SDK_ROOT=/root/Android/sdk \
    --env PATH="/root/.cargo/bin:/root/flutter/bin:$PATH" \
    envoy_builder \
    bash -c "
      source ~/.cargo/env
      ./build_ffi_android.sh
      flutter build apk --release
    "
  
  if [ ! -f "$builtApk" ]; then
    echo "Error: APK file not found at $builtApk"
    return 1
  fi
  
  echo "Build completed successfully"
  echo "APK location: $builtApk"
}

cd /tmp
test
trap cleanup EXIT