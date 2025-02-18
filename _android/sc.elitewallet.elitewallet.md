---
wsId: eliteWallet
title: Elite Wallet
altTitle: 
authors:
- danny
users: 5000
appId: sc.elitewallet.elitewallet
appCountry: 
released: 2022-11-22
updated: 2024-03-25
version: 1.3.1
stars: 4.3
ratings: 
reviews: 3
website: https://elitewallet.sc
repository: https://github.com/Elite-Labs/EliteWallet
issue: https://gitlab.com/walletscrutiny/walletScrutinyCom/-/issues/497
icon: sc.elitewallet.elitewallet.png
bugbounty: 
meta: removed
verdict: ftbfs
appHashes: 
date: 2024-07-10
signer: 
reviewArchive: 
twitter: EliteWallet
social:
- https://t.me/elite_wallet
- https://www.reddit.com/user/EliteTechnologies
redirect_from: 
developerName: Elite Lab
features: 

---

## App Description from Google Play

> Elite Wallet respects your privacy and allows you to safely store, exchange, and spend your Monero, Bitcoin, Litecoin, and Haven. Elite Wallet is focused on high privacy standards.
>
> Features of Elite Wallet:
>
> - Completely noncustodial and open-source. Your keys, your coins
> - Easily exchange between BTC, LTC, XMR, and dozens of other cryptocurrencies
> - Buy Bitcoin/Litecoin with credit/debit/bank and sell Bitcoin by bank transfer
> - Create multiple Bitcoin, Litecoin, Monero, and Haven wallets
> - You control your own seed and keys, including your Monero private view key

## Analysis 

- The app's homepage is currently offline, but is available via [archive.org](https://web.archive.org/web/20230305015316/https://elitewallet.sc/)
- We successfully installed the app, and it describes itself as:
  > *Awesome wallet for Monero, bitcoin, Litecoin, and Haven*
  > - With standard anonymity, no proxy server is used. 
  > - With advanced anonymity, Elite proxy server is used to anonymize internet traffic
  > - Elite anonymity uses a custom proxy server to anonymize internet traffic
- We tested standard anonymity and created a wallet.
- We assigned a 4-digit pin.
- We chose Bitcoin (Electrum) as the wallet currency and assigned 'test' as the wallet name.
- The 24-word seed phrases were provided.
- We were provided with a Bech32 BTC address
- The seed phrases can be backed-up via the security and backup settings.

We failed to build the app from source after several attempts over a time period.

## Build Attempt 2024-06-10

