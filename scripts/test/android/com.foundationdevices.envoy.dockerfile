# Use Ubuntu 22.04 as the base image
FROM ubuntu:22.04

# Set environment variables
ENV TZ=America/New_York
ENV ANDROID_SDK_ROOT=/root/Android/sdk
ENV PATH="$PATH:/root/Android/sdk/platform-tools:/root/Android/sdk/ndk/25.2.9519653/toolchains/llvm/prebuilt/linux-x86_64/bin:/root/flutter/bin:/root/.cargo/bin"
ENV DEBIAN_FRONTEND=noninteractive

# Install necessary packages
RUN apt-get update && apt-get upgrade -y && \
    apt-get install -y --no-install-recommends \
    postgresql curl build-essential libssl-dev pkg-config libpq-dev git unzip xz-utils zip \
    libglu1-mesa openjdk-8-jdk openjdk-17-jdk wget python2 autoconf clang cmake ninja-build \
    libgtk-3-0 libgtk-3-dev v4l2loopback-dkms v4l2loopback-utils libzbar-dev libzbar0 \
    libzbargtk-dev libjsoncpp-dev libsecret-1-dev libsecret-1-0 ffmpeg xvfb xdotool x11-utils \
    libstdc++-12-dev llvm-14 libsdl2-dev libclang1-14 libtool sudo libusb-1.0-0-dev \
    python3-virtualenv xorg xdg-user-dirs xterm tesseract-ocr ca-certificates openssl && \
    apt-get clean && rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/*

# Update SSL certificates
RUN update-ca-certificates

# Install Android SDK Command-line Tools
RUN update-java-alternatives --set /usr/lib/jvm/java-1.8.0-openjdk-amd64 && \
    mkdir -p /root/Android/sdk /root/.android && \
    touch /root/.android/repositories.cfg && \
    wget -O sdk-tools.zip https://dl.google.com/android/repository/sdk-tools-linux-4333796.zip && \
    unzip sdk-tools.zip -d /root/Android/sdk && rm sdk-tools.zip

# Install required Android components
RUN yes | /root/Android/sdk/tools/bin/sdkmanager --licenses && \
    /root/Android/sdk/tools/bin/sdkmanager "build-tools;30.0.3" "platforms;android-30" \
    "platform-tools" "cmdline-tools;latest" "ndk;25.2.9519653"

# Install Flutter SDK
RUN git clone https://github.com/flutter/flutter.git /root/flutter && \
    flutter channel stable && \
    flutter upgrade && \
    flutter config --enable-linux-desktop && \
    flutter precache && \
    flutter doctor

# Configure Cargo to use git-fetch-with-cli and add crates.io mirror
RUN mkdir -p /root/.cargo && \
    echo '[net]' > /root/.cargo/config.toml && \
    echo 'git-fetch-with-cli = true' >> /root/.cargo/config.toml && \
    echo '[source.crates-io]' >> /root/.cargo/config.toml && \
    echo 'replace-with = "tuna"' >> /root/.cargo/config.toml && \
    echo '[source.tuna]' >> /root/.cargo/config.toml && \
    echo 'registry = "https://mirrors.tuna.tsinghua.edu.cn/git/crates.io-index.git"' >> /root/.cargo/config.toml

# Install Rust
RUN curl https://sh.rustup.rs -sSf | sh -s -- --default-toolchain 1.69.0 -y && \
    rustup target add aarch64-linux-android

# Clone the repository and set working directory
RUN git clone https://github.com/Foundation-Devices/envoy.git /root/repo
WORKDIR /root/repo

# Copy the build script
COPY com.foundationdevices.envoy.build_ffi_android.sh /root/repo/
RUN chmod +x /root/repo/com.foundationdevices.envoy.build_ffi_android.sh

# Create a new script to run the build and keep the container running
RUN echo '#!/bin/bash' > /root/build_and_keep_running.sh && \
    echo 'cd /root/repo' >> /root/build_and_keep_running.sh && \
    echo 'pkill -f cargo' >> /root/build_and_keep_running.sh && \
    echo 'rm -f /root/.cargo/.package-cache' >> /root/build_and_keep_running.sh && \
    echo './com.foundationdevices.envoy.build_ffi_android.sh || {' >> /root/build_and_keep_running.sh && \
    echo '    echo "Build failed, attempting to clean and rebuild..."' >> /root/build_and_keep_running.sh && \
    echo '    cargo clean' >> /root/build_and_keep_running.sh && \
    echo '    cargo build --target=aarch64-linux-android' >> /root/build_and_keep_running.sh && \
    echo '    cargo build --target=aarch64-linux-android --release' >> /root/build_and_keep_running.sh && \
    echo '    flutter pub get' >> /root/build_and_keep_running.sh && \
    echo '    flutter build apk --release' >> /root/build_and_keep_running.sh && \
    echo '}' >> /root/build_and_keep_running.sh && \
    echo 'echo "Build process completed. Checking for APK..."' >> /root/build_and_keep_running.sh && \
    echo 'find /root/repo -name "*.apk"' >> /root/build_and_keep_running.sh && \
    echo 'echo "Versions of tools:"' >> /root/build_and_keep_running.sh && \
    echo 'cargo --version' >> /root/build_and_keep_running.sh && \
    echo 'rustc --version' >> /root/build_and_keep_running.sh && \
    echo 'flutter --version' >> /root/build_and_keep_running.sh && \
    echo 'tail -f /dev/null' >> /root/build_and_keep_running.sh && \
    chmod +x /root/build_and_keep_running.sh

# Set the new script as the CMD
CMD ["/root/build_and_keep_running.sh"]