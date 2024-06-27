#!/bin/bash
repo=https://github.com/KomodoPlatform/komodo-wallet-mobile
tag="v$versionName"
builtApk=$workDir/build/app/outputs/flutter-apk/app-release.apk

prepare() {
  echo "Testing $appId from $repo revision $tag (revisionOverride: '$revisionOverride')..."
  rm -rf "$workDir" || exit 1
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

  cat << EOF > Dockerfile
FROM ubuntu:20.04

ENV DEBIAN_FRONTEND=noninteractive
ENV FLUTTER_VERSION=2.8.1
ENV FLUTTER_HOME=/home/developer/flutter
ENV PATH=\$PATH:\$FLUTTER_HOME/bin:/opt/android-sdk/platform-tools:/opt/android-sdk/tools/bin

RUN apt-get update && apt-get install -y \
    curl git unzip xz-utils zip libglu1-mesa openjdk-8-jdk wget

# Install Android SDK
RUN mkdir -p /opt/android-sdk && cd /opt/android-sdk && \
    wget https://dl.google.com/android/repository/commandlinetools-linux-6858069_latest.zip && \
    unzip commandlinetools-linux-6858069_latest.zip && rm commandlinetools-linux-6858069_latest.zip && \
    yes | ./cmdline-tools/bin/sdkmanager --sdk_root=/opt/android-sdk --licenses && \
    ./cmdline-tools/bin/sdkmanager --sdk_root=/opt/android-sdk "platform-tools" "platforms;android-30" "build-tools;30.0.3"

RUN useradd -m developer
USER developer
WORKDIR /home/developer

RUN git config --global --add safe.directory /home/developer/flutter
RUN git clone https://github.com/flutter/flutter.git \$FLUTTER_HOME && \
    cd \$FLUTTER_HOME && \
    git checkout \$FLUTTER_VERSION && \
    flutter precache && \
    flutter doctor

WORKDIR /app
CMD ["flutter", "build", "apk", "--release", "--dart-define=screenshot=true"]
EOF

  docker build --tag komodo-wallet-build .

  docker run \
    --rm \
    --volume $PWD:/app \
    --user $(id -u):$(id -g) \
    komodo-wallet-build

  docker rmi komodo-wallet-build -f
  docker image prune -f
}

prepare
test
