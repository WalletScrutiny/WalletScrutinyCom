FROM node:18-bullseye

ARG UID=1000
ARG TAG
ARG VERSION

RUN apt-get update && apt-get install -y \
    openjdk-11-jdk \
    android-sdk \
    build-essential \
    file \
    curl \
    python3 \
    git \
    unzip \
    && rm -rf /var/lib/apt/lists/*

ENV ANDROID_HOME=/usr/lib/android-sdk
ENV ANDROID_SDK_ROOT=/usr/lib/android-sdk
ENV PATH=$PATH:$ANDROID_HOME/cmdline-tools/latest/bin:$ANDROID_HOME/platform-tools

RUN mkdir -p /root/.android && touch /root/.android/repositories.cfg
RUN mkdir -p $ANDROID_HOME/cmdline-tools
RUN cd $ANDROID_HOME/cmdline-tools \
    && curl -o cmdline-tools.zip https://dl.google.com/android/repository/commandlinetools-linux-8092744_latest.zip \
    && unzip cmdline-tools.zip \
    && mv cmdline-tools latest \
    && rm cmdline-tools.zip

RUN yes | sdkmanager --licenses

RUN sdkmanager --install \
    "platform-tools" \
    "platforms;android-33" \
    "build-tools;33.0.0" \
    "ndk;25.1.8937393" \
    "cmake;3.22.1"

WORKDIR /
RUN git clone https://github.com/bithyve/bitcoin-keeper.git app
WORKDIR /app

RUN if [ -n "$TAG" ]; then git fetch --all --tags && git checkout $TAG; fi

RUN yarn install || true  # Continue even if patch-package errors out

RUN echo "ENV=PRODUCTION" > .env
RUN echo "NETWORK=MAINNET" >> .env

WORKDIR /app/android
RUN ./gradlew assembleProductionRelease --no-daemon