- There have been several attempts to build this app and several related issues:
  - **2023-02-16** - Emanuel raised [issue No.6](https://github.com/Elite-Labs/EliteWallet/issues/6) in the elitewallet repository, concerning incorrect build instructions. Changes were applied to the [Elitewallet Android build guide](https://github.com/Elite-Labs/EliteWallet/blob/main/howto-build-android.md).
  - **2024-04-26** - Chad was able to create a [Dockerfile](https://github.com/Elite-Labs/EliteWallet/issues/12#issuecomment-2078036154). The last time we attempted to build this, we failed due to:
> 
>  FAILURE: Build failed with an exception.
>
> * Where:
> Script '/home/developer/elite_wallet/.flutter/packages/flutter_tools/gradle/flutter.gradle' line: 1201
> 
> * What went wrong:
> Execution failed for task ':app:compileFlutterBuildRelease'.
> Process 'command '/home/developer/elite_wallet/.flutter/bin/flutter'' finished with non-zero exit value 1

A complete [pastebin](https://pastebin.com/cGknq5Y1) of the build.log is available.

## Build Attempt 2024-06-11 

Based on the instructions for an [automatic build](https://github.com/Elite-Labs/EliteWallet/issues/12#issuecomment-2078036154), we created a dockerfile to isolate the process:

  - Used latest Ubuntu LTS version as base image
  - Set environment variables for Android SDK and Flutter
  - Install system dependencies
  - Install Android SDK
  - Install Android NDK
  - Install Flutter
  - Download and extract Gradle Wrapper with no ownership change
  - Create a non-root user for security
  - Switch to the appuser
  - Clone the EliteWallet repository
  - Set working directory
  - Build dependencies
  - Build the app

This encountered multiple errors related to permissions. This is the tail-end:

```
Downloading Gradle Wrapper...                                       11ms
/usr/bin/tar: gradle/wrapper/gradle-wrapper.properties: Cannot change ownership to uid 397546, gid 5000: Invalid argument
/usr/bin/tar: gradle/wrapper/gradle-wrapper.jar: Cannot change ownership to uid 397546, gid 5000: Invalid argument
/usr/bin/tar: gradle/wrapper: Cannot change ownership to uid 397546, gid 5000: Invalid argument
/usr/bin/tar: gradle: Cannot change ownership to uid 397546, gid 5000: Invalid argument
/usr/bin/tar: gradlew: Cannot change ownership to uid 397546, gid 5000: Invalid argument
/usr/bin/tar: gradlew.bat: Cannot change ownership to uid 397546, gid 5000: Invalid argument
/usr/bin/tar: NOTICE: Cannot change ownership to uid 397546, gid 5000: Invalid argument
/usr/bin/tar: Exiting with failure status due to previous errors
Downloading Gradle Wrapper...                                        8ms
/usr/bin/tar: gradle/wrapper/gradle-wrapper.properties: Cannot change ownership to uid 397546, gid 5000: Invalid argument
/usr/bin/tar: gradle/wrapper/gradle-wrapper.jar: Cannot change ownership to uid 397546, gid 5000: Invalid argument
/usr/bin/tar: gradle/wrapper: Cannot change ownership to uid 397546, gid 5000: Invalid argument
/usr/bin/tar: gradle: Cannot change ownership to uid 397546, gid 5000: Invalid argument
/usr/bin/tar: gradlew: Cannot change ownership to uid 397546, gid 5000: Invalid argument
/usr/bin/tar: gradlew.bat: Cannot change ownership to uid 397546, gid 5000: Invalid argument
/usr/bin/tar: NOTICE: Cannot change ownership to uid 397546, gid 5000: Invalid argument
/usr/bin/tar: Exiting with failure status due to previous errors
Flutter could not download and/or extract https://storage.googleapis.com/flutter_infra_release/gradle-wrapper/fd5c1f2c013565a3bea56ada6df9d2b8e96d56aa/gradle-wrapper.tgz. Ensure you have network connectivity and all of the required dependencies listed at flutter.dev/setup.
The original exception was: ProcessException: The command failed with exit code 2
  Command: tar -xzf /opt/flutter/bin/cache/downloads/storage.googleapis.com/flutter_infra_release/gradle-wrapper/fd5c1f2c013565a3bea56ada6df9d2b8e96d56aa/gradle-wrapper.tgz -C /opt/flutter/bin/cache/artifacts/gradle_wrapper.
Error: building at STEP "RUN git clone https://github.com/flutter/flutter.git "$FLUTTER_ROOT" &&     "$FLUTTER_ROOT/bin/flutter" precache": while running runtime: exit status 1
+ podman run -it --volume /tmp/test_sc.elitewallet.elitewallet:/mnt --rm -u root elitewallet bash -c 'cp /home/appuser/elite_wallet/build/app/outputs/flutter-apk/app-release.apk /mnt/'
Resolving "elitewallet" using unqualified-search registries (/etc/containers/registries.conf)
Trying to pull docker.io/library/elitewallet:latest...
Error: initializing source docker://elitewallet:latest: reading manifest latest in docker.io/library/elitewallet: errors:
denied: requested access to the resource is denied
unauthorized: authentication required
```

I then try to extract Gradle as the root user by modifying these lines:

```
# Install Flutter
RUN git clone https://github.com/flutter/flutter.git "$FLUTTER_ROOT" && \
    "$FLUTTER_ROOT/bin/flutter" precache

# Download and extract Gradle Wrapper
RUN wget -O /tmp/gradle-wrapper.tgz https://dl.google.com/android/repository/gradle-wrapper-7.4.2-all.zip && \
    tar -xzf /tmp/gradle-wrapper.tgz -C /opt/flutter/bin/cache/artifacts/gradle_wrapper && \
    rm /tmp/gradle-wrapper.tgz

# Create a non-root user for security
RUN useradd -ms /bin/bash appuser

# Switch to the appuser
USER appuser
WORKDIR /home/appuser
```

I then run the test script again. and received an identical error pertaining to Gradle and Flutter: 

```
Downloading Material fonts...                                      299ms
Downloading Gradle Wrapper...                                       11ms
/usr/bin/tar: gradle/wrapper/gradle-wrapper.properties: Cannot change ownership to uid 397546, gid 5000: Invalid argument
/usr/bin/tar: gradle/wrapper/gradle-wrapper.jar: Cannot change ownership to uid 397546, gid 5000: Invalid argument
/usr/bin/tar: gradle/wrapper: Cannot change ownership to uid 397546, gid 5000: Invalid argument
/usr/bin/tar: gradle: Cannot change ownership to uid 397546, gid 5000: Invalid argument
/usr/bin/tar: gradlew: Cannot change ownership to uid 397546, gid 5000: Invalid argument
/usr/bin/tar: gradlew.bat: Cannot change ownership to uid 397546, gid 5000: Invalid argument
```

The fix was to `manually download and extract the Gradle Wrapper with the --no-same-owner flag.`

It worked, and now we address a different problem, it cannot find the build_deps.sh script which should be in "scripts" directory. An excerpt:

```
STEP 12/15: RUN git clone https://github.com/Elite-Labs/EliteWallet.git elite_wallet
Cloning into 'elite_wallet'...
--> 909274762c9
STEP 13/15: WORKDIR /home/appuser/elite_wallet
--> 18d00113135
STEP 14/15: RUN ./scripts/build_deps.sh
./scripts/build_deps.sh: 4: [[: not found
./scripts/build_deps.sh: 7: [[: not found
./scripts/build_deps.sh: 10: [[: not found
./scripts/build_deps.sh: 18: Syntax error: "(" unexpected
Error: building at STEP "RUN ./scripts/build_deps.sh": while running runtime: exit status 2
+ podman run -it --volume /tmp/test_sc.elitewallet.elitewallet:/mnt --rm -u root elitewallet bash -c 'cp /home/appuser/elite_wallet/build/app/outputs/flutter-apk/app-release.apk /mnt/'
Resolving "elitewallet" using unqualified-search registries (/etc/containers/registries.conf)
Trying to pull docker.io/library/elitewallet:latest...
Error: initializing source docker://elitewallet:latest: reading manifest latest in docker.io/library/elitewallet: errors:
denied: requested access to the resource is denied
unauthorized: authentication required
```

We then adjust this part of the Dockerfile, to ensure that `build_deps.sh` from the repository runs.

  > # Build dependencies using bash
  > RUN /bin/bash ./scripts/build_deps.sh
  >
  > # Build the app
  > RUN /bin/bash ./scripts/build.sh

This time, running the test script, successfully executed but with another problem: 

```
[!] No Android SDK found. Try setting the ANDROID_SDK_ROOT environment variable.
Error: building at STEP "RUN /bin/bash ./scripts/build.sh": while running runtime: exit status 1
```

We believe, we have set that in the Dockerfile, but to be doubly sure, we make changes to both Dockerfile and the WS elitewallet script:

```
# Use the latest Ubuntu LTS as the base image
FROM ubuntu:22.04

# Set environment variables for Android SDK and Flutter
ENV ANDROID_SDK_ROOT="/opt/android-sdk" \
    ANDROID_HOME="/opt/android-sdk" \
    FLUTTER_ROOT="/opt/flutter"

ENV PATH="$PATH:$ANDROID_SDK_ROOT/tools:$ANDROID_SDK_ROOT/platform-tools"

# Install system dependencies
RUN apt-get update && \
    apt-get install -y \
        git \
        curl \
        unzip \
        openjdk-11-jdk \
        wget \
        sudo && \
    rm -rf /var/lib/apt/lists/*

# Install Android SDK
RUN mkdir -p "$ANDROID_SDK_ROOT" && \
    wget -O android_sdk.zip https://dl.google.com/android/repository/commandlinetools-linux-8512546_latest.zip && \
    unzip android_sdk.zip -d "$ANDROID_SDK_ROOT" && \
    rm android_sdk.zip

# Install Android NDK
RUN mkdir -p "$ANDROID_SDK_ROOT/ndk" && \
    wget -O android_ndk.zip https://dl.google.com/android/repository/android-ndk-r17c-linux-x86_64.zip && \
    unzip android_ndk.zip -d "$ANDROID_SDK_ROOT/ndk" && \
    rm android_ndk.zip

# Install Flutter
RUN git clone https://github.com/flutter/flutter.git "$FLUTTER_ROOT"

# Manually download and extract Gradle Wrapper with no ownership change
RUN wget -O /tmp/gradle-wrapper.tgz https://storage.googleapis.com/flutter_infra_release/gradle-wrapper/fd5c1f2c013565a3bea56ada6df9d2b8e96d56aa/gradle-wrapper.tgz && \
    mkdir -p /opt/flutter/bin/cache/artifacts/gradle_wrapper && \
    tar --no-same-owner -xzf /tmp/gradle-wrapper.tgz -C /opt/flutter/bin/cache/artifacts/gradle_wrapper && \
    rm /tmp/gradle-wrapper.tgz

# Run Flutter precache as non-root user
RUN useradd -ms /bin/bash appuser && \
    chown -R appuser:appuser /opt/flutter

USER appuser
WORKDIR /home/appuser

# Precache Flutter
RUN $FLUTTER_ROOT/bin/flutter precache

# Clone the EliteWallet repository
RUN git clone https://github.com/Elite-Labs/EliteWallet.git elite_wallet

# Set working directory
WORKDIR /home/appuser/elite_wallet

# Build dependencies using bash with exported environment variables
RUN export ANDROID_SDK_ROOT="/opt/android-sdk" ANDROID_HOME="/opt/android-sdk" FLUTTER_ROOT="/opt/flutter" PATH="$PATH:$ANDROID_SDK_ROOT/tools:$ANDROID_SDK_ROOT/platform-tools" && \
    /bin/bash ./scripts/build_deps.sh

# Build the app using bash with exported environment variables
RUN export ANDROID_SDK_ROOT="/opt/android-sdk" ANDROID_HOME="/opt/android-sdk" FLUTTER_ROOT="/opt/flutter" PATH="$PATH:$ANDROID_SDK_ROOT/tools:$ANDROID_SDK_ROOT/platform-tools" && \
    /bin/bash ./scripts/build.sh
```

The sc.elitewallet.elitewallet.sh script:

```
#!/bin/bash

# Set environment variables for Android SDK and Flutter
export ANDROID_SDK_ROOT="/opt/android-sdk"
export ANDROID_HOME="/opt/android-sdk"
export FLUTTER_ROOT="/opt/flutter"
export PATH="$PATH:$ANDROID_SDK_ROOT/tools:$ANDROID_SDK_ROOT/platform-tools"

repo=https://github.com/Elite-Labs/EliteWallet
tag=main
builtApk=$workDir/build/app/outputs/flutter-apk/app-release.apk

test() {
  # Build the Docker image
  podman build \
    --tag elitewallet \
    --cgroup-manager cgroupfs \
    --build-arg UID=$(id -u) \
    --build-arg TAG=$tag \
    --file $SCRIPT_DIR/test/android/sc.elitewallet.elitewallet.dockerfile .

  # Run the Docker container and copy the built APK
  podman run \
    -it \
    --volume $workDir:/mnt \
    --rm \
    -u root \
    elitewallet \
    bash -c 'cp /home/appuser/elite_wallet/build/app/outputs/flutter-apk/app-release.apk /mnt/'

  # Clean up Docker resources
  podman rmi elitewallet -f
  podman image prune -f
}
```
The error for this attempt:

> 1. [!] No Android SDK found. Try setting the ANDROID_SDK_ROOT environment variable.
> Error: building at STEP "RUN export ANDROID_SDK_ROOT="/opt/android-sdk" ANDROID_HOME="/opt/android-sdk" FLUTTER_ROOT="/opt/flutter" PATH="$PATH:$ANDROID_SDK_ROOT/tools:$ANDROID_SDK_ROOT/platform-tools" &&     /bin/bash ./scripts/build.sh": while running runtime: exit status 1

We try to modify it by setting `ENV PATH`:

```
ENV PATH="$PATH:$ANDROID_SDK_ROOT/cmdline-tools/latest/bin:$ANDROID_SDK_ROOT/platform-tools:$FLUTTER_ROOT/bin"
```

We also modify the Android SDK installation:

```
RUN mkdir -p "$ANDROID_SDK_ROOT/cmdline-tools" && \
    wget -O android_sdk.zip https://dl.google.com/android/repository/commandlinetools-linux-8512546_latest.zip && \
    unzip android_sdk.zip -d "$ANDROID_SDK_ROOT/cmdline-tools/latest" && \
    rm android_sdk.zip
```

And we also accept the licenses:

```
# Accept licenses
RUN yes | $ANDROID_SDK_ROOT/cmdline-tools/latest/bin/sdkmanager --licenses
```

### In sc.elitewallet.elitewallet.sh script:

We replace the Android SDK root export path:

```
export PATH="$PATH:$ANDROID_SDK_ROOT/cmdline-tools/latest/bin:$ANDROID_SDK_ROOT/platform-tools:$FLUTTER_ROOT/bin"
```

We then test it again and get:

```
STEP 6/17: RUN yes | $ANDROID_SDK_ROOT/cmdline-tools/latest/bin/sdkmanager --licenses
/bin/sh: 1: /opt/android-sdk/cmdline-tools/latest/bin/sdkmanager: not found
```

We note the discrepancy in the folder for extraction:

```
Archive:  android_sdk.zip
 extracting: /opt/android-sdk/cmdline-tools/latest/cmdline-tools/bin/avdmanager  
 extracting: /opt/android-sdk/cmdline-tools/latest/cmdline-tools/bin/sdkmanager 
```

We also take note that it was trying to execute sdkmanager at:

```
STEP 6/17: RUN yes | $ANDROID_SDK_ROOT/cmdline-tools/latest/bin/sdkmanager --licenses
/bin/sh: 1: /opt/android-sdk/cmdline-tools/latest/bin/sdkmanager: not found
```

We then ran the the test script with these changes, and it resulted in this error:

```

Downloading android-arm-profile/linux-x64 tools...               1,044ms
Downloading android-arm-release/linux-x64 tools...                 969ms
Downloading android-arm64-profile/linux-x64 tools...               825ms
Downloading android-arm64-release/linux-x64 tools...               876ms
Downloading android-x64-profile/linux-x64 tools...                 495ms
Downloading android-x64-release/linux-x64 tools...                 868ms
The plugin `ew_monero` uses a deprecated version of the Android embedding.
To avoid unexpected runtime failures, or future build failures, try to see if this plugin supports the Android V2 embedding. Otherwise, consider removing it since a future release of Flutter will remove these deprecated APIs.
If you are plugin author, take a look at the docs for migrating the plugin to the V2 embedding: https://flutter.dev/go/android-plugin-migration.

Running Gradle task 'bundleRelease'...                          
Checking the license for package NDK (Side by side) 23.1.7779620 in /opt/android-sdk/licenses
License for package NDK (Side by side) 23.1.7779620 accepted.
Preparing "Install NDK (Side by side) 23.1.7779620 (revision: 23.1.7779620)".
Warning: Failed to read or create install properties file.

FAILURE: Build failed with an exception.

* What went wrong:
A problem occurred configuring project ':ew_haven'.
> com.android.builder.sdk.InstallFailedException: Failed to install the following SDK components:
      ndk;23.1.7779620 NDK (Side by side) 23.1.7779620
  The SDK directory is not writable (/opt/android-sdk)


* Try:
> Run with --stacktrace option to get the stack trace.
> Run with --info or --debug option to get more log output.
> Run with --scan to get full insights.

* Get more help at https://help.gradle.org

BUILD FAILED in 3m 53s
Running Gradle task 'bundleRelease'...                            234.8s
Gradle task bundleRelease failed with exit code 1
Error: building at STEP "RUN /bin/bash -c "source /etc/environment && /bin/bash ./scripts/build.sh"": while running runtime: exit status 1
+ podman run -it --volume /tmp/test_sc.elitewallet.elitewallet:/mnt --rm -u root elitewallet bash -c 'cp /home/appuser/elite_wallet/build/app/outputs/flutter-apk/app-release.apk /mnt/'
Resolving "elitewallet" using unqualified-search registries (/etc/containers/registries.conf)
Trying to pull docker.io/library/elitewallet:latest...
Error: initializing source docker://elitewallet:latest: reading manifest latest in docker.io/library/elitewallet: errors:
denied: requested access to the resource is denied
unauthorized: authentication required
```

1. The SDK directory is not writable because the Docker build is running as a non-root user.
2. The solution offered was:

> temporarily switch to the root user to install the NDK components and then switch back to the non-root user for the rest of the build process.

We achieve this by adding this to line 31 of the dockerfile:

```
$ANDROID_SDK_ROOT/cmdline-tools/latest/bin/sdkmanager "ndk;23.1.7779620"
```

Create and switch to a non-root user for the rest of the process at line 50:

```
chown -R appuser:appuser /opt/flutter /opt/android-sdk
```

At this juncture, I was able to run up to the last step which is to to run the fourth command for the **automatic build**, which is

`./scripts/build.sh`

This resulted in an error, of which this is the [tail-end pastebin.](https://pastebin.com/5iR8hCpz)

After several failed attempts, and with some errors emanating from the build.sh script, we'll have to mark this as **Failed to Build from Source**, until 
somebody could prove otherwise.

We also take note that elitewallet has opened a [merge request](https://gitlab.com/fdroid/fdroiddata/-/merge_requests/12936) on F-Droid in 2023. Multiple build failures led to the MR not getting merged.





