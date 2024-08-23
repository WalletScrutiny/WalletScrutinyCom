---
wsId: 
title: '10101'
altTitle: 
authors:
- danny
- kealiss
users: 500
appId: finance.get10101.app
appCountry: 
released: 
updated: 2024-08-10
version: VARY
stars: 
ratings: 
reviews: 
size: 
website: https://10101.finance
repository: https://github.com/get10101/10101/
issue: 
icon: finance.get10101.app.png
bugbounty: 
meta: ok
verdict: fewusers
date: 2024-08-07
signer: 
reviewArchive: 
twitter: get10101
social: 
redirect_from: 
developerName: '10101'
features: 

---

### Update 2024-08-01:

**Review: Build Issues with 10101 Wallet**

During the build process for the 10101 Wallet using the Dockerfile, we encountered significant issues with both build methods:

**Build Method 1: Gradle**

**Issue: Missing `gradlew` Script**

The Docker build fails with the following error:

```
chmod: cannot access 'gradlew': No such file or directory
The command '/bin/sh -c chmod +x ./mobile/android/gradlew' returned a non-zero code: 1
```

This error indicates that the `gradlew` script is missing from the `/app/mobile/android` directory. Without this script, Gradle commands cannot be executed, halting the build process.

**Issue: Unable to Run Gradle Commands**

Attempts to run Gradle commands also fail:

```
/bin/sh: 1: ./gradlew: not found
The command '/bin/sh -c ./gradlew clean assembleRelease' returned a non-zero code: 127
```

This confirms that the `gradlew` script is absent, which prevents any Gradle-based build actions. Since `gradlew` is used for version control, and it's missing, the correct approach is to use the exact Gradle version required by the project. However, Gradle version 7.1.2 is not available for download from official sources. Instead, Gradle 7.4 is used, which might lead to compatibility issues.

**Build Method 2: `flutter_rust_bridge_codegen`**

**Issue: Directory Not Found**

The `flutter_rust_bridge_codegen` command fails with:

```
Error: Fail to canonicalize path="/app/native/lib/bridge_generated/bridge_generated.dart"
Caused by:
    No such file or directory (os error 2)
The command '/bin/sh -c flutter_rust_bridge_codegen generate ...' returned a non-zero code: 1
```

**Attempts to Fix:**

1. **Directory Creation:**
   We created the necessary directories manually:
   ```
   RUN mkdir -p /app/native/src/bridge_generated
   RUN mkdir -p /app/native/lib/bridge_generated
   RUN mkdir -p /app/mobile/ios/Runner
   ```

2. **Ensured Dependencies:**
   We verified that `flutter_rust_bridge_codegen` was installed correctly using:
   ```
   RUN cargo install flutter_rust_bridge_codegen
   ```

3. **Verification:**
   We confirmed the presence of the `flutter_rust_bridge_codegen` executable using:
   ```
   RUN which flutter_rust_bridge_codegen
   ```

Despite these efforts, the command still failed, indicating possible misconfiguration or that required files were not correctly set up.

**Verdict:**

The build process for the 10101 Wallet is **not reproducible** using either method (Gradle or `flutter_rust_bridge_codegen`) due to the missing `gradlew` script and persistent errors with `flutter_rust_bridge_codegen`. Further investigation and fixes are necessary to ensure the reproducibility and successful build of the application.

*Note:* The iOS version is still on [TestFlight](https://testflight.apple.com/join/WhwnPUh8)

> 10101 is a self-custodial bitcoin wallet for your phone. Using DLCs (Discreet Log Contracts) we enable users to trade without counterparty risk and offer a synthetic stable coin.

10101 claims to be a self-custodial wallet that also utilizes Discreet Log Contracts for users looking to trade.

It has a repository and instructions for building. This app will be for **for verification** once it reaches 1000 downloads.
