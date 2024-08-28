# Use an official OpenJDK image with Java 11
FROM openjdk:11-jdk AS builder

# Install required packages and dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    curl \
    wget \
    git \
    unzip \
    lib32stdc++6 \
    lib32z1 \
    build-essential \
    ruby \
    ruby-dev \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

# Install Node.js (version 18.x or later) and Yarn
RUN curl -fsSL https://deb.nodesource.com/setup_18.x | bash - && \
    apt-get install -y nodejs && \
    npm install -g yarn && \
    apt-get clean && rm -rf /var/lib/apt/lists/*

# Install CocoaPods
RUN gem install cocoapods

# Create Android SDK directory
RUN mkdir -p /usr/local/android-sdk/cmdline-tools

# Set environment variables for Android SDK
ENV ANDROID_SDK_ROOT /usr/local/android-sdk
ENV PATH ${ANDROID_SDK_ROOT}/cmdline-tools/latest/bin:${ANDROID_SDK_ROOT}/platform-tools:$PATH

# Download and install Android SDK command line tools
RUN cd ${ANDROID_SDK_ROOT}/cmdline-tools && \
    wget https://dl.google.com/android/repository/commandlinetools-linux-9477386_latest.zip -O tools.zip && \
    unzip tools.zip -d ${ANDROID_SDK_ROOT}/cmdline-tools && \
    mv ${ANDROID_SDK_ROOT}/cmdline-tools/cmdline-tools ${ANDROID_SDK_ROOT}/cmdline-tools/latest && \
    rm tools.zip

# Install Android SDK components and accept licenses
RUN yes | sdkmanager --licenses && \
    sdkmanager "platform-tools" "platforms;android-33" "build-tools;33.0.0"

# Find and set the correct JAVA_HOME
RUN java_path=$(readlink -f /usr/bin/java | sed "s:bin/java::") && \
    echo "export JAVA_HOME=$java_path" >> /etc/environment && \
    echo "JAVA_HOME=$java_path" >> /etc/environment

# Source the environment file to set JAVA_HOME in the current shell
RUN . /etc/environment

# Verify JAVA_HOME
RUN echo "JAVA_HOME is set to $JAVA_HOME" && \
    ls -l $JAVA_HOME

# Create the /bitcointribe directory
RUN mkdir -p /bitcointribe

# Clone the Bitcoin Tribe repository and check out the v2.4.2 tag
WORKDIR /bitcointribe
RUN git clone https://github.com/bithyve/bitcointribe.git . && \
    git checkout tags/v2.4.2 -b v2.4.2-branch

# Set the working directory to the Android directory
WORKDIR /bitcointribe/android

# Make gradlew executable
RUN chmod +x ./gradlew

# Install dependencies, update packages, clean, and build the APK
RUN yarn config set registry https://registry.npmjs.org/ && \
    yarn install --network-timeout 600000 && \
    yarn upgrade && \
    ./gradlew clean && \
    ./gradlew assembleDebug --stacktrace --info --console=plain \
    -Dorg.gradle.jvmargs="-Xmx4096m -XX:MaxPermSize=1024m -XX:+HeapDumpOnOutOfMemoryError" \
    -Dorg.gradle.daemon=false \
    -Dorg.gradle.workers.max=2 \
    -Dorg.gradle.vfs.watch=true

# Create output directory and copy APK
RUN mkdir -p /output && \
    find /bitcointribe/android -name "*.apk" -exec cp {} /output/hexawallet-debug.apk \;

# Final stage
FROM alpine:latest

# Copy the APK from the builder stage
COPY --from=builder /output/hexawallet-debug.apk /hexawallet-debug.apk

# Set the entrypoint to echo the location of the APK
CMD ["echo", "APK built and located at /hexawallet-debug.apk"]