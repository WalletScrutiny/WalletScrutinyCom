FROM docker.io/ubuntu:20.04
ARG version

RUN set -ex; \
    apt-get update; \
    DEBIAN_FRONTEND=noninteractive apt-get install --yes -o APT::Install-Suggests=false --no-install-recommends \
      curl \
      unzip \
      git \
      openjdk-11-jdk-headless; \
    rm -rf /var/lib/apt/lists/*; \
    useradd -ms /bin/bash appuser; \
    mkdir -p /olympus/ /opt/node/ /opt/yarn/ /opt/android/ndk/ /opt/android/licenses; \
    chown appuser:appuser /olympus/; \
    chown -R appuser:appuser /opt/;

USER appuser

ENV NODE_ENV="development" \
    ANDROID_SDK_ROOT="/opt/android" \
    ANDROID_HOME="/opt/android" \
    PATH="/opt/android/ndk/21.4.7075529/:/opt/node/bin/:/opt/yarn/node_modules/.bin/:$PATH"

USER appuser
WORKDIR /olympus/

RUN set -ex; \
    printf "\n24333f8a63b6825ea9c5514f83c2829b004d1fee" > "/opt/android/licenses/android-sdk-license"; \
    curl -o v${version}.zip -L https://github.com/ZeusLN/zeus/archive/refs/tags/v${version}.zip; \
    unzip v${version}.zip -d /olympus/; \ 
    rm v${version}.zip; \
    mv /olympus/zeus-${version} /olympus/zeus; \
    cd /opt/android/ndk/; \
    curl -o ndk21.zip -L https://dl.google.com/android/repository/android-ndk-r21e-linux-x86_64.zip; \
    echo "ad7ce5467e18d40050dc51b8e7affc3e635c85bd8c59be62de32352328ed467e  ndk21.zip" | sha256sum -c ; \
    unzip ndk21.zip; \
    rm ndk21.zip; \
    mv android-ndk-r21e /opt/android/ndk/21.4.7075529/; \
    cd /opt/node/; \
    curl -o node-v14.19.0-linux-x64.tar.gz -L https://nodejs.org/download/release/v14.19.0/node-v14.19.0-linux-x64.tar.gz; \
    echo "223ca31e3440b79a3fe6828161b1843743eaa7610a88c0e1ac1d8e1d815b44cd  node-v14.19.0-linux-x64.tar.gz" | sha256sum -c; \
    tar -xf node-v14.19.0-linux-x64.tar.gz --strip-components=1; \
    rm node-v14.19.0-linux-x64.tar.gz; \
    cd /opt/yarn/; \
    npm install yarn; \
    cd /olympus/zeus; \
    yarn install --frozen-lockfile; \
    cd /olympus/zeus/node_modules/@lightninglabs/lnc-rn; \
    bash fetch-libraries.sh; \
    cd /olympus/zeus/android; \
    ./gradlew assembleRelease;