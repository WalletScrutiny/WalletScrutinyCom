---
wsId: aquaWallet
title: AQUA Wallet
date: 2024-01-05
authors:
- danny
- keraliss
website: https://aquawallet.io
twitter: AquaBitcoin
social:
- https://www.instagram.com/aquabitcoin
- https://www.facebook.com/profile.php?id=100095180887605
- https://www.linkedin.com/products/jan3-aqua
features:
- buyWithCC
- liquid
- ln
- segwit
- tradeAlts
redirect_from:
- /android/io.aquawallet.android/
- /iphone/io.aquawallet.ios/
android:
  appId: io.aquawallet.android
  users: 50000
  appCountry: us
  released: 2024-01-02
  updated: 2026-07-04
  version: 0.5.1
  reviews: 21
  icon: io.aquawallet.android.png
  meta: ok
  verdict: nosource
  developerName: JAN3
  repository: https://github.com/AquaWallet/aqua-wallet
iphone:
  appId: io.aquawallet.ios
  idd: '6468594241'
  appCountry: us
  released: 2024-01-03
  updated: 2026-07-07
  version: 0.5.1
  reviews: 75
  icon: io.aquawallet.ios.jpg
  meta: ok
  verdict: wip
  developerName: Jan3 LLC
  repository: https://github.com/AquaWallet/aqua-wallet

---

## Android

## Update 2025-07-11

After thorough investigation, we have changed the verdict for Aqua Wallet to **not source available**. Our reproducibility testing revealed that the public repository is incomplete and contains partially closed source components. The build fails specifically because it's missing several proprietary components that are included in the official APK but not in the public repository.

According to the developer's response on Twitter: 

> *"Yes, we're still focused on reproducible builds, but only for the non-custodial core of the wallet without the Marketplace integrations. Right now the build is failing because it is dependent on closed-source code for Marketplace features like the Dolphin Card and Buy Bitcoin."* 

> [Tweet](https://x.com/AquaBitcoin/status/1943219237100884182)

Given these findings, we must change the verdict to as the complete source code that produces the published APK is not publicly available.

**Update 2024-09-06:**

**Review: AquaWallet APK Build**

We followed the AquaWallet build instructions outlined in the repository, using Docker to create the build environment. Despite attempting various fixes, we encountered a critical issue preventing the successful build of the APK.

**Steps Taken:**
1. **Created Dockerfile:** Drafted a Dockerfile based on the repository's build instructions to set up the required environment.
2. **Ran Docker Build Command:**
   ```bash
   docker build -t aqua -f aqua.dockerfile .
   ```
3. **Encountered Error:**
   During the build process, the following error was encountered:
   ```
   aqua.dockerfile:17
   --------------------
     15 |     
     16 |     # Run 'make setup' to pull all dependencies and pre-built binaries for GDK and boltz-rust
     17 | >>> RUN nix develop --experimental-features 'nix-command flakes' --command /bin/bash -c "make setup"
     18 |     
     19 |     # Build the APK
   --------------------
   ERROR: failed to solve: process "/bin/sh -c nix develop --experimental-features 'nix-command flakes' --command /bin/bash -c \"make setup\"" did not complete successfully: exit code: 127
   ```
   This error indicates that the command failed to execute due to missing dependencies or an issue with Nix's experimental features. The `make setup` command, essential for pulling all necessary dependencies and binaries, could not be completed.

4. **Troubleshooting Steps:**
   - **Verified Bash Installation:** Confirmed that `/bin/bash` was properly installed in the Docker environment to ensure compatibility with the `make` command.
   - **Rechecked Nix Configurations:** Made sure the `nix develop` command used the correct syntax and experimental features (`nix-command` and `flakes`).
   - **Reviewed Dockerfile:** Examined the Dockerfile for any missing dependencies or misconfigurations that might be causing the build to fail.
   - **Tested Environment with Additional Tools:** Attempted installing necessary Nix packages directly but encountered further issues with missing binaries and dependencies for `flutter`, `gdk`, and `boltz-rust`.

**Conclusion:**

Despite several adjustments and thorough troubleshooting, the build process for AquaWallet's APK failed due to issues in the Nix development environment and missing dependencies during the `make setup` stage. We have reported this issue to the development team for further guidance. As of now, the APK remains **not verifiable** until these build issues are resolved.


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

{% include featureEvidence.html feature="buyWithCC" quote="buy Bitcoin" source="Website" comment="FAQ confirms: 'Bitcoin purchases are handled by third-party providers'" %}

{% include featureEvidence.html feature="tradeAlts" quote="AQUA enables support for Tether USDt native on Liquid and across the most popular USDt chains." source="Website" comment="FAQ confirms swaps via SideShift: 'USDt transfers via Tron or Ethereum, which depend on SideShift's liquidity'" %}

{% include featureEvidence.html feature="segwit" comment="(no justification provided by LLM)" %}

An issue has been opened at [https://github.com/AquaWallet/aqua-wallet/issues/9](https://github.com/AquaWallet/aqua-wallet/issues/9)

---

## iPhone

{% include copyFromAndroid.html %}
