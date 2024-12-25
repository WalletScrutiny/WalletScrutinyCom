# <----- how to run ----->
# mkdir build
# docker build -f cakeRELEASE.Dockerfile -t cake .
# docker create -it --name cake cake bash
# docker cp cake:/build/. build/

# Base image with Flutter
FROM instrumentisto/flutter:3.24.0

# Set environment variables
ENV STORE_PASS=test@cake_wallet \
    KEY_PASS=test@cake_wallet \
    ANDROID_ROOT=/usr/local/lib/android \
    ANDROID_SDK_ROOT=/usr/local/lib/android/sdk \
    ANDROID_HOME=/usr/local/lib/android/sdk \
    ANDROID_NDK_HOME=/usr/local/lib/android/sdk/ndk/27.1.12297006 \
    ANDROID_NDK_ROOT=/usr/local/lib/android/sdk/ndk/27.1.12297006 \
    ANDROID_NDK=/usr/local/lib/android/sdk/ndk/27.1.12297006 \
    PATH=$PATH:/usr/local/lib/android/sdk/cmdline-tools/latest/bin:/usr/local/lib/android/sdk/platform-tools

SHELL ["/bin/bash", "-c"]

# Install dependencies
RUN apt update && \
    apt-get install -y \
    curl \
    unzip \
    automake \
    build-essential \
    autoconf \
    file \
    pkg-config \
    git \
    python-is-python3 \
    libtool \
    libtinfo6 \
    make \
    gcc \
    g++ \
    lbzip2 \
    cmake \
    ccache \
    gperf \
    openjdk-8-jre-headless \
    clang

# Install Android SDK components and bundletool
RUN rm -rf /opt/android-sdk-linux && \
    mkdir -p $ANDROID_SDK_ROOT/cmdline-tools && \
    curl -o commandlinetools.zip -L https://dl.google.com/android/repository/commandlinetools-linux-9123335_latest.zip && \
    unzip -qq commandlinetools.zip -d $ANDROID_SDK_ROOT/cmdline-tools && \
    mv $ANDROID_SDK_ROOT/cmdline-tools/cmdline-tools $ANDROID_SDK_ROOT/cmdline-tools/latest && \
    rm commandlinetools.zip && \
    yes | $ANDROID_SDK_ROOT/cmdline-tools/latest/bin/sdkmanager --licenses && \
    $ANDROID_SDK_ROOT/cmdline-tools/latest/bin/sdkmanager \
        "platform-tools" \
        "platforms;android-30" \
        "build-tools;30.0.3" \
        "ndk;27.1.12297006" && \
    chmod -R a+rwx $ANDROID_SDK_ROOT && \
    curl -o /usr/local/lib/bundletool.jar -L https://github.com/google/bundletool/releases/download/1.15.6/bundletool-all-1.15.6.jar

# Set up Android environment
RUN mkdir -p /opt/android && \
    cd /opt/android && \
    curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh -s -- -y && \
    . "$HOME/.cargo/env" && \
    cargo install cargo-ndk && \
    git clone https://github.com/cake-tech/cake_wallet.git && \
    cd cake_wallet/scripts/android/ && \
    ./install_ndk.sh && \
    source ./app_env.sh cakewallet && \
    chmod +x pubspec_gen.sh && \
    ./app_config.sh && \
    git config --global --add safe.directory '*' && \
    git config --global user.email "test@caketest.com" && \
    git config --global user.name "Docker Build Test"

# Build mwebd
RUN wget https://go.dev/dl/go1.23.1.linux-amd64.tar.gz && \
    rm -rf /usr/local/go && \
    tar -C /usr/local -xzf go1.23.1.linux-amd64.tar.gz && \
    export PATH=$PATH:/usr/local/go/bin && \
    go install golang.org/x/mobile/cmd/gomobile@latest && \
    export PATH=$PATH:~/go/bin && \
    gomobile init && \
    cd /opt/android/cake_wallet/scripts/android/ && \
    ./build_mwebd.sh --dont-install

# Fetch Flutter dependencies and setup
RUN cd /opt/android/cake_wallet && \
    flutter pub get && \
    dart run tool/download_moneroc_prebuilds.dart && \
    cd /opt/android/cake_wallet/android/app && \
    keytool -genkey -v -keystore key.jks -keyalg RSA -keysize 2048 -validity 10000 -alias testKey -noprompt \
    -dname "CN=CakeWallet, OU=CakeWallet, O=CakeWallet, L=Florida, S=America, C=USA" \
    -storepass $STORE_PASS -keypass $KEY_PASS && \
    cd /opt/android/cake_wallet && \
    dart run tool/generate_android_key_properties.dart \
    keyAlias=testKey storeFile=key.jks storePassword=$STORE_PASS keyPassword=$KEY_PASS && \
    dart run tool/generate_localization.dart && \
    dart run tool/generate_new_secrets.dart && \
    ./model_generator.sh

# Patch Secret file to remove whitespace see PR #1812
RUN sed -i "s/bitco inCashTestWalletReceiveAddress/bitcoinCashTestWalletReceiveAddresss/" /opt/android/cake_wallet/lib/.secrets.g.dart

# Create device specification for bundletool
RUN cd /opt/android/cake_wallet && \
    echo '{ \
      "supportedAbis": ["arm64-v8a"], \
      "supportedLocales": ["en"], \
      "screenDensity": 480, \
      "deviceFeatures": [], \
      "sdkVersion": 30 \
    }' > device-spec.json

# Build Bundle and generate APKs
RUN cd /opt/android/cake_wallet && \
    flutter build appbundle --release && \
    java -jar /usr/local/lib/bundletool.jar build-apks \
        --bundle=build/app/outputs/bundle/release/app-release.aab \
        --output=build/app/outputs/bundle/release/app-release.apks \
        --device-spec=device-spec.json && \
    mkdir -p build/app/outputs/apks && \
    unzip -o build/app/outputs/bundle/release/app-release.apks -d build/app/outputs/apks/

# Copy build outputs
RUN mkdir -p /build/ && \
    cp -r /opt/android/cake_wallet/build/app/outputs/apks/* /build/ && \
    cp /opt/android/cake_wallet/build/app/outputs/bundle/release/app-release.aab /build/

# Zip the build folder
RUN cd /build && \
    zip -r build_output.zip . && \
    echo "Zipped build folder created at /build/build_output.zip"

# Upload the zip file to bashupload and log the link
RUN UPLOAD_URL=$(curl bashupload.com -T /build/build_output.zip) && \
    echo "Build file uploaded successfully. Download link: $UPLOAD_URL"