FROM docker.io/node:16.20.0-bullseye-slim

ARG UID=1000
ARG TAG
ARG VERSION

RUN set -ex; \
    apt-get update; \
    DEBIAN_FRONTEND=noninteractive apt-get install --yes \
      -o APT::Install-Suggests=false --no-install-recommends \
      patch git openjdk-11-jre-headless; \
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
    git clone --branch $TAG https://github.com/BlueWallet/BlueWallet /Users/runner/work/1/s/;

WORKDIR /Users/runner/work/1/s/

RUN set -ex; \
    npm install --production --no-optional --omit=optional --no-audit --no-fund --ignore-scripts; \
    npm run postinstall; \
    # Work around issue with realm: https://github.com/realm/realm-js/issues/6204#issuecomment-1772638401
    rm -rf node_modules/realm; npm install realm; \
    echo '"master"' > current-branch.json;

RUN set -ex; \
    cd /Users/runner/work/1/s/android; \
    ./gradlew assembleRelease
