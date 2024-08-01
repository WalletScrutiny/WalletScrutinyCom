FROM ubuntu:20.04
ENV DEBIAN_FRONTEND=noninteractive
ENV FLUTTER_VERSION=2.8.1
ENV FLUTTER_HOME=/home/developer/flutter
ENV ANDROID_SDK_ROOT=/opt/android-sdk
ENV PATH=$PATH:$FLUTTER_HOME/bin:$ANDROID_SDK_ROOT/cmdline-tools/latest/bin:$ANDROID_SDK_ROOT/platform-tools

RUN apt-get update && apt-get install -y \
    curl git-all unzip xz-utils zip libglu1-mesa openjdk-11-jdk wget \
    bash adb android-sdk libjaxb-api-java libjaxb-java libxmlunit-java

RUN mkdir -p $ANDROID_SDK_ROOT && cd $ANDROID_SDK_ROOT && \
    wget https://dl.google.com/android/repository/commandlinetools-linux-8092744_latest.zip && \
    unzip commandlinetools-linux-8092744_latest.zip && rm commandlinetools-linux-8092744_latest.zip && \
    mkdir -p cmdline-tools/latest && \
    mv cmdline-tools/bin cmdline-tools/latest/ && \
    mv cmdline-tools/lib cmdline-tools/latest/ && \
    ls -R $ANDROID_SDK_ROOT  # Debug command

ENV JAVA_HOME=/usr/lib/jvm/java-11-openjdk-amd64
ENV PATH=$PATH:$JAVA_HOME/bin

RUN yes | sdkmanager --sdk_root=${ANDROID_SDK_ROOT} --licenses && \
    sdkmanager --sdk_root=${ANDROID_SDK_ROOT} "platform-tools" "platforms;android-30" "build-tools;30.0.3" && \
    rm -rf ${ANDROID_SDK_ROOT}/platform-tools-2

RUN git clone https://github.com/flutter/flutter.git $FLUTTER_HOME && \
    cd $FLUTTER_HOME && \
    git checkout $FLUTTER_VERSION && \
    flutter precache && \
    flutter config --no-analytics --android-sdk /opt/android-sdk && \
    flutter doctor --android-licenses  && \
    flutter update-packages

WORKDIR /app
COPY . .

RUN curl -o assets/coins.json https://raw.githubusercontent.com/KomodoPlatform/coins/master/coins && \
    curl -o assets/coins_config.json https://raw.githubusercontent.com/KomodoPlatform/coins/master/utils/coins_config.json

CMD ["/bin/bash"]
