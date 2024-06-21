# Use an Ubuntu 22.04 image as a parent image
FROM ubuntu:22.04

ARG TAG
ARG REPO
ARG GITHUB_USER
ARG GITHUB_TOKEN
ARG DEVICE_SPEC_PATH

# Set environment variables for non-interactive installation
ENV DEBIAN_FRONTEND=noninteractive

# Install necessary tools and OpenJDK
RUN apt-get update && apt-get install -y \
    curl \
    unzip \
    git \
    make \
    nano \
    zip \
    build-essential \
    libssl-dev \
    pkg-config \
    && rm -rf /var/lib/apt/lists/*

# Install SDKMAN
RUN curl -s "https://get.sdkman.io" | bash && \
    bash -c "source $HOME/.sdkman/bin/sdkman-init.sh && sdk install java 17.0.1-open"

# Set environment variables for Java
ENV JAVA_HOME /root/.sdkman/candidates/java/current
ENV PATH $JAVA_HOME/bin:$PATH

# Set environment variables for Android SDK
ENV ANDROID_HOME /opt/android-sdk
ENV ANDROID_SDK_ROOT /opt/android-sdk
ENV PATH ${ANDROID_HOME}/cmdline-tools/bin:${ANDROID_HOME}/platform-tools:${PATH}

# Download and install Android SDK
RUN mkdir -p ${ANDROID_HOME} && \
    curl -o sdk-tools.zip https://dl.google.com/android/repository/commandlinetools-linux-7583922_latest.zip && \
    unzip sdk-tools.zip -d ${ANDROID_HOME} && \
    mv ${ANDROID_HOME}/cmdline-tools/* ${ANDROID_HOME}/ && \
    rm -rf ${ANDROID_HOME}/cmdline-tools && \
    rm sdk-tools.zip

# Install SDK components
RUN yes | ${ANDROID_HOME}/bin/sdkmanager --sdk_root=${ANDROID_HOME} --licenses && \
    ${ANDROID_HOME}/bin/sdkmanager --sdk_root=${ANDROID_HOME} "platform-tools" "platforms;android-34" "build-tools;34.0.0" "ndk;26.1.10909125"

# Download and install Rust
RUN curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh -s -- -y && \
    echo 'source $HOME/.cargo/env' >> /root/.bashrc && \
    /bin/bash -c "source $HOME/.cargo/env && rustup toolchain install stable"

# Set up the Rust environment
ENV PATH="/root/.cargo/bin:${PATH}"

# Install the required Rust targets
RUN rustup target add aarch64-linux-android armv7-linux-androideabi x86_64-linux-android i686-linux-android

# Install typeshare-cli
RUN cargo install typeshare-cli --version 1.6.0

# Create the GemWallet folder
RUN mkdir /home/gemwallet && cd /home/gemwallet

# Clone the repository
RUN git clone --branch $TAG https://$GITHUB_USER:$GITHUB_TOKEN@github.com/$(echo $REPO | sed 's/https:\/\/github.com\///') /home/gemwallet/gem-android && \
    cd /home/gemwallet/gem-android && \
    git submodule update --init --recursive

# Create the local.properties file
RUN echo "gpr.user=$GITHUB_USER" >> /home/gemwallet/local.properties && \
    echo "gpr.key=$GITHUB_TOKEN" >> /home/gemwallet/local.properties && \
    mv /home/gemwallet/local.properties /home/gemwallet/gem-android/local.properties
    
# Set environment variables for keystore
ENV ANDROID_KEYSTORE_ALIAS="gemwallet-key"
ENV ANDROID_KEYSTORE_PASSWORD="password"
ENV ANDROID_KEYSTORE_FILENAME="/home/gemwallet/gem-android/app/release.keystore"
ENV ANDROID_KEYSTORE_PASSWORD="password"

# Set the working directory
WORKDIR /home/gemwallet/gem-android

# Install toolchains for uniffi
RUN cd /home/gemwallet/gem-android/core/gemstone && make prepare-android

# Generate keystore file
RUN keytool -genkey -v -keystore /home/gemwallet/gem-android/app/release.keystore -alias gemwallet-key -keyalg RSA -keysize 2048 -validity 10000 -storepass password -keypass password -dname "CN=gemwallet.com, OU=GemWallet, O=GemWallet, L=City, S=State, C=Country"

# Make the apk
RUN ./gradlew bundleRelease

# Download Bundletool
RUN curl -L -o bundletool.jar https://github.com/google/bundletool/releases/download/1.8.2/bundletool-all-1.8.2.jar

# **Copy Device Spec File**
COPY device-spec.json /home/gemwallet/device-spec.json

# **Generate device-specific APKs using the device spec file**
RUN java -jar bundletool.jar build-apks \
    --bundle=/home/gemwallet/gem-android/app/build/outputs/bundle/release/app-release.aab \
    --output=/home/gemwallet/gem-android/app-release.apks \
    --device-spec=/home/gemwallet/device-spec.json \
    --ks=$ANDROID_KEYSTORE_FILENAME \
    --ks-pass=pass:$ANDROID_KEYSTORE_PASSWORD \
    --ks-key-alias=$ANDROID_KEYSTORE_ALIAS \
    --key-pass=pass:$ANDROID_KEYSTORE_PASSWORD

# Unzip the APKs and create directories from their names
RUN mkdir /home/gemwallet/built && \
    unzip /home/gemwallet/gem-android/app-release.apks -d /home/gemwallet/apks && \
    cd /home/gemwallet/apks/splits && \
    for apk in *.apk; do \
        dir_name=$(basename "$apk" .apk | sed 's/^base-//'); \
        mkdir -p /home/gemwallet/built/"$dir_name"; \
        cp "$apk" /home/gemwallet/built/"$dir_name"; \
    done

# Commandline access
CMD ["bash"]
