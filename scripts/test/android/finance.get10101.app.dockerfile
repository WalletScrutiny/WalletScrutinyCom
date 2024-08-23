FROM ubuntu:20.04

ENV DEBIAN_FRONTEND=noninteractive

# Install dependencies
RUN apt-get update && apt-get install -y \
    curl \
    git \
    unzip \
    openjdk-11-jdk \
    build-essential \
    libssl-dev \
    pkg-config \
    wget \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*

# Install Rust
RUN curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh -s -- -y
ENV PATH="/root/.cargo/bin:${PATH}"

# Install Flutter
RUN git clone https://github.com/flutter/flutter.git /opt/flutter
ENV PATH="/opt/flutter/bin:${PATH}"
RUN flutter channel stable
RUN flutter upgrade
RUN flutter config --no-analytics
RUN flutter doctor

# Install Android SDK and NDK
ENV ANDROID_HOME=/opt/android-sdk
RUN mkdir -p ${ANDROID_HOME}/cmdline-tools
RUN wget https://dl.google.com/android/repository/commandlinetools-linux-7583922_latest.zip -O android-sdk.zip
RUN unzip android-sdk.zip -d ${ANDROID_HOME}/cmdline-tools
RUN mv ${ANDROID_HOME}/cmdline-tools/cmdline-tools ${ANDROID_HOME}/cmdline-tools/latest
ENV PATH="${PATH}:${ANDROID_HOME}/cmdline-tools/latest/bin:${ANDROID_HOME}/platform-tools"
RUN yes | sdkmanager --licenses
RUN sdkmanager --update
RUN sdkmanager "platforms;android-30" "build-tools;30.0.3" "ndk;25.0.8775105"

# Create .gradle directory and set NDK path
RUN mkdir -p ~/.gradle
RUN echo "ANDROID_NDK=${ANDROID_HOME}/ndk/25.0.8775105" > ~/.gradle/gradle.properties

# Install Gradle 7.4
ENV GRADLE_VERSION=7.4
RUN curl -fsSL -o /tmp/gradle-${GRADLE_VERSION}-bin.zip https://services.gradle.org/distributions/gradle-${GRADLE_VERSION}-bin.zip \
    && unzip -d /opt/gradle /tmp/gradle-${GRADLE_VERSION}-bin.zip \
    && rm /tmp/gradle-${GRADLE_VERSION}-bin.zip
ENV GRADLE_HOME=/opt/gradle/gradle-${GRADLE_VERSION}
ENV PATH=${GRADLE_HOME}/bin:${PATH}

# Install Kotlin 1.9.10
ENV KOTLIN_VERSION=1.9.10
RUN wget https://github.com/JetBrains/kotlin/releases/download/v${KOTLIN_VERSION}/kotlin-compiler-${KOTLIN_VERSION}.zip -P /tmp
RUN unzip -d /opt/kotlin /tmp/kotlin-compiler-${KOTLIN_VERSION}.zip
ENV PATH=/opt/kotlin/kotlinc/bin:${PATH}

# Install cargo-ndk
RUN cargo install cargo-ndk

# Install just
RUN cargo install just

# Install flutter_rust_bridge_codegen
RUN cargo install flutter_rust_bridge_codegen

# Update PATH to include Cargo bin directory
ENV PATH="/root/.cargo/bin:${PATH}"

# Clone the 10101 repository
WORKDIR /app
RUN git clone https://github.com/get10101/10101.git .
RUN git checkout 2.4.5

# Debug: List contents of /app
RUN ls -la /app

# Debug: List contents of /app/mobile
RUN ls -la /app/mobile

# Ensure the 'just' executable is available
RUN which just

# Create necessary directories for flutter_rust_bridge_codegen
RUN mkdir -p /app/native/src/bridge_generated \
    /app/native/lib/bridge_generated \
    /app/mobile/ios/Runner

# Create key.properties (replace with your actual key.properties content)
RUN echo "Your key.properties content here" > ./mobile/android/key.properties

# Ensure gradlew is executable
# RUN chmod +x ./mobile/android/gradlew

# Run flutter_rust_bridge_codegen
RUN flutter_rust_bridge_codegen generate \
   --rust-root /app/native \
   --rust-input crate::api \
   --c-output /app/mobile/ios/Runner/bridge_generated.h \
   --rust-output /app/native/src/bridge_generated/bridge_generated.rs \
   --dart-output /app/native/lib/bridge_generated/bridge_generated.dart \
   --dart-format-line-length 100

# Run build commands using 'just'
WORKDIR /app
RUN just clean
RUN just gen
RUN just android-release
RUN NETWORK=regtest just build-android-app-bundle
RUN NETWORK=regtest just upload-app-bundle

# The APK should now be available at ./build/app/outputs/flutter-apk/app-release.apk
CMD ["echo", "APK built successfully. You can find it at /app/build/app/outputs/flutter-apk/app-release.apk"]