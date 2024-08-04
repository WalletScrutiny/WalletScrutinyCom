---
wsId: swissBitcoinPay
title: Swiss Bitcoin Pay
altTitle: 
authors:
- danny
users: 1000
appId: ch.swissbitcoinpay.checkout
appCountry: 
released: 2022-11-15
updated: 2024-08-03
version: 2.1.0
stars: 4.7
ratings: 
reviews: 
size: 
website: https://swiss-bitcoin-pay.ch
repository: https://github.com/SwissBitcoinPay/app
issue: https://github.com/SwissBitcoinPay/app/issues/53
icon: ch.swissbitcoinpay.checkout.png
bugbounty: 
meta: ok
verdict: ftbfs
date: 2024-06-04
signer: 
reviewArchive: 
twitter: SwissBitcoinPay
social:
- https://www.linkedin.com/company/swiss-bitcoin-pay
- https://www.youtube.com/@swissbitcoinpay
redirect_from: 
developerName: Swiss Bitcoin Pay
features:
- ln

---

## App Description from Google Play

> Accept Bitcoin in your business.
>
> Worldwide. Free to start. No hardware. Non-custodial.
>
> The simplest way to accept Bitcoin payments in your Business, restaurant, bar, and others.
>
> So simple to use:
> 1. You type the amount in your local currency.
> 2. Client scan the QR or tap a Lightning NFC Card.
> 3. Paid.
>
> Maximum compatibility:
>
> Through the same screen, receive in:
> Bitcoin On-chain
> Lightning
> Lightning-NFC standard
>
> Non-custodial
>
> After clients have paid through Onchain and/or Lightning, the Lightning-BTC will be converted to Onchain-BTC (free of charge) and will all be sent to your private wallet (free of charge), as configured in your account.

- All the bitcoins that you charge via Swiss Bitcoin Pay will be sent to the address you provide.
- Lightning to Onchain conversions and miner fees are always free of charge for you
- Payout is done every day at 0:00 UTC
- A cryptographic signature of your Bitcoin wallet is required to prove ownership.

## Analysis 

- Account creation was straight-forward. It only required an email address.
- The 12-word seed phrase were provided during wallet creation.
- They claim to have their app on [F-Droid](https://swiss-bitcoin-pay.ch/fdroid/repo/).
- They provided the fingerprint (SHA-256) of the repository signing key.
- I requested Swiss Pay to provide build instructions using a Docker container. This app is **[for verification](https://github.com/SwissBitcoinPay/app/issues/53)**.

# 2024-06-04 Build Attempt

I started with a bare ubuntu Docker container: 

```
# Use the official Ubuntu base image
FROM ubuntu:20.04

# Prevent interactive prompts during package installation
ENV DEBIAN_FRONTEND=noninteractive

# Update package list and install basic tools
RUN apt-get update && apt-get install -y \
    curl \
    wget \
    unzip \
    git \
    vim \
    sudo

# Clean up
RUN apt-get clean && rm -rf /var/lib/apt/lists/*

# Set working directory
WORKDIR /root
```

### Then run

`docker run -it --name swissbitcoinpay-setup ubuntu-bare /bin/bash`

## Restarting and Reconfiguring the Container

### Start a new container from the base Ubuntu image:
  
```
docker run -it --name swissbitcoinpay-setup ubuntu-bare /bin/bash
```
### Reinstall the necessary dependencies within the container:

# Update package list and install basic tools
```
apt-get update && apt-get install -y \
    curl \
    wget \
    unzip \
    git \
    vim \
    sudo
```

### Install Node.js and npm
```
curl -sL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
```
### Install Yarn
`npm install -g yarn`

### Install React Native CLI
```
npm install -g react-native-cli
```

### Install JDK
```
apt-get install -y openjdk-17-jdk
```

### Set JAVA_HOME
```
export JAVA_HOME=/usr/lib/jvm/java-17-openjdk-amd64
export PATH=$JAVA_HOME/bin:$PATH
```

### Download and unzip the Android SDK command-line tools
```
wget https://dl.google.com/android/repository/commandlinetools-linux-8092744_latest.zip -O android-sdk.zip
mkdir -p /usr/lib/android-sdk/cmdline-tools
unzip android-sdk.zip -d /usr/lib/android-sdk/cmdline-tools
mv /usr/lib/android-sdk/cmdline-tools/cmdline-tools /usr/lib/android-sdk/cmdline-tools/latest
rm android-sdk.zip
```

# Set environment variables and update PATH
```
export ANDROID_HOME=/usr/lib/android-sdk
export PATH=$PATH:$ANDROID_HOME/cmdline-tools/latest/bin:$ANDROID_HOME/platform-tools
```

### Install the Android SDK packages
```
yes | sdkmanager --licenses
sdkmanager "platforms;android-33" "build-tools;33.0.2"
```
### Clone the project repository and install project dependencies:

```
git clone https://github.com/SwissBitcoinPay/app /root/swissbitcoinpay
cd /root/swissbitcoinpay
yarn install
```

### Build the APK:

```
cd android
./gradlew assembleRelease
```
This results in build failure: 

```
> Task :react-native-vision-camera:compileReleaseKotlin
w: file:///root/swissbitcoinpay/node_modules/react-native-vision-camera/android/src/main/java/com/mrousavy/camera/core/utils/CamcorderProfileUtils.kt:66:42 'get(Int, Int): CamcorderProfile!' is deprecated. Deprecated in Java
w: file:///root/swissbitcoinpay/node_modules/react-native-vision-camera/android/src/main/java/com/mrousavy/camera/core/utils/CamcorderProfileUtils.kt:90:42 'get(Int, Int): CamcorderProfile!' is deprecated. Deprecated in Java
w: file:///root/swissbitcoinpay/node_modules/react-native-vision-camera/android/src/main/java/com/mrousavy/camera/react/CameraViewModule.kt:13:46 'ReactModule' is deprecated. Deprecated in Java
w: file:///root/swissbitcoinpay/node_modules/react-native-vision-camera/android/src/main/java/com/mrousavy/camera/react/CameraViewModule.kt:37:2 'ReactModule' is deprecated. Deprecated in Java

> Task :react-native-barcode-zxing-scan:verifyReleaseResources FAILED

FAILURE: Build failed with an exception.

* What went wrong:
Execution failed for task ':react-native-barcode-zxing-scan:verifyReleaseResources'.
> A failure occurred while executing com.android.build.gradle.tasks.VerifyLibraryResourcesTask$Action
   > Android resource linking failed
     ERROR: /root/swissbitcoinpay/node_modules/react-native-barcode-zxing-scan/android/build/intermediates/merged_res/release/values/values.xml:2759: AAPT: error: resource android:attr/lStar not found.
         

* Try:
> Run with --stacktrace option to get the stack trace.
> Run with --info or --debug option to get more log output.
> Run with --scan to get full insights.
> Get more help at https://help.gradle.org.

Deprecated Gradle features were used in this build, making it incompatible with Gradle 9.0.

You can use '--warning-mode all' to show the individual deprecation warnings and determine if they come from your own scripts or plugins.

For more on this, please refer to https://docs.gradle.org/8.3/userguide/command_line_interface.html#sec:command_line_warnings in the Gradle documentation.

BUILD FAILED in 1m 46s
842 actionable tasks: 681 executed, 161 up-to-date
```

Our interim assessment highlights failures regarding: `react-native-barcode-zxing-scan:verifyReleaseResources`.

We contacted them on [x.com](https://x.com/dannybuntu/status/1797828030167171307)