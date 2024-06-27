FROM ubuntu:20.04

ENV DEBIAN_FRONTEND=noninteractive
ENV FLUTTER_VERSION=2.8.1
ENV FLUTTER_HOME=/home/developer/flutter
ENV PATH=$PATH:$FLUTTER_HOME/bin:/opt/android-sdk/platform-tools:/opt/android-sdk/tools/bin

RUN apt-get update && apt-get install -y \
    curl git unzip xz-utils zip libglu1-mesa openjdk-8-jdk wget

# Install Android SDK
RUN mkdir -p /opt/android-sdk && cd /opt/android-sdk && \
    wget https://dl.google.com/android/repository/commandlinetools-linux-6858069_latest.zip && \
    unzip commandlinetools-linux-6858069_latest.zip && rm commandlinetools-linux-6858069_latest.zip && \
    yes | ./cmdline-tools/bin/sdkmanager --sdk_root=/opt/android-sdk --licenses && \
    ./cmdline-tools/bin/sdkmanager --sdk_root=/opt/android-sdk "platform-tools" "platforms;android-30" "build-tools;30.0.3"

# Accept Android SDK licenses
RUN yes | /opt/android-sdk/cmdline-tools/bin/sdkmanager --licenses

RUN useradd -m developer
USER developer
WORKDIR /home/developer

# Configure safe directory for Git
RUN git config --global --add safe.directory /home/developer/flutter

RUN git clone https://github.com/flutter/flutter.git $FLUTTER_HOME && \
    cd $FLUTTER_HOME && \
    git checkout $FLUTTER_VERSION && \
    flutter precache && \
    flutter doctor --android-licenses

WORKDIR /app
CMD ["flutter", "build", "apk", "--release", "--dart-define=screenshot=true"]
