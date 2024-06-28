#!/bin/bash
repo=https://github.com/KomodoPlatform/komodo-wallet-mobile
tag="v$versionName"
builtApk=$workDir/build/app/outputs/flutter-apk/app-release.apk

prepare() {
  echo "Testing $appId from $repo revision $tag (revisionOverride: '$revisionOverride')..."
  mkdir -p $workDir
  cd $workDir
  echo "Trying to clone …"
  if [ -n "$revisionOverride" ]
  then
    git clone --quiet $repo . && git checkout "$revisionOverride" || exit 1
  else
    git clone --quiet --branch "$tag" --depth 1 $repo . || exit 1
  fi
  commit=$( git log -n 1 --pretty=oneline | sed 's/ .*//g' )
}

test() {
  curl -L https://raw.githubusercontent.com/KomodoPlatform/coins/master/coins --output assets/coins.json
  curl -L https://raw.githubusercontent.com/KomodoPlatform/coins/master/utils/coins_config.json --output assets/coins_config.json

  docker build -f $SCRIPT_DIR/test/android/com.komodoplatform.atomicdex.dockerfile -t komodo .

  docker run \
    --rm \
    --volume $PWD:/app \
    --name komodo-wallet-build \
    komodo \
    bash -c "mkdir -p /app/android/app/src/main/cpp/libs/arm64-v8a && \
        mkdir -p /app/android/app/src/main/cpp/libs/armeabi-v7a && \
        cd /app/android/app/src/main/cpp/libs/arm64-v8a && \
        wget https://github.com/KomodoPlatform/komodo-defi-framework/releases/download/v2.0.0-beta/mm2-b0fd99e84-android-aarch64-CI.zip && \
        unzip mm2-b0fd99e84-android-aarch64-CI.zip && \
        rm mm2-b0fd99e84-android-aarch64-CI.zip && \
        cd /app/android/app/src/main/cpp/libs/armeabi-v7a && \
        wget https://github.com/KomodoPlatform/komodo-defi-framework/releases/download/v2.0.0-beta/mm2-b0fd99e84-android-armv7-CI.zip && \
        unzip mm2-b0fd99e84-android-armv7-CI.zip && \
        rm mm2-b0fd99e84-android-armv7-CI.zip && \
        cd /app/ && \
        flutter pub get && \
        flutter build apk && \
        flutter build appbundle"
}

prepare
test
