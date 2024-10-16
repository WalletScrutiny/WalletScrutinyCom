#!/bin/bash

repo=https://github.com/ZeusLN/zeus
tag=v$versionName

# Determine architecture based on version code
case $(($versionCode % 10)) in
  1) architecture="armeabi-v7a" ;;
  2) architecture="x86" ;;
  3) architecture="arm64-v8a" ;;
  4) architecture="x86_64" ;;
  *) echo "Invalid number ending, please provide a number ending in 1, 2, 3, or 4." >&2; exit 1 ;;
esac

builtApk="$workDir/app/android/app/build/outputs/apk/release/zeus-$architecture.apk"

test() {
  # build
  BUILDER_IMAGE="reactnativecommunity/react-native-android@sha256:6607421944d844b82e4d05df50c11dc9fa455108222d63475cd3a0f62465fbda"
  CONTAINER_NAME="zeus_builder_container"
  ZEUS_PATH=/olympus/zeus

  echo "Building Zeus for architecture: $architecture using container"

  # Check if the container exists, and if so, remove it
  container_exists=$(podman ps -a | grep $CONTAINER_NAME | wc -l)
  if [ "$container_exists" -eq "1" ]; then
      echo "Container '$CONTAINER_NAME' exists. Removing..."
      podman rm -f $CONTAINER_NAME
  fi

  # Run the Podman command
  podman run --rm --name $CONTAINER_NAME -v "$(pwd):$ZEUS_PATH" $BUILDER_IMAGE bash -c \
       'echo -e "\n\n********************************\n*** Building ZEUS...\n********************************\n" && \
        cd /olympus/zeus ; yarn install --frozen-lockfile && \
        cd /olympus/zeus/android ; ./gradlew app:assembleRelease && \
        echo -e "\n\n********************************\n**** APKs and SHA256 Hashes\n********************************\n" && \
        cd /olympus/zeus && \
        for f in android/app/build/outputs/apk/release/*.apk;
        do
              RENAMED_FILENAME=$(echo $f | sed -e "s/app-/zeus-/" | sed -e "s/-release-unsigned//")
              mv $f $RENAMED_FILENAME
              sha256sum $RENAMED_FILENAME
        done && \
        echo -e "\n" '

  # Verify that the APK was built successfully
  if [ ! -f "$builtApk" ]; then
    echo "Error: Built APK not found at $builtApk"
    exit 1
  fi
}
