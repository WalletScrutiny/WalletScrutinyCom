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
date: 2024-08-16
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
**Update 2024-08-16**:

### Review: Build Issue with Envoy APK Generation

During the attempt to build an Android APK from the Envoy repository using Docker, the process encountered multiple issues.

#### Docker Build Process:
The Docker build process was initiated with the following command:
```bash
docker build -t envoy-image .
```
This command successfully compiled the Rust code and generated several `.a` and `.so` files.

#### Error Encountered:
The expected output was an Android APK, but the build process only resulted in a `release` folder containing static and shared libraries (`.a` and `.so` files). The APK was not found because the build script only compiled Rust code without integrating with the Android Gradle build system.

### Steps Taken:
1. **Initial Setup:** The Docker environment was correctly set up, and the Rust project was cloned and built.
2. **Compilation:** The Rust code compiled successfully, producing necessary libraries for Android.
3. **Output Verification:** The process attempted to find the APK, but none was generated.

**Conclusion:** Although the Docker image for the Envoy Wallet built successfully, the APK was not generated correctly. As a result, the APK is **not verifiable** at this time.

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