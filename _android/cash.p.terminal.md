---
wsId: 
title: P.CASH
altTitle: 
authors:
- danny
users: 5000
appId: cash.p.terminal
appCountry: 
released: 2023-02-10
updated: 2025-02-25
version: 0.41.2
stars: 
ratings: 
reviews: 
website: https://p.cash/
repository: https://github.com/piratecash/pcash-wallet-android
issue: 
icon: cash.p.terminal.png
bugbounty: 
meta: ok
verdict: nonverifiable
appHashes: 
date: 2024-09-12
signer: 
reviewArchive: 
twitter: PirateCash_NET
social:
- https://www.facebook.com/PirateCash
- https://discord.com/invite/cbTdqxx
- https://bitcointalk.org/index.php?topic=5050988
- https://www.reddit.com/r/PirateCash
- https://t.me/PirateCash_ENG
redirect_from: 
developerName: PirateCash and Cosanta foundation
features: 

---

## Update 2024-09-12

# Manual Build

We managed to build the split APKs and are in the process of automating the build and integrating with our test script.

We manually built the split APKs using this Dockerfile:

```
# Use an official openjdk runtime as a parent image
FROM openjdk:17-slim

# Define build arguments for dynamic paths
ARG appId
ARG versionCode
ARG date

# Set the dynamic working directory based on appId, versionCode, and date
WORKDIR /tmp/test_${appId}_${versionCode}_${date}

# Install required dependencies
RUN apt-get update && \
    apt-get install -y wget unzip git && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

# Install Gradle (replace the version with the one required by your project)
RUN wget https://services.gradle.org/distributions/gradle-7.2-bin.zip && \
    unzip gradle-7.2-bin.zip && \
    rm gradle-7.2-bin.zip && \
    mv gradle-7.2 /opt/gradle

# Set Gradle path
ENV PATH=$PATH:/opt/gradle/bin

# Install Bundletool (latest version can be replaced if needed)
RUN wget https://github.com/google/bundletool/releases/download/1.17.1/bundletool-all-1.17.1.jar && \
    mv bundletool-all-1.17.1.jar /usr/local/bin/bundletool.jar

# Install Android SDK command-line tools
RUN mkdir -p /usr/local/android-sdk-linux/cmdline-tools && \
    wget https://dl.google.com/android/repository/commandlinetools-linux-9477386_latest.zip && \
    unzip commandlinetools-linux-9477386_latest.zip -d /usr/local/android-sdk-linux/cmdline-tools && \
    rm commandlinetools-linux-9477386_latest.zip && \
    mv /usr/local/android-sdk-linux/cmdline-tools/cmdline-tools /usr/local/android-sdk-linux/cmdline-tools/latest

# Set Android SDK environment variables
ENV ANDROID_HOME=/usr/local/android-sdk-linux
ENV PATH=$ANDROID_HOME/cmdline-tools/latest/bin:$PATH
ENV PATH=$ANDROID_HOME/platform-tools:$PATH

# Accept Android SDK licenses and install SDK components
RUN yes | sdkmanager --licenses && \
    sdkmanager "platform-tools" "platforms;android-31" "build-tools;31.0.0"

# Copy the project repository and device spec to the dynamic working directory
# Ensure the project and device spec are in the build context during docker build
COPY . /tmp/test_${appId}_${versionCode}_${date}

# Clone the project repository
RUN git clone https://github.com/piratecash/pcash-wallet-android.git

# Change to the cloned project directory
WORKDIR /tmp/test_${appId}_${versionCode}_${date}/pcash-wallet-android

# Run Gradle to build the APK bundle
RUN ./gradlew bundleRelease

# Use Bundletool to build the APKs from the AAB
RUN java -jar /usr/local/bin/bundletool.jar build-apks \
    --bundle=app/build/outputs/bundle/release/app-release.aab \
    --output=apks.apks \
    --device-spec=/tmp/test_${appId}_${versionCode}_${date}/device-spec.json

# Unzip the generated APKs
RUN mkdir -p generated_apks && \
    unzip -q apks.apks -d generated_apks && \
    cd generated_apks && \
    mv splits/base-master.apk base.apk && \
    mv splits/base-armeabi_v7a.apk split_config.armeabi_v7a.apk && \
    mv splits/base-xhdpi.apk split_config.xhdpi.apk && \
    rm -rf splits

# Final step: display generated APKs
CMD ["ls", "-l", "generated_apks"]
```

