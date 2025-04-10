---
wsId: ShapeShift
title: 'ShapeShift: Crypto Platform'
altTitle: 
authors:
- leo
- danny
users: 500000
appId: com.shapeshift.droid_shapeshift
appCountry: 
released: 2015-10-26
updated: 2024-06-20
version: 3.1.0
stars: 3.3
ratings: 2913
reviews: 511
website: https://ShapeShift.com
repository: https://github.com/shapeshift/mobile-app
issue: https://github.com/shapeshift/mobile-app/issues/104
icon: com.shapeshift.droid_shapeshift.png
bugbounty: 
meta: ok
verdict: nonverifiable
appHashes: []
date: 2024-08-09
signer: 
reviewArchive: 
twitter: ShapeShift_io
social:
- https://www.facebook.com/ShapeShiftPlatform
- https://www.instagram.com/shapeshift_io
- https://www.youtube.com/channel/UCrZ2Ml63kLwZJ6amqoGaZeQ
- https://t.me/shapeshiftofficial
redirect_from:
- /com.shapeshift.droid_shapeshift/
developerName: ShapeShift.com
features: 

---

## Split APK Semi-Auto Builds 2024-08-09  

We started with creating a Dockerfile that can build multiple artifacts. We began by extracting the official apks from our phone by executing our [apkextractor_sync.sh](https://gitlab.com/walletscrutiny/walletScrutinyCom/-/blob/master/apkextractor_sync.sh?ref_type=heads) script. 

We upload this manually to the server.

Still in our manual build folder, we create a `com.shapeshift.droid_shapeshift.sh` script and its partner `Dockerfile`

### App specific script that builds the split apks

`com.shapeshift.droid_shapeshift.sh`:

  ```
  #!/bin/bash

  # Set script to exit on any error
  set -e

  # Define directories
  SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )"
  SPLITS_DIR="${SCRIPT_DIR}/fromBuildSplits"
  UNZIPPED_DIR="${SCRIPT_DIR}/unzipped-fromBuildSplits"
  OFFICIAL_APKS_DIR="/var/shared/apk/com.shapeshift.droid_shapeshift/328-splits/official"
  OFFICIAL_NORMALIZED_DIR="/tmp/shapeshift-build/fromOfficial"
  BUILD_NORMALIZED_DIR="/tmp/shapeshift-build/fromBuild"

  # Ensure required directories exist
  mkdir -p "${SPLITS_DIR}"
  mkdir -p "${UNZIPPED_DIR}"
  mkdir -p "${OFFICIAL_NORMALIZED_DIR}"
  mkdir -p "${OFFICIAL_NORMALIZED_DIR}/apks"
  mkdir -p "${BUILD_NORMALIZED_DIR}"

  # Build Docker image with no cache
  echo "Building Docker image..."
  docker build --no-cache -t shapeshift-build .

  # Check if container already exists and remove it
  if [ "$(docker ps -aq -f name=shapeshift-container)" ]; then
      echo "Removing existing container..."
      docker rm -f shapeshift-container
  fi

  # Run Docker container
  echo "Running Docker container..."
  docker run -d --name shapeshift-container shapeshift-build tail -f /dev/null

  # Copy artifacts from container
  echo "Copying artifacts from container..."
  docker cp shapeshift-container:/app/android/app/build/outputs/apk/release/splits "${SPLITS_DIR}"

  # Stop and remove the container
  docker stop shapeshift-container
  docker rm shapeshift-container

  # Process split APKs from the container
  echo "Processing split APKs from the build..."
  cd "${SPLITS_DIR}/splits"
  for apk in base-*.apk; do
      if [[ -f "$apk" ]]; then
          # Extract name without 'base-' prefix and '.apk' suffix
          name=$(echo "$apk" | sed 's/^base-//; s/\.apk$//')
          
          # Normalize name
          case "$name" in
              "armeabi_v7a") folder="armeabi_v7a" ;;
              "en") folder="en" ;;
              "master") folder="base" ;;
              "xhdpi") folder="xhdpi" ;;
              *) folder="$name" ;;  # For any unexpected APKs
          esac
          
          # Create folder and unzip
          mkdir -p "${BUILD_NORMALIZED_DIR}/${folder}"
          unzip -q "$apk" -d "${BUILD_NORMALIZED_DIR}/${folder}"
          echo "Unzipped $apk to ${folder}/"
      fi
  done

  # Copy official APKs and normalize their names
  echo "Copying and normalizing official APKs..."
  cd "${OFFICIAL_APKS_DIR}"
  for apk in base.apk split_config.*.apk; do
      if [[ -f "$apk" ]]; then
          # Normalize name
          name=$(echo "$apk" | sed 's/^split_config\.//; s/\.apk$//')
          folder="${name}"
          
          # Create folder and unzip
          mkdir -p "${OFFICIAL_NORMALIZED_DIR}/${folder}"
          unzip -q "$apk" -d "${OFFICIAL_NORMALIZED_DIR}/${folder}"
          echo "Unzipped $apk to ${folder}/"

          # Move APK to 'apks' folder
          mv "$apk" "${OFFICIAL_NORMALIZED_DIR}/apks/${name}.apk"
      fi
  done

  # Echo a message that diff is now being run
  echo -e "\e[96mRunning diff...\e[0m"

  # Run diff for like vs like folders
  for folder in armeabi_v7a en base xhdpi; do
      if [ -d "${OFFICIAL_NORMALIZED_DIR}/${folder}" ] && [ -d "${BUILD_NORMALIZED_DIR}/${folder}" ]; then
          echo "Comparing ${folder}..."
          diff -r "${OFFICIAL_NORMALIZED_DIR}/${folder}/" "${BUILD_NORMALIZED_DIR}/${folder}/"
      fi
  done

  echo "Comparison complete!"
  ```

### Dockerfile

  ```
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

  ```

### Diff Results between the split apks
    
  ```
  $ diff -r fromOfficial/base fromBuild/base
  Binary files fromOfficial/base/AndroidManifest.xml and fromBuild/base/AndroidManifest.xml differ
  Only in fromOfficial/base/assets: dexopt
  Binary files fromOfficial/base/assets/index.android.bundle and fromBuild/base/assets/index.android.bundle differ
  Only in fromOfficial/base/META-INF: BNDLTOOL.RSA
  Only in fromOfficial/base/META-INF: BNDLTOOL.SF
  Only in fromOfficial/base/META-INF: MANIFEST.MF
  Binary files fromOfficial/base/res/mipmap-mdpi-v4/ic_launcher_round.png and fromBuild/base/res/mipmap-mdpi-v4/ic_launcher_round.png differ
  Binary files fromOfficial/base/res/mipmap-xhdpi-v4/ic_launcher_round.png and fromBuild/base/res/mipmap-xhdpi-v4/ic_launcher_round.png differ
  Binary files fromOfficial/base/res/mipmap-xxxhdpi-v4/ic_launcher_foreground.png and fromBuild/base/res/mipmap-xxxhdpi-v4/ic_launcher_foreground.png differ
  Binary files fromOfficial/base/res/mipmap-xxxhdpi-v4/ic_launcher.png and fromBuild/base/res/mipmap-xxxhdpi-v4/ic_launcher.png differ
  Only in fromBuild/base/res/xml: locales_config.xml
  Binary files fromOfficial/base/res/xml/splits0.xml and fromBuild/base/res/xml/splits0.xml differ
  Binary files fromOfficial/base/resources.arsc and fromBuild/base/resources.arsc differ
  Only in fromOfficial/base: stamp-cert-sha256

  danny@lw10:/tmp/shapeshift-build$ diff -r fromOfficial/xhdpi fromBuild/xhdpi
  Binary files fromOfficial/xhdpi/AndroidManifest.xml and fromBuild/xhdpi/AndroidManifest.xml differ
  Only in fromOfficial/xhdpi: META-INF
  Binary files fromOfficial/xhdpi/res/drawable-xhdpi-v4/splashscreen_image.png and fromBuild/xhdpi/res/drawable-xhdpi-v4/splashscreen_image.png differ
  Binary files fromOfficial/xhdpi/resources.arsc and fromBuild/xhdpi/resources.arsc differ
  Only in fromOfficial/xhdpi: stamp-cert-sha256

  danny@lw10:/tmp/shapeshift-build$ diff -r fromOfficial/en fromBuild/en
  Binary files fromOfficial/en/AndroidManifest.xml and fromBuild/en/AndroidManifest.xml differ
  Only in fromOfficial/en: META-INF
  Binary files fromOfficial/en/resources.arsc and fromBuild/en/resources.arsc differ
  Only in fromOfficial/en: stamp-cert-sha256

  danny@lw10:/tmp/shapeshift-build$ diff -r fromOfficial/armeabi_v7a fromBuild/armeabi_v7a
  Binary files fromOfficial/armeabi_v7a/AndroidManifest.xml and fromBuild/armeabi_v7a/AndroidManifest.xml differ
  Binary files fromOfficial/armeabi_v7a/lib/armeabi-v7a/libexpo-modules-core.so and fromBuild/armeabi_v7a/lib/armeabi-v7a/libexpo-modules-core.so differ
  Only in fromOfficial/armeabi_v7a: META-INF
  Only in fromOfficial/armeabi_v7a: stamp-cert-sha256
      
  ```


{% include asciicast %}

After a successful build, we document the steps we've undertaken and publish an interim merge request. During the initial stages of our analysis, we try to reach out to the developers and inform them of our methodology and the resulting diffs. Differences in build variables, environment or some other cause, may result in a huge diff. For this reason, we filed a GitHub [issue](https://github.com/shapeshift/mobile-app/issues/104) in their repository. If developer outreach is successful, we can collaborate with the goal in making the build reproducible. 

We previously built from a single apk yesterday where the diffs were quite extensive. Our findings remain consistent when we built the split apks and ran a diff against the normalized and unzipped artifacts.

With the diffs across all split apks, that go beyond signing, version 3.1.0 of Shapeshift Android app is **non-verifiable**. 

## Update 2024-07-15

An [announcement](https://shapeshift.com/newsroom/shapeshift-releases-new-and-improved-mobile-app-and-migrates-legacy-users) was made on October 19, 2022 regarding ShapeShift's app:

> “In addition to the numerous improvements and new features, the new mobile app is fully open-source and the only backend is blockchain data一which we are actively working to decentralize with FOXChain. ShapeShift DAO is dedicated to building the best interface to the decentralized universe, and with new wallets, chains, and protocols being added each week, the vision is coming together. However, for this vision to fully come to fruition, the interface can’t just exist on the web; it must be available on mobile too.” - Willy Ogorzaly

- We confirmed the app has a Bitcoin wallet that can send/receive.
- It provided the 12-word seed phrases
- We confirmed the existence of its [GitHub repository](https://github.com/shapeshift/mobile-app) for the mobile app.
- This app is due **for verification**.

## Review 2021-05-23

ShapeShift is best known for their non-custodial exchange but this app appears
to be a wallet:

> **STORE YOUR CRYPTO IN A SECURE WALLET**<br>
  Setup a ShapeShift multi-chain wallet in seconds to store your crypto.

... and non-custodial:

> ShapeShift makes self-custody easy, never holding your coins, so you have
  complete control over your assets.

but is their code public? 

On the [referenced website](https://shapeshift.com/) there is no link back to
the app on App Store or Play Store but there is
[this site](https://shapeshift.com/invite) where they suggest having an
invite-only mobile app. When you provide them with your email (Seriously?) they ...
forward you to [this site](https://shapeshift.com/download) where there are
actually download links for both mobile apps.

As we couldn't find any source code we assume the app is closed source and
therefore **not verifiable**.
