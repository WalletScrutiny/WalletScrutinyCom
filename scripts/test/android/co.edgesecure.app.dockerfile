# Builds 4.8.0
# docker build -t edgeapp-build -f co.edgesecure.app.dockerfile
# docker run -d --name edgeapp-container edgeapp-build
# docker cp edgeapp-container:/home/appuser/output/app-release-universal.apk ./
FROM eclipse-temurin:17-jdk-jammy

ENV ANDROID_HOME="/opt/android-sdk" \
    ANDROID_SDK_ROOT="/opt/android-sdk" \
    PATH="${PATH}:/opt/android-sdk/cmdline-tools/latest/bin:/opt/android-sdk/platform-tools"

# Install Node.js 18.x and Yarn
RUN apt-get update && apt-get install -y \
    git \
    wget \
    unzip \
    curl \
    && curl -fsSL https://deb.nodesource.com/setup_18.x | bash - \
    && apt-get install -y nodejs \
    && npm install -g yarn \
    && rm -rf /var/lib/apt/lists/*

RUN mkdir -p ${ANDROID_HOME}/cmdline-tools && \
    wget -q https://dl.google.com/android/repository/commandlinetools-linux-8512546_latest.zip && \
    unzip -q commandlinetools-linux-8512546_latest.zip -d ${ANDROID_HOME}/cmdline-tools && \
    mv ${ANDROID_HOME}/cmdline-tools/cmdline-tools ${ANDROID_HOME}/cmdline-tools/latest && \
    rm commandlinetools-linux-8512546_latest.zip

RUN yes | sdkmanager --licenses && \
    sdkmanager "platform-tools" "platforms;android-33" "build-tools;33.0.0" "ndk;25.1.8937393"

RUN adduser --disabled-password --gecos '' appuser

# Give appuser write permissions to the Android SDK directory
RUN chown -R appuser:appuser ${ANDROID_HOME} && \
    chmod -R 755 ${ANDROID_HOME}

USER appuser

WORKDIR /home/appuser

ENV NODE_ENV="development" \
    AIRBITZ_API_KEY="74591cbad4a4938e0049c9d90d4e24091e0d4070" \
    BUGSNAG_API_KEY="5aca2dbe708503471d8137625e092675"

RUN mkdir edge-react-gui && \
    cd edge-react-gui && \
    git clone --branch v4.12.0 --depth 1 --no-tags --single-branch https://github.com/EdgeApp/edge-react-gui/ .

WORKDIR /home/appuser/edge-react-gui

RUN sed -i "s/versionCode 21000000/versionCode 24062402/g" android/app/build.gradle && \
    sed -i 's/versionName "99.99.99"/versionName "4.8.0"/g' android/app/build.gradle && \
    sed -i "s/uploadReactNativeMappings = true/uploadReactNativeMappings = false/g" android/app/build.gradle && \
    sed -i '/^\s*<\/application>\s*/i <meta-data android:name="com.bugsnag.android.BUILD_UUID" android:value="fd7bc623-0f99-40f8-b23d-527c1483d077"/>' android/app/src/main/AndroidManifest.xml && \
    sed -i 's/BUGSNAG_API_KEY/5aca2dbe708503471d8137625e092675/g' android/app/src/main/AndroidManifest.xml

# Debugging steps
RUN node --version && npm --version && yarn --version
RUN cat package.json
RUN yarn install || (echo "Yarn install failed" && cat yarn-error.log && exit 1)
RUN yarn prepare || (echo "Yarn prepare failed" && exit 1)
RUN sed -i 's/AIRBITZ_API_KEY": "/AIRBITZ_API_KEY": "74591cbad4a4938e0049c9d90d4e24091e0d4070/g' env.json && \
    sed -i 's/BUGSNAG_API_KEY": "/BUGSNAG_API_KEY": "5aca2dbe708503471d8137625e092675/g' env.json

# Remove the package attribute only from the main app's AndroidManifest.xml
RUN sed -i 's/package="[^"]*"//g' android/app/src/main/AndroidManifest.xml
WORKDIR /home/appuser/edge-react-gui/android

# Debug React Native CLI
RUN node /home/appuser/edge-react-gui/node_modules/@react-native-community/cli/build/bin.js config
RUN ./gradlew packageReleaseUniversalApk

# Find and copy the APK to a known location
RUN mkdir -p /home/appuser/output && \
    find /home/appuser/edge-react-gui -name "*release*.apk" -exec cp {} /home/appuser/output/app-release-universal.apk \; && \
    ls -l /home/appuser/output

WORKDIR /home/appuser/output

# This command will keep the container running
CMD ["tail", "-f", "/dev/null"]
