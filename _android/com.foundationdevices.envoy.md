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
issue: https://github.com/Foundation-Devices/envoy/issues/1395
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

The build process for the Envoy Wallet was successfully initiated and completed using the provided Dockerfile. We created a script, {% include testScript.html %} , and got this output. 

   **APK Not Found Error:**
   ```   
   BUILD FAILED in 26m 49s
   Running Gradle task 'assembleRelease'...                         1609.5s
   Gradle task assembleRelease failed with exit code 1
   + '[' '!' -f /tmp/test_com.foundationdevices.envoy/build/app/outputs/flutter-apk/app-release.apk ']'
   + echo 'Error: APK file not found at /tmp/test_com.foundationdevices.envoy/build/app/outputs/flutter-apk/app-release.apk'
   Error: APK file not found at /tmp/test_com.foundationdevices.envoy/build/app/outputs/flutter-apk/app-release.apk
   ```

Despite the Docker image building and running successfully, the APK was not found, which suggests issues with the build output configuration or directory paths.

**Manual Build Attempt:**

After the initial build failed to produce a working APK, a manual Docker build was performed:

1. **Manual Docker Build and Run Commands:**
   ```
   docker build -t envoy_wallet -f envoy.dockerfile .
   ```

   the build was successful 

   ```
   Successfully built 67097ce5b7b9

   Successfully tagged envoy_wallet:latest
   ```
   Then we tried to run the container
   ```
   docker run -d --name envoy_build_container_new envoy_wallet
   ```
   And got this
   ```
   Error building OpenSSL:
      Command: cd "/root/repo/target/aarch64-linux-android/release/build/openssl-sys-9f47e4e5d09d2dda/out/openssl-build/build/src" && MAKEFLAGS="-j --jobserver-fds=6,7 --jobserver-auth=6,7" "make" "build_libs"
      Exit status: exit status: 2


      , /root/.cargo/registry/src/mirrors.tuna.tsinghua.edu.cn-df7c3c540f42cdbd/openssl-src-300.2.1+3.2.0/src/lib.rs:611:9
      note: run with `RUST_BACKTRACE=1` environment variable to display a backtrace
      Resolving dependencies... (23.0s)
      Note: intl is pinned to version 0.19.0 by flutter_localizations from the flutter SDK.
      See https://dart.dev/go/sdk-version-pinning for details.


      Because envoy depends on flutter_localizations from sdk which depends on intl 0.19.0, intl 0.19.0 is required.
      So, because envoy depends on intl ^0.18.0, version solving failed.
      Resolving dependencies... (4.8s)
      Note: intl is pinned to version 0.19.0 by flutter_localizations from the flutter SDK.
      See https://dart.dev/go/sdk-version-pinning for details.


      Because envoy depends on flutter_localizations from sdk which depends on intl 0.19.0, intl 0.19.0 is required.
      So, because envoy depends on intl ^0.18.0, version solving failed.
      Build process completed. Checking for APK...
      Versions of tools:
      cargo 1.69.0 (6e9a83356 2023-04-12)
      rustc 1.69.0 (84c898d65 2023-04-16)
      Flutter 3.24.0 • channel stable • https://github.com/flutter/flutter.git
      Framework • revision 80c2e84975 (8 days ago) • 2024-07-30 23:06:49 +0700
      Engine • revision b8800d88be
      Tools • Dart 3.5.0 • DevTools 2.37.2
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