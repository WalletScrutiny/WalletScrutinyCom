FROM frolvlad/alpine-glibc

RUN set -ex; \
    apk update; \
    apk add --no-cache \
        git \
        npm \
        yarn \
        openjdk11; \
    adduser -D appuser; \
    mkdir -p "/Users/jenkins/.jenkins/workspace/Edge_edge-react-gui_master/"; \
    chown -R appuser:appuser /Users/
    
USER appuser

ENV NODE_ENV="development" \
    ANDROID_SDK_ROOT="/home/appuser/sdk/" \
    ANDROID_HOME="/home/appuser/sdk/" \
    AIRBITZ_API_KEY="74591cbad4a4938e0049c9d90d4e24091e0d4070" \
    BUGSNAG_API_KEY="5aca2dbe708503471d8137625e092675"

RUN set -ex; \
    mkdir -p "/home/appuser/sdk/licenses"; \
    printf "\n24333f8a63b6825ea9c5514f83c2829b004d1fee" > "/home/appuser/sdk/licenses/android-sdk-license"; \
    cd /Users/jenkins/.jenkins/workspace/Edge_edge-react-gui_master/; \
    git clone --branch v3.20.0 --depth 1 --no-tags --single-branch https://github.com/EdgeApp/edge-react-gui/ .

WORKDIR /Users/jenkins/.jenkins/workspace/Edge_edge-react-gui_master/

RUN set -ex; \
    yarnpkg install --frozen-lockfile --ignore-scripts; \
    yarnpkg prepare

RUN set -ex; \    
     cd /Users/jenkins/.jenkins/workspace/Edge_edge-react-gui_master/android/ ; \
     ./gradlew packageReleaseUniversalApk
