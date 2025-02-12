# Use a base Ubuntu image
FROM --platform=linux/amd64 ubuntu:20.04

# Avoid prompts from apt
ENV DEBIAN_FRONTEND=noninteractive
ENV USER="docker"

# Install necessary dependencies
RUN apt update && apt install -y \
    curl \
    git \
    unzip \
    xz-utils \
    zip \
    libglu1-mesa \
    wget \
    sudo \
    clang \
    cmake \
    ninja-build \
    pkg-config \
    libgtk-3-dev \
    software-properties-common \
    && rm -rf /var/lib/apt/lists/*

# Install bundletool
RUN wget -q https://github.com/google/bundletool/releases/download/1.17.2/bundletool-all-1.17.2.jar -O /usr/local/bin/bundletool.jar && \
    echo '#!/bin/bash\njava -jar /usr/local/bin/bundletool.jar "$@"' > /usr/local/bin/bundletool && \
    chmod +x /usr/local/bin/bundletool

RUN adduser --disabled-password --gecos '' $USER
RUN adduser $USER sudo
RUN echo '%sudo ALL=(ALL) NOPASSWD:ALL' >> /etc/sudoers

# Install OpenJDK 17
RUN sudo apt-get install -y openjdk-17-jdk && sudo rm -rf /var/lib/apt/lists/*

USER $USER

# Install Rust
RUN curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh -s -- -y
ENV PATH="/home/$USER/.cargo/bin:${PATH}"

# Verify Rust installation
RUN rustc --version && cargo --version

# Set environment variables
ENV FLUTTER_HOME=/opt/flutter
ENV ANDROID_HOME=/opt/android-sdk
ENV PATH=$FLUTTER_HOME/bin:$PATH:$ANDROID_HOME/cmdline-tools/latest/bin:$ANDROID_HOME/platform-tools

# Install Flutter
RUN sudo git clone https://github.com/flutter/flutter.git $FLUTTER_HOME
RUN sudo sh -c "cd $FLUTTER_HOME && git checkout stable && ./bin/flutter --version"

# Set up Android SDK
RUN sudo mkdir -p ${ANDROID_HOME}/cmdline-tools && \
    sudo wget -q https://dl.google.com/android/repository/commandlinetools-linux-8092744_latest.zip -O android-cmdline-tools.zip && \
    sudo unzip -q android-cmdline-tools.zip -d ${ANDROID_HOME}/cmdline-tools && \
    sudo mv ${ANDROID_HOME}/cmdline-tools/cmdline-tools ${ANDROID_HOME}/cmdline-tools/latest && \
    sudo rm android-cmdline-tools.zip

RUN sudo chown -R $USER /opt/flutter
RUN sudo chown -R $USER /opt/android-sdk

RUN flutter config --android-sdk=/opt/android-sdk

# Accept licenses and install necessary Android SDK components
RUN yes | sdkmanager --licenses
RUN sdkmanager "platform-tools" "platforms;android-34" "build-tools;34.0.0" "ndk;25.2.9519653"

# Clean up existing app directory
RUN sudo rm -rf /app

RUN sudo mkdir /app

RUN sudo chown -R $USER /app

# Clone the Bull Bitcoin mobile repository
RUN git clone https://github.com/SatoshiPortal/bullbitcoin-mobile /app

# Copy device-spec.json into the container
COPY device-spec.json /app/device-spec.json

# Set up local.properties for Gradle
RUN echo "flutter.sdk=/opt/flutter" > /app/android/local.properties

WORKDIR /app

RUN flutter pub get

# Generate a fake keystore
RUN keytool -genkey -v -keystore upload-keystore.jks -keyalg RSA -keysize 2048 -validity 10000 -alias upload -storepass android -keypass android -dname "CN=Android Debug,O=Android,C=US"

# Set up key.properties
RUN echo "storePassword=android" > /app/android/key.properties && \
    echo "keyPassword=android" >> /app/android/key.properties && \
    echo "keyAlias=upload" >> /app/android/key.properties && \
    echo "storeFile=/app/upload-keystore.jks" >> /app/android/key.properties

# Pre-build the project to download all necessary dependencies
RUN flutter precache

# Generates freezed files
RUN dart run build_runner build --delete-conflicting-outputs

# With this single line
CMD ["sh", "-c", "flutter build appbundle --release && bundletool build-apks --bundle=build/app/outputs/bundle/release/app-release.aab --output=app.apks --device-spec=device-spec.json"]