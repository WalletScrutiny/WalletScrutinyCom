FROM docker.io/node:18-bullseye-slim

ARG TAG
ARG VERSION

RUN set -ex; \
    apt-get update; \
    DEBIAN_FRONTEND=noninteractive apt-get install --yes \
      -o APT::Install-Suggests=false --no-install-recommends \
      patch git openjdk-17-jre-headless openjdk-17-jdk \
      curl unzip zip; \
    rm -rf /var/lib/apt/lists/*; \
    deluser node; \
    mkdir -p /Users/runner/work/1/;


ENV ANDROID_SDK_ROOT="/root/sdk" \
    ANDROID_HOME="/root/sdk" \
    NODE_ENV="production" \
    JAVA_HOME="/usr/lib/jvm/java-17-openjdk-amd64"

RUN set -ex; \
    mkdir -p "${ANDROID_HOME}/cmdline-tools"; \
    cd "${ANDROID_HOME}/cmdline-tools"; \
    curl -O https://dl.google.com/android/repository/commandlinetools-linux-9477386_latest.zip; \
    unzip commandlinetools-linux-9477386_latest.zip; \
    mv cmdline-tools latest; \
    rm commandlinetools-linux-9477386_latest.zip; \
    echo "y" | "${ANDROID_HOME}/cmdline-tools/latest/bin/sdkmanager" --install "platform-tools" "platforms;android-33" "build-tools;33.0.0"; \
    mkdir -p "${ANDROID_HOME}/licenses"; \
    printf "\n24333f8a63b6825ea9c5514f83c2829b004d1fee" > "${ANDROID_HOME}/licenses/android-sdk-license"; \
    printf "\n84831b9409646a918e30573bab4c9c91346d8abd" > "${ANDROID_HOME}/licenses/android-sdk-preview-license";

RUN set -ex; \
    cd /Users/runner/work/1/; \
    git clone --branch $TAG https://github.com/BlueWallet/BlueWallet /Users/runner/work/1/s/; \
    echo "sdk.dir=${ANDROID_HOME}" > /Users/runner/work/1/s/android/local.properties;

WORKDIR /Users/runner/work/1/s/

RUN set -ex; \
    npm config set fetch-retry-maxtimeout 600000; \
    npm config set fetch-retry-mintimeout 100000; \
    npm install --production --no-optional --omit=optional --no-audit --no-fund --ignore-scripts; \
    npm run postinstall; \
    # Work around issue with realm: https://github.com/realm/realm-js/issues/6204#issuecomment-1772638401
    rm -rf node_modules/realm; npm install realm; \
    echo '"master"' > current-branch.json;

RUN set -ex; \
    cd /Users/runner/work/1/s/android; \
    chmod +x ./gradlew; \
    ./gradlew assembleRelease \
        -Dorg.gradle.internal.http.socketTimeout=600000 \
        -Dorg.gradle.internal.http.connectionTimeout=600000