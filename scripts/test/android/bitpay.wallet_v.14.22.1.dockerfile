# Use an official Node runtime as a parent image
FROM node:18-slim

# Install necessary tools and dependencies
RUN set -ex; \
    mkdir -p /usr/share/man/man1/; \
    apt-get update || (sleep 10 && apt-get update) || (sleep 30 && apt-get update); \
    DEBIAN_FRONTEND=noninteractive \
    apt-get install --yes -o APT::Install-Suggests=false \
    --no-install-recommends \
    openjdk-17-jdk \
    git \
    wget \
    unzip \
    ca-certificates \
    || (sleep 10 && apt-get install --yes -o APT::Install-Suggests=false \
    --no-install-recommends \
    openjdk-11-jdk \
    git \
    wget \
    unzip \
    ca-certificates); \
    rm -rf /var/lib/apt/lists/*; \
    useradd -ms /bin/bash appuser; \
    echo "session required pam_limits.so" >> /etc/pam.d/common-session; \
    echo "appuser soft nofile 400000" >> /etc/security/limits.conf; \
    echo "appuser hard nofile 600000" >> /etc/security/limits.conf

# Download and install Android SDK Command-line tools
RUN set -ex; \
    mkdir -p /root/app/sdk/licenses /root/app/blockchain /root/app/unzip; \
    printf "\n24333f8a63b6825ea9c5514f83c2829b004d1fee" > /root/app/sdk/licenses/android-sdk-license; \
    printf '{\n"supportedAbis": ["arm64-v8a", "armeabi-v7a", "armeabi"],\n"supportedLocales": ["en-US"],\n"screenDensity": 560,\n"sdkVersion": 30\n}' > /root/app/devicespec1.json; \
    cd /root/app/sdk/; \
    wget https://github.com/google/bundletool/releases/download/1.7.1/bundletool-all-1.7.1.jar; \
    echo "72d930df2b692347abcfa787d2dcfe4d08c19812ab7aedbc8db5546aa4fcb7a2 bundletool-all-1.7.1.jar" | sha256sum -c

USER appuser

ENV ANDROID_SDK_ROOT="/home/appuser/app/sdk" \
    ANDROID_HOME="/home/appuser/app/sdk" \
    NODE_ENV="development" \
    PATH="$PATH:/home/appuser/app/sdk/cmdline-tools/tools/bin"

# Set up the Android SDK
RUN set -ex; \
    mkdir -p /home/appuser/app/sdk/cmdline-tools && cd /home/appuser/app/sdk/cmdline-tools && \
    wget https://dl.google.com/android/repository/commandlinetools-linux-8512546_latest.zip -O tools.zip && \
    unzip tools.zip && \
    rm tools.zip && \
    mv cmdline-tools tools && \
    yes | sdkmanager --licenses && \
    sdkmanager "platform-tools" "platforms;android-33" "build-tools;33.0.0" "ndk;23.1.7779620"

# Clone the BitPay repository
RUN set -ex; \
    mkdir -p "/home/appuser/app/sdk/licenses" "/home/appuser/app/bitpay/"; \
    printf "\n24333f8a63b6825ea9c5514f83c2829b004d1fee" > \
    "/home/appuser/app/sdk/licenses/android-sdk-license"; \
    cd /home/appuser/app/bitpay/; \
    git clone https://github.com/bitpay/bitpay-app/; \
    cd bitpay-app; \
    git fetch --all --tags; \
    git checkout tags/v.14.22.1

WORKDIR /home/appuser/app/bitpay/bitpay-app

# Configure the project
RUN set -ex; \
    echo '{ "project_info": { "project_number": "623252783566", "firebase_url": "https://blockchaintest-ecd1c.firebaseio.com", "project_id": "blockchaintest-ecd1c", "storage_bucket": "blockchaintest-ecd1c.appspot.com" }, "client": [ { "client_info": { "mobilesdk_app_id": "1:623252783566:android:02baff6e6c46ed96232b9f", "android_client_info": { "package_name": "com.bitpay.wallet" } }, "oauth_client": [ { "client_id": "623252783566-o6j47jlpan97fnibnr0vosvc4lh71sm1.apps.googleusercontent.com", "client_type": 3 } ], "api_key": [ { "current_key": "INSERT KEY HERE" } ], "services": { "appinvite_service": { "other_platform_oauth_client": [ { "client_id": "623252783566-o6j47jlpan97fnibnr0vosvc4lh71sm1.apps.googleusercontent.com", "client_type": 3 } ] } } } ], "configuration_version": "1" }' > /home/appuser/app/bitpay/bitpay-app/google-services.json; \
    cd /home/appuser/app/bitpay/bitpay-app; \
    if [ -f build.gradle ]; then \
        sed -i 's/ext.kotlinVersion = .*/ext.kotlinVersion = "1.7.10"/' build.gradle; \
    fi; \
    if [ -f android/app/build.gradle ]; then \
    sed -i 's/id "kotlin-android" version .*/id "kotlin-android" version "1.7.10"/' android/app/build.gradle; \
    mkdir -p android/app; \
    if [ ! -f android/app/debug.keystore ]; then \
        keytool -genkey -v -keystore android/app/debug.keystore -storepass android -alias androiddebugkey -keypass android -keyalg RSA -keysize 2048 -validity 10000 -dname "CN=Android Debug,O=Android,C=US"; \
    fi; \
    sed -i '/android {/a \    signingConfigs {\n        release {\n            storeFile file("debug.keystore")\n            storePassword "android"\n            keyAlias "androiddebugkey"\n            keyPassword "android"\n        }\n    }' android/app/build.gradle; \
    sed -i '/buildTypes {/a \        release {\n            signingConfig signingConfigs.release\n        }' android/app/build.gradle; \
fi; \
    yarn cache clean; \
    rm -rf node_modules; \
    yarn install; \
    if [ -f android/gradle/wrapper/gradle-wrapper.properties ]; then \
        sed -i 's/distributionUrl=.*/distributionUrl=https\:\/\/services.gradle.org\/distributions\/gradle-7.6.1-all.zip/' android/gradle/wrapper/gradle-wrapper.properties; \
    fi; \
    yarn run build:android:release --verbose
