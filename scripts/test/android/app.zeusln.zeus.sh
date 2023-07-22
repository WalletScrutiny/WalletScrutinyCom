#!/bin/bash

repo=https://github.com/ZeusLN/zeus
tag=v$versionName
builtApk="$workDir/app/android/app/build/outputs/apk/release/zeus-universal.apk"

test() {
  # build
  BUILDER_IMAGE="reactnativecommunity/react-native-android@sha256:7bbad62c74f01b2099163890fd11ab7b37e8a496528e6af2dfaa1f29369c2e24"
  podman run --rm --name zeus_builder_container -it -v `pwd`:/olympus/zeus $BUILDER_IMAGE bash -c \
    'echo -e "\n\n********************************\n*** Building Zeus...\n********************************\n" && \
      cd /olympus/zeus ; yarn install --frozen-lockfile && \
      cd /olympus/zeus/node_modules/@lightninglabs/lnc-rn ; bash fetch-libraries.sh && \
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
}
