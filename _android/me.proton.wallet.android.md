---
wsId: 
title: Proton Wallet - Secure BTC
altTitle: 
authors:
- danny
users: 10000
appId: me.proton.wallet.android
appCountry: 
released: 2025-02-04
updated: 2025-02-12
version: 1.0.7
stars: 
ratings: 
reviews: 
website: https://proton.me
repository: https://github.com/ProtonWallet/flutter-app
issue: https://github.com/ProtonWallet/flutter-app/issues/4
icon: me.proton.wallet.android.png
bugbounty: 
meta: ok
verdict: ftbfs
appHashes: []
date: 2024-08-12
signer: 
reviewArchive: 
twitter: ProtonPrivacy
social:
- https://www.reddit.com/r/ProtonMail
- https://www.instagram.com/protonprivacy
- https://www.facebook.com/Proton
- https://www.linkedin.com/company/protonprivacy
- https://mastodon.social/@protonprivacy
redirect_from: 
developerName: Proton AG
features: 

---

## Build Update 2024-08-12

We initially tried to build manually from this Dockerfile:

    ```
    # Use an Ubuntu 22.04 image as a parent image
    FROM ubuntu:22.04

    # Set environment variables for non-interactive installation
    ENV DEBIAN_FRONTEND=noninteractive

    # Install necessary tools and dependencies
    RUN apt-get update && apt-get install -y \
        curl \
        unzip \
        git \
        make \
        openjdk-17-jdk \
        wget \
        zip \
        lib32stdc++6 \
        lib32z1 \
        lib32z1-dev \
        libssl-dev \
        build-essential \
        pkg-config \
        ca-certificates \
        clang \
        cmake \
        ninja-build \
        libclang-dev \
        libcurl4-openssl-dev \
        libz-dev \
        libx11-dev \
        libxcb1-dev \
        libx11-xcb-dev \
        libxrender-dev \
        libxrandr-dev \
        libxi-dev \
        libgl1-mesa-dev \
        && rm -rf /var/lib/apt/lists/*

    # Install Flutter
    RUN git clone https://github.com/flutter/flutter.git /usr/local/flutter
    ENV PATH="/usr/local/flutter/bin:/usr/local/flutter/bin/cache/dart-sdk/bin:${PATH}"

    # Enable flutter web and other setup
    RUN flutter config --enable-web && \
        flutter doctor -v

    # Accept Android SDK licenses
    RUN mkdir -p /opt/android-sdk && cd /opt/android-sdk && \
        wget https://dl.google.com/android/repository/commandlinetools-linux-7583922_latest.zip -O cmdline-tools.zip && \
        unzip cmdline-tools.zip -d /opt/android-sdk/cmdline-tools && \
        rm cmdline-tools.zip && \
        mv /opt/android-sdk/cmdline-tools/cmdline-tools /opt/android-sdk/cmdline-tools/tools && \
        yes | /opt/android-sdk/cmdline-tools/tools/bin/sdkmanager --sdk_root=/opt/android-sdk --licenses

    # Install Android SDK components
    RUN /opt/android-sdk/cmdline-tools/tools/bin/sdkmanager --sdk_root=/opt/android-sdk \
        "platform-tools" \
        "platforms;android-33" \
        "build-tools;33.0.0" \
        "ndk;25.1.8937393"

    ENV ANDROID_HOME=/opt/android-sdk
    ENV PATH=${ANDROID_HOME}/cmdline-tools/tools/bin:${ANDROID_HOME}/platform-tools:${PATH}

    # Install Rust and Cargo
    RUN curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh -s -- -y
    ENV PATH="/root/.cargo/bin:${PATH}"

    # Update Rust to the latest stable version
    RUN rustup update stable

    # Install Rust targets for Android
    RUN rustup target add aarch64-linux-android armv7-linux-androideabi i686-linux-android x86_64-linux-android

    # Verify Rust and Cargo installation
    RUN rustc --version && cargo --version

    # Set the working directory
    WORKDIR /workspace

    # Clone Proton Wallet repository
    ARG REPO=https://github.com/ProtonWallet/flutter-app.git
    ARG TAG=v1.0.0+66
    RUN git clone --branch $TAG $REPO /workspace

    # Get Flutter dependencies
    RUN flutter pub get

    # Expose the terminal for interactive debugging
    CMD ["/bin/bash"]

    ```

### We then proceed with the following steps: 

`$ docker build -t proton-build .`

**Then run:**

`$ docker run --rm -it proton-build`

Inside the workspace directory I move to the `./rust` folder to find the `cargo.toml` file. I then try to run:

`cargo build --target aarch64-linux-android --release --verbose`

This results in:

```
error: failed to parse manifest at `/workspace/rust/Cargo.toml`

Caused by:
  registry index was not found in any configuration: `proton_internal`
```

We tried several times with various iterations of Docker images which we thought was compatible with flutter and rust dependencies. All of them failed. 

At this stage, we feel that this internal registry `proton_internal`, may be causing the failure of most builds. 

For this reason, we filed an [issue](https://github.com/ProtonWallet/flutter-app/issues/4) in their repository in the hopes that we can collaborate with the Proton team. For the meantime, we determine that this app's source, **does not build** due to insufficient build instructions and the possibility of internal registries that may be causing the build failures.

## App Description from Play

From their terms:

- Generate wallet addresses and associated private keys that you may use to send and receive digital assets;
- Associate said wallet addresses with your email address;
- Access third-party services through functionality made available by third-party service provider(s);
- View digital asset price information made available by third party service provider(s)
- Broadcast digital asset transaction data to various blockchains supported by Proton Wallet without requiring to download or install the associated blockchain-based software on your local device.

## Analysis 

As of 2024-07-25, the app is still in early access which would require an invite. If we go by its claims, then this app would be **for verification**