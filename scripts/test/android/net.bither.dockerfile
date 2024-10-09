FROM ubuntu:20.04

ENV ANDROID_HOME=/opt/android-sdk
ENV GRADLE_HOME=/opt/gradle/gradle-7.5
ENV DEBIAN_FRONTEND=noninteractive
ENV PATH="$PATH:$ANDROID_HOME/cmdline-tools/latest/bin:$ANDROID_HOME/platform-tools:$GRADLE_HOME/bin"

RUN apt update && \
    apt install -y \
    tzdata \
    git \
    wget \
    unzip \
    openjdk-11-jdk \
    && rm -rf /var/lib/apt/lists/*

RUN ln -fs /usr/share/zoneinfo/UTC /etc/localtime && \
    dpkg-reconfigure --frontend noninteractive tzdata

RUN wget https://services.gradle.org/distributions/gradle-7.5-bin.zip -P /tmp && \
    unzip -d /opt/gradle /tmp/gradle-7.5-bin.zip && \
    rm /tmp/gradle-7.5-bin.zip

RUN wget -q https://dl.google.com/android/repository/commandlinetools-linux-8512546_latest.zip -O /tmp/cmdline-tools.zip && \
    mkdir -p /opt/android-sdk/cmdline-tools && \
    unzip /tmp/cmdline-tools.zip -d /opt/android-sdk/cmdline-tools && \
    mv /opt/android-sdk/cmdline-tools/cmdline-tools /opt/android-sdk/cmdline-tools/latest && \
    rm /tmp/cmdline-tools.zip

RUN yes | /opt/android-sdk/cmdline-tools/latest/bin/sdkmanager --sdk_root=$ANDROID_HOME "platform-tools" "build-tools;34.0.0" "platforms;android-34"

RUN git clone https://github.com/bither/bither-android.git /bither-android && \
    cd /bither-android && \
    git checkout v2.1.5 && \
    git config --global url."https://github.com/".insteadOf git@github.com: && \
    git submodule update --init --recursive

WORKDIR /bither-android

RUN gradle assembleRelease

CMD ["bash"]