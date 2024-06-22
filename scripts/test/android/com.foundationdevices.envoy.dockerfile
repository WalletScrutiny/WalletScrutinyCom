FROM ubuntu:22.04

ARG UID=1000
ARG TAG

WORKDIR /root

ENV TZ=America/New_York
ARG DEBIAN_FRONTEND=noninteractive

# Install necessary packages
RUN set -ex; \
apt-get update && apt-get upgrade -y && apt-get install -y --no-install-recommends \
    postgresql \
    curl \
    build-essential \
    libssl-dev \
    pkg-config \
    libpq-dev \
    git \
    unzip \
    xz-utils \
    zip \
    libglu1-mesa \
    openjdk-8-jdk \
    openjdk-11-jdk \
    wget \
    python2 \
    autoconf \
    clang \
    cmake \
    ninja-build \
    libgtk-3-0 \
    libgtk-3-dev \
    v4l2loopback-dkms \
    v4l2loopback-utils \
    libzbar-dev \
    libzbar0 \
    libzbargtk-dev \
    libjsoncpp-dev \
    libsecret-1-dev \
    libsecret-1-0 \
    ffmpeg \
    xvfb \
    xdotool \
    x11-utils \
    libstdc++-12-dev \
    llvm-14 \
    libsdl2-dev \
    libclang1-14 \
    libtool \
    sudo \
    libusb-1.0-0-dev \
    python3-virtualenv \
    xorg \
    xdg-user-dirs \
    xterm \
    tesseract-ocr \
    && apt clean && rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/*

# Set up Android SDK
RUN set -ex; \
    update-java-alternatives --set /usr/lib/jvm/java-1.8.0-openjdk-amd64 && \
    mkdir -p Android/sdk && \
    mkdir -p .android && touch .android/repositories.cfg && \
    wget -O sdk-tools.zip https://dl.google.com/android/repository/sdk-tools-linux-4333796.zip && \
    unzip sdk-tools.zip && rm sdk-tools.zip && \
    mv tools Android/sdk/tools && \
    cd Android/sdk/tools/bin && yes | ./sdkmanager --licenses && \
    ./sdkmanager "build-tools;30.0.2" "platform-tools" "cmdline-tools;latest" "ndk;24.0.8215888"

ENV ANDROID_SDK_ROOT /root/Android/sdk
ENV PATH "$PATH:/root/Android/sdk/platform-tools"

# Set up Flutter SDK
RUN set -ex; \
    update-java-alternatives --set /usr/lib/jvm/java-1.11.0-openjdk-amd64 && \
    git clone https://github.com/flutter/flutter.git

ENV PATH "$PATH:/root/flutter/bin"
ENV PUB_CACHE /pub-cache

RUN set -ex; \
    flutter channel stable && cd flutter && git checkout 3.16.3 && flutter config --enable-linux-desktop

# Install Rust
RUN set -ex; \
    curl https://sh.rustup.rs -sSf | sh -s -- --default-toolchain stable -y

ENV PATH /root/.cargo/bin:$PATH
ENV CARGO_BUILD_JOBS 4

# Build Rust targets
RUN set -ex; \
    export PATH=$PATH:$ANDROID_SDK_ROOT/ndk/24.0.8215888/toolchains/llvm/prebuilt/linux-x86_64/bin/ && \
    export AR=llvm-ar && \
    export RANLIB=llvm-ranlib && \
    rustup install 1.69.0 && \
    rustup +1.69.0 target add aarch64-linux-android && \
    cargo +1.69.0 build --target=aarch64-linux-android && \
    cargo +1.69.0 build --target=aarch64-linux-android --release

# Create necessary directories and set permissions
RUN set -ex; \
    mkdir -p /Users/runner/work/1/ && \
    useradd --uid $UID --create-home --shell /bin/bash appuser && \
    chown -R appuser:appuser /Users/

USER appuser

# Clone the repository and set up environment
RUN set -ex; \
    git clone --branch $TAG https://github.com/synonymdev/bitkit.git /Users/runner/work/1/s/

WORKDIR /Users/runner/work/1/s/

# Build APK and app bundle
RUN flutter build apk --release -P nosign && flutter build appbundle --release -P nosign && \
    mkdir -p /Users/runner/work/1/s/android/app/build/outputs/apk/release && \
    mkdir -p /Users/runner/work/1/s/android/app/build/outputs/bundle/release && \
    cp build/app/outputs/flutter-apk/app-release.apk /Users/runner/work/1/s/android/app/build/outputs/apk/release/ && \
    cp build/app/outputs/bundle/release/app-release.aab /Users/runner/work/1/s/android/app/build/outputs/bundle/release/
