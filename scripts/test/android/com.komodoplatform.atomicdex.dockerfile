FROM ubuntu:20.04
ENV DEBIAN_FRONTEND=noninteractive
ENV FLUTTER_VERSION=2.8.1
ENV FLUTTER_HOME=/home/developer/flutter
ENV ANDROID_SDK_ROOT=/opt/android-sdk
ENV PATH=$PATH:$FLUTTER_HOME/bin:$ANDROID_SDK_ROOT/cmdline-tools/latest/bin:$ANDROID_SDK_ROOT/platform-tools

# Install necessary packages
RUN apt-get update && apt-get install -y \
    curl git-all unzip xz-utils zip libglu1-mesa openjdk-11-jdk wget \
    bash adb android-sdk libjaxb-api-java libjaxb-java libxmlunit-java

# Install rustup and Rust toolchains
# RUN curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh -s -- -y && \
    # . $HOME/.cargo/env && \
    # rustup default nightly-2022-10-29 && \
    # rustup target add aarch64-linux-android && \
    # rustup target add armv7-linux-androideabi

# Create necessary directories and install Android SDK components
RUN mkdir -p $ANDROID_SDK_ROOT && cd $ANDROID_SDK_ROOT && \
    wget https://dl.google.com/android/repository/commandlinetools-linux-8092744_latest.zip && \
    unzip commandlinetools-linux-8092744_latest.zip && rm commandlinetools-linux-8092744_latest.zip && \
    mkdir -p cmdline-tools/latest && \
    mv cmdline-tools/bin cmdline-tools/latest/ && \
    mv cmdline-tools/lib cmdline-tools/latest/ && \
    ls -R $ANDROID_SDK_ROOT  # Debug command

# Set JAVA_HOME
ENV JAVA_HOME=/usr/lib/jvm/java-11-openjdk-amd64
ENV PATH=$PATH:$JAVA_HOME/bin

# Debug commands
# RUN echo $PATH && \
#   which sdkmanager && \
#   ls -R $ANDROID_SDK_ROOT

# Accept Android SDK licenses and install necessary components
RUN yes | sdkmanager --sdk_root=${ANDROID_SDK_ROOT} --licenses && \
    sdkmanager --sdk_root=${ANDROID_SDK_ROOT} "platform-tools" "platforms;android-30" "build-tools;30.0.3" && \
    rm -rf ${ANDROID_SDK_ROOT}/platform-tools-2

# More debug commands
# RUN ls -R $ANDROID_SDK_ROOT && \
#    which sdkmanager

# Clone the Flutter repository and checkout the specified version
RUN git clone https://github.com/flutter/flutter.git $FLUTTER_HOME && \
    cd $FLUTTER_HOME && \
    git checkout $FLUTTER_VERSION && git fetch && git checkout tags/2.8.1 && \
    flutter precache && \
    flutter config --android-sdk /opt/android-sdk && \
    flutter doctor --android-licenses

# Set up the application directory
WORKDIR /app
COPY . .

# Download additional assets and create necessary directories
RUN curl -o assets/coins.json https://raw.githubusercontent.com/KomodoPlatform/coins/master/coins && \
    curl -o assets/coins_config.json https://raw.githubusercontent.com/KomodoPlatform/coins/master/utils/coins_config.json && \
    mkdir -p android/app/src/main/cpp/libs/armeabi-v7a && \
    mkdir -p android/app/src/main/cpp/libs/arm64-v8a

# Copy Rust project files and run Rust setup
# COPY path/to/your/rust/project /app
# RUN cd /app && \
    # . $HOME/.cargo/env && \
    # CC_aarch64_linux_android=aarch64-linux-android21-clang CARGO_TARGET_AARCH64_LINUX_ANDROID_LINKER=aarch64-linux-android21-clang cargo rustc --target=aarch64-linux-android --lib --release --crate-type=staticlib --package mm2_bin_lib && \
    # CC_armv7_linux_androideabi=armv7a-linux-androideabi21-clang CARGO_TARGET_ARMV7_LINUX_ANDROIDEABI_LINKER=armv7a-linux-androideabi21-clang cargo rustc --target=armv7-linux-androideabi --lib --release --crate-type=staticlib --package mm2_bin_lib && \
    # mv target/aarch64-linux-android/release/libmm2lib.a target/aarch64-linux-android/release/libmm2.a && \
    # mv target/armv7-linux-androideabi/release/libmm2lib.a target/armv7-linux-androideabi/release/libmm2.a

# Configure Flutter
RUN flutter config --no-analytics && \
    flutter precache && \
    yes "y" | flutter doctor --android-licenses && \
    flutter doctor && \
    flutter update-packages

CMD ["/bin/bash"]
