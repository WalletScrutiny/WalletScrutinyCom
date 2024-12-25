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
# Redux and Debug Settings\n\
ENABLE_REDUX_LOGGER=false\n\
ENABLE_REDUX_IMMUTABLE_CHECK=false\n\
ENABLE_I18NEXT_DEBUGGER=false\n\
ENABLE_MIGRATION_DEBUG=false\n\
ENABLE_LDK_LOGS=false\n\
\n\
# Server Settings\n\
BACKUPS_SERVER_HOST=http://127.0.0.1:3003\n\
BACKUPS_SERVER_PUBKEY=0319c4ff23820afec0c79ce3a42031d7fef1dff78b7bdd69b5560684f3e1827675\n\
WEB_RELAY=https://webrelay.slashtags.to\n\
BLOCKTANK_HOST=https://api.stag.blocktank.to\n\
\n\
# Bitcoin Network Settings\n\
ELECTRUM_BITCOIN_HOST=35.187.18.233\n\
ELECTRUM_BITCOIN_SSL_PORT=8900\n\
ELECTRUM_BITCOIN_TCP_PORT=8911\n\
ELECTRUM_BITCOIN_PROTO=tcp\n\
\n\
# Regtest Network Settings\n\
ELECTRUM_REGTEST_HOST=127.0.0.1\n\
ELECTRUM_REGTEST_SSL_PORT=60001\n\
ELECTRUM_REGTEST_TCP_PORT=60001\n\
ELECTRUM_REGTEST_PROTO=tcp\n\
\n\
# Signet Network Settings\n\
ELECTRUM_SIGNET_HOST=35.233.47.252\n\
ELECTRUM_SIGNET_SSL_PORT=18484\n\
ELECTRUM_SIGNET_TCP_PORT=18483\n\
ELECTRUM_SIGNET_PROTO=tcp\n\
\n\
# Additional Settings\n\
TREASURE_HUNT_HOST=' '\n\
TRUSTED_ZERO_CONF_PEERS=03b9a456fb45d5ac98c02040d39aec77fa3eeb41fd22cf40b862b393bcfc43473a\n\
WALLET_DEFAULT_SELECTED_NETWORK=bitcoinRegtest\n\
E2E=true\n\
CHATWOOT_API=https://synonym.to/api/chatwoot\n\
" > .env

# Install dependencies
RUN yarn install

# Build command for the APK
CMD cd android && \
    ./gradlew assembleRelease && \
    mkdir -p /output && \
    find . -name "*.apk" -exec cp {} /output/bitkit.apk \;