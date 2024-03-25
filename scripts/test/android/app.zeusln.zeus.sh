#!/bin/bash

repo=https://github.com/ZeusLN/zeus
tag=v$versionName
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
  BUILDER_IMAGE="reactnativecommunity/react-native-android@sha256:7bbad62c74f01b2099163890fd11ab7b37e8a496528e6af2dfaa1f29369c2e24"
  podman run --rm --name zeus_builder_container -it -v `pwd`:/olympus/zeus $BUILDER_IMAGE bash -c \
    '
    echo "Uninstalling/reinstalling Node and npm"   
    apt-get update
    cd /usr/local/bin/
    rm node; rm npx; rm npm;
    curl -fsSL https://deb.nodesource.com/setup_18.x | bash -; apt-get install nodejs -y
    cd /
      echo -e "\n\n********************************\n*** Building Zeus...\n********************************\n" && \
      cd /olympus/zeus ; npm install -g npm@10.5.0 ;  yarn install --frozen-lockfile && \
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
