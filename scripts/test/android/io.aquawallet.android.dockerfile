# Use an Ubuntu base image for better compatibility
FROM ubuntu:20.04

# Set environment variable to disable interactive prompts
ENV DEBIAN_FRONTEND=noninteractive

# Install necessary dependencies
RUN apt-get update && apt-get install -y \
    curl \
    git \
    openjdk-11-jdk \
    python3 \
    python3-pip \
    build-essential \
    tzdata \
    unzip \
    wget \
    gnupg \
    gradle \
    && apt-get clean

# Configure Git
RUN git config --global http.postBuffer 524288000

# Install Yarn
RUN curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | apt-key add - \
    && echo "deb https://dl.yarnpkg.com/debian/ stable main" | tee /etc/apt/sources.list.d/yarn.list \
    && apt-get update \
    && apt-get install -y yarn

# Verify Yarn installation
RUN yarn --version

# Set the timezone
ENV TZ=Etc/UTC
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

# Set JAVA_HOME
ENV JAVA_HOME=/usr/lib/jvm/java-11-openjdk-amd64
ENV PATH="$JAVA_HOME/bin:$PATH"

# Clone Flutter repository with verbose output
RUN git clone --verbose https://github.com/flutter/flutter.git -b stable /opt/flutter

# Set Flutter environment
ENV PATH="$PATH:/opt/flutter/bin"

# Run Flutter doctor to install Dart SDK
RUN flutter doctor

# Install Android SDK and NDK
RUN mkdir -p /opt/android-sdk && cd /opt/android-sdk \
    && wget https://dl.google.com/android/repository/commandlinetools-linux-7583922_latest.zip \
    && unzip commandlinetools-linux-7583922_latest.zip -d cmdline-tools \
    && rm commandlinetools-linux-7583922_latest.zip \
    && yes | cmdline-tools/cmdline-tools/bin/sdkmanager --sdk_root=/opt/android-sdk --licenses \
    && cmdline-tools/cmdline-tools/bin/sdkmanager --sdk_root=/opt/android-sdk "platform-tools" "platforms;android-30" "build-tools;30.0.3"

ENV ANDROID_SDK_ROOT="/opt/android-sdk"
ENV PATH="$PATH:$ANDROID_SDK_ROOT/platform-tools"
ENV PATH="$PATH:$ANDROID_SDK_ROOT/cmdline-tools/cmdline-tools/bin"

# Clone the app repository
RUN git clone https://github.com/AquaWallet/aqua-wallet /app

# Set the working directory to the android directory
WORKDIR /app/android

# Install a specific version of Gradle
RUN wget https://services.gradle.org/distributions/gradle-7.5-bin.zip -P /tmp \
    && unzip /tmp/gradle-7.5-bin.zip -d /opt \
    && rm /tmp/gradle-7.5-bin.zip \
    && if [ -L /usr/bin/gradle ]; then rm /usr/bin/gradle; fi \
    && ln -s /opt/gradle-7.5/bin/gradle /usr/bin/gradle

# Run Gradle commands
RUN gradle build --stacktrace

# Install dependencies and build
RUN yarn cache clean && \
    yarn config set registry https://registry.npmjs.org/ && \
    yarn install --verbose && \
    ./gradlew app:installDevelopmentDebug --stacktrace --info

# Build the APK
CMD ["flutter", "build", "apk"]
