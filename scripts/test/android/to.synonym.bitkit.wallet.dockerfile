FROM docker.io/node:18-bullseye-slim

ARG UID=1000
ARG TAG
ARG VERSION

RUN set -ex; \
    apt-get update; \
    DEBIAN_FRONTEND=noninteractive apt-get install --yes \
      -o APT::Install-Suggests=false --no-install-recommends \
      patch git openjdk-11-jre-headless openjdk-11-jdk curl; \
    rm -rf /var/lib/apt/lists/*; \
    deluser node; \
    useradd --uid $UID --create-home --shell /bin/bash appuser; \
    mkdir -p /Users/runner/work/1/; \
    chown -R appuser:appuser /Users/;

USER appuser

ENV ANDROID_SDK_ROOT="/home/appuser/sdk" \
    ANDROID_HOME="/home/appuser/sdk" \
    NODE_ENV="production"

RUN set -ex; \
    mkdir -p "/home/appuser/sdk/licenses"; \
    printf "\n24333f8a63b6825ea9c5514f83c2829b004d1fee" > "/home/appuser/sdk/licenses/android-sdk-license"; \
    cd /Users/runner/work/1/; \
    git clone --branch $TAG https://github.com/synonymdev/bitkit.git /Users/runner/work/1/s/;

WORKDIR /Users/runner/work/1/s/

RUN curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.1/install.sh | bash

ENV NVM_DIR="/home/appuser/.nvm"
RUN . "$NVM_DIR/nvm.sh" && nvm install $(cat .node-version) && nvm use $(cat .node-version) && npm install -g yarn

RUN . "$NVM_DIR/nvm.sh" && yarn install

RUN cp .env.development .env; \
    echo "sdk.dir=/home/appuser/sdk" > android/local.properties; \
    mkdir -p ~/.gradle; \
    echo "BITKIT_UPLOAD_STORE_FILE=debug.keystore" >> ~/.gradle/gradle.properties; \
    echo "BITKIT_UPLOAD_STORE_PASSWORD=android" >> ~/.gradle/gradle.properties; \
    echo "BITKIT_UPLOAD_KEY_ALIAS=androiddebugkey" >> ~/.gradle/gradle.properties; \
    echo "BITKIT_UPLOAD_KEY_PASSWORD=android" >> ~/.gradle/gradle.properties;

RUN . "$NVM_DIR/nvm.sh" && yarn bundle
