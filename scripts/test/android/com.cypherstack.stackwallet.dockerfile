# Use Ubuntu 20.04 as the base image
FROM ubuntu:20.04

# Avoid prompts from apt
ENV DEBIAN_FRONTEND=noninteractive

# Set environment variables
ENV FLUTTER_HOME=/opt/flutter
ENV ANDROID_SDK_ROOT=/opt/android-sdk
ENV PATH="${PATH}:${FLUTTER_HOME}/bin:${ANDROID_SDK_ROOT}/cmdline-tools/latest/bin:${ANDROID_SDK_ROOT}/platform-tools:/root/.cargo/bin"

# Enable i386 architecture and update package lists
RUN dpkg --add-architecture i386 && apt-get update

# Install basic dependencies
RUN apt-get install -y \
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
    libc6:i386 \
    libncurses5:i386 \
    libstdc++6:i386 \
    lib32z1 \
    libbz2-1.0:i386 \
    meson \  # Add meson here
    && rm -rf /var/lib/apt/lists/*

# Install Rust
RUN curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh -s -- -y
RUN rustup install 1.67.1 1.72.0 1.73.0 && \
    rustup default 1.67.1 && \
    rustup target add aarch64-linux-android armv7-linux-androideabi i686-linux-android x86_64-linux-android && \
    cargo install cargo-ndk --version 2.12.7 --locked

# Install Flutter
RUN git clone https://github.com/flutter/flutter.git -b 3.22.1 $FLUTTER_HOME
RUN flutter precache

# Install Android SDK
RUN mkdir -p ${ANDROID_SDK_ROOT}/cmdline-tools && \
    wget https://dl.google.com/android/repository/commandlinetools-linux-8092744_latest.zip -O android-sdk.zip && \
    unzip -q android-sdk.zip -d ${ANDROID_SDK_ROOT}/cmdline-tools && \
    mv ${ANDROID_SDK_ROOT}/cmdline-tools/cmdline-tools ${ANDROID_SDK_ROOT}/cmdline-tools/latest && \
    rm android-sdk.zip

# Accept licenses and install necessary Android SDK components
RUN yes | sdkmanager --licenses
RUN sdkmanager "platform-tools" "platforms;android-30" "build-tools;30.0.3" "ndk;25.1.8937393" "cmdline-tools;latest"

# Clone Stack Wallet repository and initialize submodules
WORKDIR /app
RUN git clone https://github.com/cypherstack/stack_wallet.git && \
    cd stack_wallet && \
    git submodule update --init --recursive

# Build secure storage dependencies (if needed)
WORKDIR /app/stack_wallet/scripts/linux
RUN ./build_secure_storage_deps.sh

# Run prebuild script
WORKDIR /app/stack_wallet/scripts
RUN chmod +x prebuild.sh && ./prebuild.sh

# Build coinlib for Android target
WORKDIR /app/stack_wallet
RUN dart run coinlib:build_linux

# Build the Stack Wallet application
WORKDIR /app/stack_wallet/scripts
RUN chmod +x build_app.sh && ./build_app.sh -a stack_wallet -p android -v 1.0.0 -b 1

# Set up entrypoint
WORKDIR /app/stack_wallet
ENTRYPOINT ["flutter", "build", "apk", "--release"]
