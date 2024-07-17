FROM docker.io/library/debian:bullseye-slim

ARG UID=1000
ARG TAG

# Retry function. Had to add it because this script used to fail a lot
# during the apt-get install part.
# Also defined it in a shell script file to avoid issues with Docker RUN commands
RUN set -ex; \
    echo '#!/bin/sh' > /usr/local/bin/retry; \
    echo 'n=0; max=5; delay=5;' >> /usr/local/bin/retry; \
    echo 'while true; do' >> /usr/local/bin/retry; \
    echo '  "$@" && break || {' >> /usr/local/bin/retry; \
    echo '    if [ $n -lt $max ]; then' >> /usr/local/bin/retry; \
    echo '      n=$(expr $n + 1);' >> /usr/local/bin/retry; \
    echo '      echo "Command failed. Attempt $n/$max:";' >> /usr/local/bin/retry; \
    echo '      sleep $delay;' >> /usr/local/bin/retry; \
    echo '    else' >> /usr/local/bin/retry; \
    echo '      echo "The command has failed after $n attempts.";' >> /usr/local/bin/retry; \
    echo '      exit 1;' >> /usr/local/bin/retry; \
    echo '    fi;' >> /usr/local/bin/retry; \
    echo '  }' >> /usr/local/bin/retry; \
    echo 'done' >> /usr/local/bin/retry; \
    chmod +x /usr/local/bin/retry

RUN set -ex; \
    # Update and install dependencies with retry mechanism
    retry apt-get update; \
    DEBIAN_FRONTEND=noninteractive retry apt-get install --yes \
      -o APT::Install-Suggests=false --no-install-recommends \
      patch git openjdk-17-jre-headless openjdk-17-jdk curl; \
    rm -rf /var/lib/apt/lists/*; \
    useradd --uid $UID --create-home --shell /bin/bash appuser; \
    mkdir -p /Users/runner/work/1/; \
    chown -R appuser:appuser /Users/

USER appuser

ENV ANDROID_SDK_ROOT="/home/appuser/sdk" \
    ANDROID_HOME="/home/appuser/sdk"

RUN set -ex; \
    mkdir -p "/home/appuser/sdk/licenses"; \
    printf "\n24333f8a63b6825ea9c5514f83c2829b004d1fee" > "/home/appuser/sdk/licenses/android-sdk-license"; \
    cd /Users/runner/work/1/; \
    git clone --branch $TAG https://github.com/synonymdev/bitkit.git /Users/runner/work/1/s/

WORKDIR /Users/runner/work/1/s/

RUN curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.1/install.sh | bash

# We need to use dev for node_env so that yarn installs the dev dependencies (needed for building)
ENV NVM_DIR="/home/appuser/.nvm" \
    NODE_ENV="development"

RUN . "$NVM_DIR/nvm.sh" && \
    nvm install $(cat .node-version) && \
    nvm use $(cat .node-version) && \
    npm install -g yarn && \
    yarn install --frozen-lockfile

ENV NODE_ENV="production"

RUN cp .env.development .env; \
    echo "sdk.dir=/home/appuser/sdk" > android/local.properties; \
    mkdir -p ~/.gradle; \
    echo "BITKIT_UPLOAD_STORE_FILE=debug.keystore" >> ~/.gradle/gradle.properties; \
    echo "BITKIT_UPLOAD_STORE_PASSWORD=android" >> ~/.gradle/gradle.properties; \
    echo "BITKIT_UPLOAD_KEY_ALIAS=androiddebugkey" >> ~/.gradle/gradle.properties; \
    echo "BITKIT_UPLOAD_KEY_PASSWORD=android" >> ~/.gradle/gradle.properties; \
    echo "org.gradle.daemon=false" >> ~/.gradle/gradle.properties; \
    echo "org.gradle.jvmargs=-Xmx2g -XX:MaxMetaspaceSize=512m -XX:+HeapDumpOnOutOfMemoryError -Dfile.encoding=UTF-8" >> ~/.gradle/gradle.properties

RUN . "$NVM_DIR/nvm.sh" && yarn bundle
