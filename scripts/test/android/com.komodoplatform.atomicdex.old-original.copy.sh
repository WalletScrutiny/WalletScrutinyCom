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
ENV FLUTTER_HOME=/opt/flutter
ENV PATH=\$PATH:\$FLUTTER_HOME/bin

RUN apt-get update && apt-get install -y curl git unzip xz-utils zip libglu1-mesa openjdk-8-jdk wget

RUN useradd -m developer
USER developer
WORKDIR /home/developer

RUN git clone https://github.com/flutter/flutter.git \$FLUTTER_HOME && \
    cd \$FLUTTER_HOME && \
    git checkout \$FLUTTER_VERSION && \
    flutter precache && \
    flutter doctor

WORKDIR /app
CMD ["flutter", "build", "apk", "--release", "--dart-define=screenshot=true"]
EOF

  docker build --rm --tag komodo-wallet-build .

  docker run \
    --rm \
    --volume $PWD:/app \
    --user $(id -u):$(id -g) \
    komodo-wallet-build

  docker rmi komodo-wallet-build -f
  docker image prune -f
}
