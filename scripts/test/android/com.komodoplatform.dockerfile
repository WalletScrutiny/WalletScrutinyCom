# Start from a base Ubuntu image
FROM ubuntu:20.04

# Set environment variables to avoid interactive prompts during installation
ENV DEBIAN_FRONTEND=noninteractive

# Install required packages
RUN apt-get update && \
    apt-get install -y wget unzip git-all openjdk-11-jdk curl jq && \
    apt-get clean

# Install Android SDK command line tools
RUN mkdir -p /usr/local/android-sdk/cmdline-tools && \
    cd /usr/local/android-sdk/cmdline-tools && \
    wget https://dl.google.com/android/repository/commandlinetools-linux-8512546_latest.zip -O cmdline-tools.zip && \
    unzip cmdline-tools.zip && \
    rm cmdline-tools.zip && \
    mkdir latest && \
    mv cmdline-tools/* latest && \
    rmdir cmdline-tools

# Set environment variables for Android SDK
ENV ANDROID_HOME /usr/local/android-sdk
ENV PATH $ANDROID_HOME/cmdline-tools/latest/bin:$ANDROID_HOME/platform-tools:$PATH

# Install Flutter
RUN git clone https://github.com/flutter/flutter.git /usr/local/flutter && \
    export PATH="$PATH:/usr/local/flutter/bin" && \
    cd /usr/local/flutter && \
    git fetch && \
    git checkout tags/2.8.1

# Set environment variable for Flutter
ENV FLUTTER_HOME /usr/local/flutter
ENV PATH="$PATH:/usr/local/flutter/bin"

# Install Android SDK components
RUN yes | sdkmanager --licenses && \
    sdkmanager "platform-tools" "platforms;android-30" "build-tools;30.0.3" "ndk;21.3.6528147"

# Clone AtomicDEX-mobile repo
RUN git clone https://github.com/KomodoPlatform/AtomicDEX-mobile.git /home/atomicdex_mobile

# Create necessary directories for API libraries
RUN mkdir -p /home/atomicdex_mobile/android/app/src/main/cpp/libs/arm64-v8a && \
    mkdir -p /home/atomicdex_mobile/android/app/src/main/cpp/libs/armeabi-v7a

# Set working directory
WORKDIR /home/atomicdex_mobile

# Increase Git buffer size
RUN git config --global http.postBuffer 524288000

# Ensure Flutter setup is complete
RUN flutter doctor --android-licenses
RUN flutter doctor

# Fetch and set up coins, build the APK
RUN flutter pub get || (sleep 10 && flutter pub get) && \
    mkdir -p assets && \
    curl -L https://raw.githubusercontent.com/KomodoPlatform/komodo-wallet-mobile/master/assets/coins_config_tcp.json --output assets/coins_config_tcp.json && \
    ./fetch_coins.sh && \
    flutter build apk --release

# Specify the location where you want the APK to be copied
ENV APK_OUTPUT_DIR /home/keraliss/projects/walletScrutiny_build/komodo

# Ensure the APK output directory exists
RUN mkdir -p ${APK_OUTPUT_DIR}

# Copy the APK to the desired output directory
RUN cp build/app/outputs/flutter-apk/app-release.apk ${APK_OUTPUT_DIR}

# Expose adb ports for device connection
EXPOSE 5555 5556

CMD ["/bin/bash"]