- We then moved the built split apks to the `fromBuilt` folder, and copied the apks we got from our phone to `fromOfficial`. 
- We 'normalized' the apk names. For example, *split_config.armeabi_v7a.apk*, simply became **armeabi_v7a.apk**. 
- We then extracted the contents of the apks to their own respective folders.
- These are the results of running the diff:

```
danny@lw10:~/work/compare/cash.p.terminal/0.38.3$ diff -r from*/base
Binary files fromBuild/base/AndroidManifest.xml and fromOfficial/base/AndroidManifest.xml differ
Only in fromOfficial/base/assets: prepare.sh
Binary files fromBuild/base/classes2.dex and fromOfficial/base/classes2.dex differ
Binary files fromBuild/base/classes3.dex and fromOfficial/base/classes3.dex differ
Binary files fromBuild/base/classes4.dex and fromOfficial/base/classes4.dex differ
Binary files fromBuild/base/classes5.dex and fromOfficial/base/classes5.dex differ
Binary files fromBuild/base/classes6.dex and fromOfficial/base/classes6.dex differ
Binary files fromBuild/base/classes7.dex and fromOfficial/base/classes7.dex differ
Binary files fromBuild/base/classes8.dex and fromOfficial/base/classes8.dex differ
Binary files fromBuild/base/classes9.dex and fromOfficial/base/classes9.dex differ
Binary files fromBuild/base/res/xml/splits0.xml and fromOfficial/base/res/xml/splits0.xml differ
Binary files fromBuild/base/resources.arsc and fromOfficial/base/resources.arsc differ
Only in fromOfficial/base: stamp-cert-sha256
danny@lw10:~/work/compare/cash.p.terminal/0.38.3$ diff -r from*/armeabi_v7a
Binary files fromBuild/armeabi_v7a/AndroidManifest.xml and fromOfficial/armeabi_v7a/AndroidManifest.xml differ
Only in fromOfficial/armeabi_v7a: META-INF
Only in fromOfficial/armeabi_v7a: stamp-cert-sha256
danny@lw10:~/work/compare/cash.p.terminal/0.38.3$ diff -r from*/xhdpi
Binary files fromBuild/xhdpi/AndroidManifest.xml and fromOfficial/xhdpi/AndroidManifest.xml differ
Only in fromOfficial/xhdpi: META-INF
Binary files fromBuild/xhdpi/res/drawable-xhdpi-v4/ic_independence.png and fromOfficial/xhdpi/res/drawable-xhdpi-v4/ic_independence.png differ
Binary files fromBuild/xhdpi/res/drawable-xhdpi-v4/ic_knowledge.png and fromOfficial/xhdpi/res/drawable-xhdpi-v4/ic_knowledge.png differ
Binary files fromBuild/xhdpi/resources.arsc and fromOfficial/xhdpi/resources.arsc differ
Only in fromOfficial/xhdpi: stamp-cert-sha256
```

The **Issues** tab on the Pirate Cash repository, is hidden. We made a [Pull Request](https://github.com/piratecash/pcash-wallet-android/pull/1) on July 3, 2024 in lieu of an issue which we will be updating with the results we found here.

There is a considerable amount of diffs between the split apks. This means that Pirate Cash version 0.38.3 is **not reproducible**

## Update 2024-07-03

After updating the script, we found that this app is now [source-available](https://github.com/piratecash/pcash-wallet-android). This app is now **for verification**. 

We see from their repository that:

> This branch is 1599 commits ahead of, 1556 commits behind {% include walletLink.html wallet='android/io.horizontalsystems.bankwallet' verdict='true' %}

## App Description from Google Play

A powerful non-custodial multi-wallet for PirateCash, Cosanta, Bitcoin, Ethereum, Binance Smart Chain, Avalanche, Solana and other blockchains. Non-custodial crypto and NFT storage, onchain decentralized exchange, institutional grade analytics for cryptcurrency and NFT markets, extensive privacy controls and human oriented design.

## Analysis 

- A BTC wallet is available
- A 12-word mnemonic phrase is provided during startup. 
- We've verified their claim that this app is non-custodial. 
- The provider does not make any claims regarding source-availability
- A [search on GitHub](https://github.com/search?q=cash.p.terminal&type=code) for the app ID does not show any results.