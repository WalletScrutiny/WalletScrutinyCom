---
wsId: envoyFoundation
title: Envoy
altTitle: 
authors:
- danny
- keraliss
users: 1000
appId: com.foundationdevices.envoy
appCountry: US
released: 2022-04-01
updated: 2024-06-18
version: 1.7.0
stars: 4
ratings: 
reviews: 4
size: 
website: https://foundationdevices.com/
repository: https://github.com/Foundation-Devices/envoy
issue: 
icon: com.foundationdevices.envoy.jpg
bugbounty: 
meta: ok
verdict: ftbfs
date: 2024-08-06
signer: 
reviewArchive: 
twitter: FOUNDATIONdvcs
social:
- https://www.linkedin.com/company/foundationdevices
- https://www.youtube.com/@foundationdevices
- https://www.reddit.com/r/FoundationDevices
- https://t.me/foundationdevices
redirect_from: 
developerName: Foundation Devices
features: 

---
**Update 2024-08-06:**

**Review: Envoy Wallet Build**

The build process for the Envoy Wallet was successfully initiated and completed using the provided Dockerfile. The Docker image was built and tagged without errors; however, significant issues were encountered during the build and testing phases.

**Commands Used:**

1. **Docker Build Command:**
   ```bash
   sudo docker build -t envoy_wallet -f envoy.dockerfile .
   ```
   **Output:**
   ```   
   Successfully built ab87c72c8cca
   Successfully tagged envoy-android:latest
   ```

   **APK Not Found Error:**
   ```   
   Built APK not found at /tmp/test_com.foundationdevices.envoy/app/releases/app-release.apk
   No APK found.
   ```

Despite the Docker image building and running successfully, the APK was not found, which suggests issues with the build output configuration or directory paths.

**Manual Build Attempt:**

After the initial build failed to produce a working APK, a manual Docker build was performed:

1. **Manual Docker Build and Run Commands:**
   ```bash
   sudo docker build -t envoy_wallet -f envoy.dockerfile .
   sudo docker run -d --name envoy_build_container_new envoy_wallet
   sudo docker cp envoy_build_container_new:/root/repo/build/app/outputs/flutter-apk/app-release.apk ./
   ```

   **Error Details:**
   ```
   Error: No such container:path: envoy_build_container:/root/repo/build/app/outputs/flutter-apk/app-release.apk
   ```

**Issues Encountered:**

1. **OpenSSL Build Failure:**
   The build process for OpenSSL failed with the following error:
   ```
   Error building OpenSSL:
   Command: cd "/root/repo/target/aarch64-linux-android/release/build/openssl-sys-9f47e4e5d09d2dda/out/openssl-build/build/src" && MAKEFLAGS="-j --jobserver-fds=6,7 --jobserver-auth=6,7" "make" "build_libs"
   Exit status: exit status: 2
   ```
   This indicates potential issues with missing tools or incorrect configuration for building OpenSSL.

2. **Flutter Dependency Conflict:**
   There is a version conflict with the `intl` package. The project specifies `intl ^0.18.0`, but the Flutter SDK requires `intl 0.19.0` due to dependencies like `flutter_localizations`. This conflict prevents the successful build of the APK. The specific error encountered was:
   ```
   Error resolving dependencies:
   Because envoy depends on flutter_localizations from sdk which depends on intl 0.19.0, intl 0.19.0 is required.
   So, because envoy depends on intl ^0.18.0, version solving failed.
   ```

   Attempts to resolve this by updating the `intl` version in the `pubspec.yaml` file led to further issues:
   ```
   Error: Version solving failed because every version of webfeed from git depends on intl ^0.18.0 and envoy depends on intl ^0.19.0.
   ```
**Conclusion:** Although the Docker image for the Envoy Wallet built successfully, significant issues with OpenSSL and Flutter dependencies prevented the APK from being generated correctly. As a result, the APK is not verifiable at this time.


## App Description from Google Play

> Envoy is a simple Bitcoin wallet with powerful account management and privacy features.
>
> Use Envoy alongside your Passport hardware wallet for setup, firmware updates, and more.
>
> Envoy offers the following features:
>
> 1. Magic Backups. Get up and running with self-custody in only 60 seconds with automatic encrypted backups. Seed words optional.
>
> 2. Manage your mobile wallet and Passport hardware wallet accounts in the same app.
>
> 3. Send and receive Bitcoin in a zen-like interface.
>
> 4. Connect your Passport hardware wallet for setup, firmware updates, and support videos. Use Envoy as your software wallet connected to your Passport.
>
> 5. Fully open source and privacy preserving. Envoy optionally connects to the Internet with Tor for maximum privacy.
>
> 6. Optionally connect your own Bitcoin node.

A blog post states that this is not an ordinary "companion app", it is a fully-capable standalone self-custodial bitcoin wallet.  

## Analysis 

This app is **for verification**.