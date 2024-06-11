# Use the latest Ubuntu LTS as the base image
FROM ubuntu:22.04

# Set environment variables for Android SDK and Flutter
ENV ANDROID_SDK_ROOT="/opt/android-sdk" \
    ANDROID_HOME="/opt/android-sdk" \
    FLUTTER_ROOT="/opt/flutter"

ENV PATH="$PATH:$ANDROID_SDK_ROOT/cmdline-tools/latest/bin:$ANDROID_SDK_ROOT/platform-tools:$FLUTTER_ROOT/bin"

# Install system dependencies
RUN apt-get update && \
    apt-get install -y \
        git \
        curl \
        unzip \
        openjdk-11-jdk \
        wget \
        sudo && \
    rm -rf /var/lib/apt/lists/*

# Install Android SDK
RUN mkdir -p "$ANDROID_SDK_ROOT/cmdline-tools" && \
    wget -O commandlinetools.zip https://dl.google.com/android/repository/commandlinetools-linux-8512546_latest.zip && \
    unzip commandlinetools.zip -d "$ANDROID_SDK_ROOT/cmdline-tools" && \
    rm commandlinetools.zip && \
    mv "$ANDROID_SDK_ROOT/cmdline-tools/cmdline-tools" "$ANDROID_SDK_ROOT/cmdline-tools/latest"

# Accept licenses and install SDK components as root
RUN yes | $ANDROID_SDK_ROOT/cmdline-tools/latest/bin/sdkmanager --licenses && \
    $ANDROID_SDK_ROOT/cmdline-tools/latest/bin/sdkmanager "ndk;23.1.7779620"

# Install Android NDK
RUN mkdir -p "$ANDROID_SDK_ROOT/ndk" && \
    wget -O android_ndk.zip https://dl.google.com/android/repository/android-ndk-r17c-linux-x86_64.zip && \
    unzip android_ndk.zip -d "$ANDROID_SDK_ROOT/ndk" && \
    rm android_ndk.zip

# Install Flutter
RUN git clone https://github.com/flutter/flutter.git "$FLUTTER_ROOT"

# Manually download and extract Gradle Wrapper with no ownership change
RUN wget -O /tmp/gradle-wrapper.tgz https://storage.googleapis.com/flutter_infra_release/gradle-wrapper/fd5c1f2c013565a3bea56ada6df9d2b8e96d56aa/gradle-wrapper.tgz && \
    mkdir -p /opt/flutter/bin/cache/artifacts/gradle_wrapper && \
    tar --no-same-owner -xzf /tmp/gradle-wrapper.tgz -C /opt/flutter/bin/cache/artifacts/gradle_wrapper && \
    rm /tmp/gradle-wrapper.tgz

# Create and switch to a non-root user for the rest of the process
RUN useradd -ms /bin/bash appuser && \
    chown -R appuser:appuser /opt/flutter /opt/android-sdk

USER appuser
WORKDIR /home/appuser

# Precache Flutter
RUN $FLUTTER_ROOT/bin/flutter precache

# Clone the EliteWallet repository
RUN git clone https://github.com/Elite-Labs/EliteWallet.git elite_wallet

# Set working directory
WORKDIR /home/appuser/elite_wallet

# Build dependencies using bash with exported environment variables
RUN /bin/bash -c "source /etc/environment && /bin/bash ./scripts/build_deps.sh"

# Build the app using bash with exported environment variables
RUN /bin/bash -c "source /etc/environment && /bin/bash ./scripts/build.sh"
