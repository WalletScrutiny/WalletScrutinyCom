# Use Ubuntu 20.04 as the base image
FROM ubuntu:20.04

# Avoid prompts from apt
ENV DEBIAN_FRONTEND=noninteractive

# Set environment variables
ENV FLUTTER_HOME=/opt/flutter
ENV ANDROID_SDK_ROOT=/opt/android-sdk
ENV PATH="${PATH}:${FLUTTER_HOME}/bin:${ANDROID_SDK_ROOT}/cmdline-tools/latest/bin:${ANDROID_SDK_ROOT}/platform-tools"

# Install dependencies
RUN apt-get update && apt-get install -y \
    curl \
    git \
    unzip \
    xz-utils \
    zip \
    libglu1-mesa \
    openjdk-11-jdk-headless \
    wget \
    clang \
    cmake \
    ninja-build \
    pkg-config \
    libgtk-3-dev \
    liblzma-dev \
    python3 \
    python3-pip \
    libssl-dev \
    automake \
    build-essential \
    file \
    libtool \
    libtinfo5 \
    libgit2-dev \
    libncurses5-dev \
    libncursesw5-dev \
    zlib1g-dev \
    llvm \
    g++ \
    gcc \
    gperf \
    libc6-dev-i386 \
    && rm -rf /var/lib/apt/lists/*

# Install Rust
RUN curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh -s -- -y
ENV PATH="/root/.cargo/bin:${PATH}"
RUN rustup install 1.67.1 1.72.0 1.73.0 && \
    rustup default 1.67.1 && \
    rustup target add aarch64-linux-android armv7-linux-androideabi i686-linux-android x86_64-linux-android && \
    cargo install cargo-ndk --version 2.12.7 --locked

# Install Flutter
RUN git clone https://github.com/flutter/flutter.git -b 3.22.1 $FLUTTER_HOME
RUN flutter doctor

# Install Android SDK
RUN mkdir -p ${ANDROID_SDK_ROOT}/cmdline-tools && \
    wget https://dl.google.com/android/repository/commandlinetools-linux-8092744_latest.zip -O android-sdk.zip && \
    unzip -q android-sdk.zip -d ${ANDROID_SDK_ROOT}/cmdline-tools && \
    mv ${ANDROID_SDK_ROOT}/cmdline-tools/cmdline-tools ${ANDROID_SDK_ROOT}/cmdline-tools/latest && \
    rm android-sdk.zip

# Accept licenses and install necessary Android SDK components
RUN yes | sdkmanager --licenses
RUN sdkmanager "platform-tools" "platforms;android-30" "build-tools;30.0.3" "ndk;25.1.8937393"

# Clone Stack Wallet repository
WORKDIR /app
RUN git clone https://github.com/cypherstack/stack_wallet.git && \
    cd stack_wallet && \
    git submodule update --init --recursive

# Run prebuild script
WORKDIR /app/stack_wallet/scripts
RUN chmod +x prebuild.sh && ./prebuild.sh

# Check directory structure after prebuild
WORKDIR /app/stack_wallet
RUN find /app/stack_wallet

# Add debugging output before running build_app.sh
WORKDIR /app/stack_wallet/scripts
RUN echo "APP_PROJECT_ROOT_DIR: $APP_PROJECT_ROOT_DIR" && \
    echo "Environment variables:" && env && \
    ls -la /app/stack_wallet && ls -la /app/stack_wallet/scripts

# Run build_app.sh script with debugging information and skip confirmation
RUN chmod +x build_app.sh && \
    sed -i 's/confirmDisclaimer/#confirmDisclaimer/' build_app.sh && \
    set -x && ./build_app.sh -a stack_wallet -p android -v 1.0.0 -b 1 || { echo "build_app.sh failed"; exit 1; }

# Set up entrypoint
WORKDIR /app/stack_wallet
ENTRYPOINT ["flutter", "build", "apk", "--release"]
