FROM frolvlad/alpine-glibc

ARG REVISION
RUN set -ex; \
    apk update; \
    apk add --no-cache \
        openjdk8 \
        git \
        bash

ENV ANDROID_SDK_ROOT="/root/app/sdk" \
    ANDROID_HOME="/root/app/sdk"

RUN set -ex; \
    mkdir -p "/root/app/sdk/licenses" "/root/app/blockchain/" "/root/app/unzip"; \
    printf "\n24333f8a63b6825ea9c5514f83c2829b004d1fee" > "/root/app/sdk/licenses/android-sdk-license"; \
    printf '{\n"supportedAbis": ["arm64-v8a", "armeabi-v7a", "armeabi"],\n"supportedLocales": ["en-US"],\n"screenDensity": 560,\n"sdkVersion": 30\n}' > /root/app/devicespec1.json; \
    cd /root/app/sdk/; \
    wget https://github.com/google/bundletool/releases/download/1.7.1/bundletool-all-1.7.1.jar; \    
    echo "72d930df2b692347abcfa787d2dcfe4d08c19812ab7aedbc8db5546aa4fcb7a2  bundletool-all-1.7.1.jar" | sha256sum -c; \    
    cd /root/app/blockchain/ ; \
    git clone https://github.com/blockchain/My-Wallet-V3-Android/
RUN cd /root/app/blockchain/My-Wallet-V3-Android ;\
    git checkout "$REVISION"; \
    ./scripts/quick_start.sh; \
    sed -i 's/piuk.blockchain.android.dev/piuk.blockchain.android/g' /root/app/blockchain/My-Wallet-V3-Android/app/src/env/google-services.json;

WORKDIR /root/app/blockchain/My-Wallet-V3-Android/

RUN set -ex; \
    ./gradlew :app:assembleEnvProdRelease -x :app:lintVitalEnvProdRelease; \
    ./gradlew :app:bundleEnvProdRelease -x :app:lintVitalEnvProdRelease; \
    java -jar /root/app/sdk/bundletool-all-1.7.1.jar build-apks --bundle=/root/app/blockchain/My-Wallet-V3-Android/app/build/outputs/bundle/envProdRelease/blockchain-8.9.0-envProd-release.aab --output=/root/app/blockchain-all.apks; \
    java -jar /root/app/sdk/bundletool-all-1.7.1.jar build-apks --bundle=/root/app/blockchain/My-Wallet-V3-Android/app/build/outputs/bundle/envProdRelease/blockchain-8.9.0-envProd-release.aab --mode=universal --output=/root/app/blockchain-universal.apks; \
    java -jar /root/app/sdk/bundletool-all-1.7.1.jar extract-apks --apks=/root/app/blockchain-all.apks --output-dir=/root/app/blockchain-devicespec1.apks --device-spec=/root/app/devicespec1.json;