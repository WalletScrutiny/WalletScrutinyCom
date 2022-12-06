FROM frolvlad/alpine-glibc

RUN set -ex; \
    apk update; \
    apk add --no-cache \
        git \
        npm \
        yarn \
        openjdk11; \
    adduser -D appuser;
    
USER appuser

ENV NODE_ENV="development" \
    ANDROID_SDK_ROOT="/home/appuser/app/sdk/" \
    ANDROID_HOME="/home/appuser/app/sdk/"

RUN set -ex; \
    mkdir -p "/home/appuser/app/sdk/licenses" "/home/appuser/app/edge"; \
    printf "\n24333f8a63b6825ea9c5514f83c2829b004d1fee" > "/home/appuser/app/sdk/licenses/android-sdk-license"; \
    cd /home/appuser/app/edge/; \
    git clone https://github.com/EdgeApp/edge-react-gui/; \
    cd /home/appuser/app/edge/edge-react-gui/;

WORKDIR /home/appuser/app/edge/

RUN set -ex; \
    cd edge-react-gui; \
    git checkout v2.25.0; \
    yarnpkg install --frozen-lockfile --ignore-optional --ignore-scripts; \
    yarnpkg prepare; \
    cd android; \
    ./gradlew assembleRelease
