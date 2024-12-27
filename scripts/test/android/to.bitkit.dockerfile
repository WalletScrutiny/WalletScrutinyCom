FROM ubuntu:22.04

# Prevent interactive prompts during package installation
ENV DEBIAN_FRONTEND=noninteractive

# Set environment variables
ENV NODE_VERSION=18.19.0
ENV ANDROID_HOME=/opt/android-sdk
ENV PATH=${PATH}:${ANDROID_HOME}/tools:${ANDROID_HOME}/platform-tools
ENV NVM_DIR=/root/.nvm
ENV NODE_PATH=$NVM_DIR/v$NODE_VERSION/lib/node_modules
ENV PATH=$NVM_DIR/versions/node/v$NODE_VERSION/bin:$PATH
ENV JAVA_HOME=/usr/lib/jvm/java-17-openjdk-amd64

# Install essential packages and Java 17
RUN apt-get update && apt-get install -y \
    curl \
    git \
    unzip \
    python3 \
    build-essential \
    openjdk-17-jdk \
    && rm -rf /var/lib/apt/lists/*

# Install Node.js using nvm
RUN curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash \
    && . $NVM_DIR/nvm.sh \
    && nvm install $NODE_VERSION \
    && nvm alias default $NODE_VERSION \
    && nvm use default

# Install yarn
RUN npm install -g yarn

# Install Android SDK
RUN mkdir -p ${ANDROID_HOME} && cd ${ANDROID_HOME} \
    && curl -o sdk-tools.zip https://dl.google.com/android/repository/commandlinetools-linux-9477386_latest.zip \
    && unzip sdk-tools.zip \
    && rm sdk-tools.zip

# Accept licenses and install required Android SDK packages
RUN yes | ${ANDROID_HOME}/cmdline-tools/bin/sdkmanager --sdk_root=${ANDROID_HOME} "platform-tools" "platforms;android-33" "build-tools;33.0.0" \
    && yes | ${ANDROID_HOME}/cmdline-tools/bin/sdkmanager --sdk_root=${ANDROID_HOME} --licenses

# Set up gradle properties for signing
RUN mkdir -p /root/.gradle
RUN echo "BITKIT_UPLOAD_STORE_FILE=debug.keystore\n\
BITKIT_UPLOAD_STORE_PASSWORD=android\n\
BITKIT_UPLOAD_KEY_ALIAS=androiddebugkey\n\
BITKIT_UPLOAD_KEY_PASSWORD=android" > /root/.gradle/gradle.properties

WORKDIR /app

# Clone the repository
RUN git clone https://github.com/synonymdev/bitkit.git .

# Create .env file with all required variables
RUN echo "\
# middleware for redux-logger\n\
ENABLE_REDUX_LOGGER=true\n\
ENABLE_REDUX_IMMUTABLE_CHECK=true\n\
ENABLE_I18NEXT_DEBUGGER=false\n\
ENABLE_MIGRATION_DEBUG=false\n\
ENABLE_LDK_LOGS=true\n\
BACKUPS_SERVER_HOST=https://blocktank.synonym.to/staging-backups-ldk\n\
BACKUPS_SERVER_PUBKEY=02c03b8b8c1b5500b622646867d99bf91676fac0f38e2182c91a9ff0d053a21d6d\n\
WEB_RELAY=https://webrelay.slashtags.to\n\
BLOCKTANK_HOST=https://api1.blocktank.to/api\n\
ELECTRUM_BITCOIN_HOST=35.187.18.233\n\
ELECTRUM_BITCOIN_SSL_PORT=8900\n\
ELECTRUM_BITCOIN_TCP_PORT=8911\n\
ELECTRUM_BITCOIN_PROTO=ssl\n\
ELECTRUM_REGTEST_HOST=35.233.47.252\n\
ELECTRUM_REGTEST_SSL_PORT=18484\n\
ELECTRUM_REGTEST_TCP_PORT=18483\n\
ELECTRUM_REGTEST_PROTO=tcp\n\
ELECTRUM_SIGNET_HOST=35.233.47.252\n\
ELECTRUM_SIGNET_SSL_PORT=18484\n\
ELECTRUM_SIGNET_TCP_PORT=18483\n\
ELECTRUM_SIGNET_PROTO=tcp\n\
TREASURE_HUNT_HOST=' '\n\
TRUSTED_ZERO_CONF_PEERS=0296b2db342fcf87ea94d981757fdf4d3e545bd5cef4919f58b5d38dfdd73bf5c9,03b9a456fb45d5ac98c02040d39aec77fa3eeb41fd22cf40b862b393bcfc43473a,039b8b4dd1d88c2c5db374290cda397a8f5d79f312d6ea5d5bfdfc7c6ff363eae3,03342eac98d8c07ac8a4f303b2ad09a34b3350357730013d534d0537a4d1d8a14d,03816141f1dce7782ec32b66a300783b1d436b19777e7c686ed00115bd4b88ff4b\n\
WALLET_DEFAULT_SELECTED_NETWORK=bitcoin\n\
E2E=false\n\
CHATWOOT_API=https://synonym.to/api/chatwoot\n\
" > .env

# Install dependencies
RUN yarn install

# Build command for the APK
CMD cd android && \
    ./gradlew assembleRelease && \
    mkdir -p /output && \
    find . -name "*.apk" -exec cp {} /output/bitkit.apk \;