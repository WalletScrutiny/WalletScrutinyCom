---
wsId: aquaWallet
title: AQUA Wallet
altTitle: 
authors:
- danny
- keraliss
users: 10000
appId: io.aquawallet.android
appCountry: 
released: 2024-01-02
updated: 2024-08-13
version: 0.2.1
stars: 4.4
ratings: 
reviews: 10
size: 
website: https://aquawallet.io
repository: https://github.com/AquaWallet/aqua-wallet
issue: https://github.com/AquaWallet/aqua-wallet/issues/9
icon: io.aquawallet.android.png
bugbounty: 
meta: ok
verdict: ftbfs
date: 2024-08-28
signer: 
reviewArchive: 
twitter: AquaBitcoin
social:
- https://www.instagram.com/aquabitcoin
- https://www.facebook.com/profile.php?id=100095180887605
- https://www.linkedin.com/products/jan3-aqua
redirect_from: 
developerName: JAN3
features:
- ln
- liquid

---

**Update 2024-08-28:**

**Review: AquaWallet APK Build**

We followed the AquaWallet build instructions provided in the repository, including setting up a Dockerfile and executing the build process. Despite closely following the instructions and attempting various fixes, we encountered a critical issue preventing the build from succeeding.

**Steps Taken:**
1. **Created Dockerfile:** Implemented a Dockerfile as per the repository instructions to create the build environment.
2. **Ran Docker Build Command:**
   ```
   docker build -t aqua-wallet-builder -f flutter.dockerfile .
   ```
3. **Encountered Error:**
   The build process failed with the following output:
   ```
   building '/nix/store/73kfppks4wn164qwrnm12avl36840acm-build-tools_r34-linux.zip.drv'...
   building '/nix/store/vcv7k6g78b54iqwppm2xkym42hqvg668-cmake-3.22.1-linux.zip.drv'...
   ...
   Submodule 'flutter' (https://github.com/flutter/flutter) registered for path 'flutter'
   Cloning into '/app/flutter'...
   Submodule path 'flutter': checked out 'f468f3366c26a5092eb964a230ce7892fda8f2f8'
   make: /bin/bash: No such file or directory
   make: *** [Makefile:6: install] Error 127
   flutter pub get
   The command '/bin/sh -c nix develop --experimental-features 'nix-command flakes' --command bash -c "make setup"' returned a non-zero code: 2
   ```
   The error indicates that the build process is failing due to the absence of `/bin/bash`, which is required to run the make command. This is causing the build process to stop, preventing the successful completion of the APK build.

4. **Troubleshooting Steps:**
   - **Checked Dockerfile for Bash Installation:** Verified that `/bin/bash` was specified in the Dockerfile but found it missing in the build environment.
   - **Updated Dockerfile:** Added explicit installation of Bash in the Dockerfile:
     ```
     RUN apk add --no-cache bash
     ```
   - **Consulted Documentation:** Rechecked the AquaWallet documentation and build instructions to ensure all prerequisites were met.
   - **Verified Nix Configuration:** Ensured that Nix configuration was correct and that all dependencies were properly declared and available.

**Conclusion:**

Despite extensive efforts to resolve the issue, including modifying the Dockerfile and verifying configurations, the AquaWallet APK build failed due to the missing Bash executable. We have reported the issue to the development team for further assistance. Until this issue is addressed, the APK remains **not verifiable**.



## App Description from Google Play

> ⚡️Native Bitcoin and Layer 2: Seamlessly transact in Bitcoin, Lightning, and Liquid assets including Tether USDt. AQUA is your passport to financial inclusion, designed for Latin America and embraced by Bitcoin Maximalists globally.
>
> 🔒 Non-Custodial Core: Own your keys and your assets. AQUA is built on the cornerstone principle of self-sovereignty, giving you control over your Bitcoin and your money as a whole.
>
> 🌊 Liquid Network Pioneer: AQUA was one of the first wallets to support Liquid sidechain functionality, enabling native support for Tether USDt and in the future, new assets like Bitcoin Bonds. 👀
>
> 💵 Tether USDt on Liquid: Seamlessly transact with USDt > - there is no second-best stablecoin. AQUA allows you to send and receive your USDt on Liquid as well as altcoin chains, all while storing your funds securely on the Liquid Network.
>
> 🤝 User-Friendly Interface: AQUA's intuitive design ensures a streamlined user experience, making it the ideal wallet for both beginners and Bitcoin enthusiasts. AQUA is the wallet you can orange pill your grandma with!
>
> 💧 Purified All-In-One: AQUA filters out the noise, holding only essential assets like Bitcoin and Tether, like an oasis of calm in the crypto jungle. Enjoy USDt without needing an altcoin for gas fees.

## Analysis 

The app provides a BTC address with seed phrases. It is now source-available,
and thus, now
**[for verification](https://github.com/AquaWallet/aqua-wallet/issues/9)**.
