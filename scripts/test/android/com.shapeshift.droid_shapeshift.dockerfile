# Use Node.js 18 as the base image
FROM node:18.20.4

# Install necessary tools
RUN apt-get update && apt-get install -y \
    openjdk-17-jdk \
    build-essential \
    wget \
    unzip \
    git \
    && rm -rf /var/lib/apt/lists/*

# Set environment variables for Android SDK
ENV ANDROID_HOME /usr/lib/android-sdk
ENV PATH ${PATH}:${ANDROID_HOME}/cmdline-tools/latest/bin:${ANDROID_HOME}/platform-tools

# Install Android command-line tools
RUN mkdir -p ${ANDROID_HOME}/cmdline-tools && \
    cd ${ANDROID_HOME}/cmdline-tools && \
    wget https://dl.google.com/android/repository/commandlinetools-linux-6858069_latest.zip -O tools.zip && \
    unzip tools.zip -d ${ANDROID_HOME}/cmdline-tools && \
    mv ${ANDROID_HOME}/cmdline-tools/cmdline-tools ${ANDROID_HOME}/cmdline-tools/latest && \
    rm tools.zip

# Install SDK packages
RUN yes | sdkmanager --sdk_root=${ANDROID_HOME} \
    "platforms;android-30" \
    "build-tools;30.0.3" \
    "platform-tools"

# Set working directory
WORKDIR /app

# Clone the repository
RUN git clone https://github.com/shapeshift/mobile-app.git .

# Checkout the specific commit
RUN git checkout 5836f656f240ce1494a2c9625365c18ae3d47bec

# Enable corepack and install Yarn
RUN corepack enable && corepack prepare yarn@3.6.4 --activate

# Copy .env.template to .env
RUN cp .env.template .env

# Set environment variables (replace these with actual values if known)
ENV BEARD_URI=placeholder_value
ENV CAFE_URI=placeholder_value
ENV DEVELOP_URI=placeholder_value
ENV GOME_URI=placeholder_value

# Install project dependencies
RUN yarn install

# Set up local.properties
RUN echo "sdk.dir=$ANDROID_HOME" > android/local.properties

# Build the Android App Bundle (AAB)
RUN cd android && ./gradlew bundleRelease

# Install bundletool
RUN wget https://github.com/google/bundletool/releases/download/1.10.0/bundletool-all-1.10.0.jar -O bundletool.jar

# Copy device-spec.json to the container (you'll need to provide this file)
COPY device-spec.json /app/android/device-spec.json

# Generate split APKs from the AAB using bundletool
RUN java -jar bundletool.jar build-apks --bundle=android/app/build/outputs/bundle/release/app-release.aab --output=android/app/build/outputs/apk/release/app-release.apks --device-spec=android/device-spec.json

# Extract the APKs from the .apks file
RUN unzip android/app/build/outputs/apk/release/app-release.apks -d android/app/build/outputs/apk/release/

# Set the default command
CMD ["bash"]
