---
wsId: gemWallet
title: Gem Wallet - Crypto Bitcoin
altTitle: 
authors:
- danny
users: 50000
appId: com.gemwallet.android
appCountry: ae
released: 2023-06-26
updated: 2025-02-28
version: 1.2.329
stars: 5
ratings: 
reviews: 4
website: https://gemwallet.com
repository: https://github.com/gemwalletcom/gem-android
issue: 
icon: com.gemwallet.android.png
bugbounty: 
meta: ok
verdict: wip
appHashes: []
date: 2024-08-05
signer: 
reviewArchive:
- date: 2024-08-05
  version: 1.2.144
  appHashes: []
  gitRevision: 4d35b58691a7b46c61502395f1864e0cc5f4c268
  verdict: nonverifiable
twitter: GemWalletApp
social:
- https://github.com/gemwalletcom
- https://www.reddit.com/r/GemWalletApp
- https://www.youtube.com/@gemwallet
- https://t.me/gemwallet
- https://discord.com/invite/4jpxtwT8r6
redirect_from: 
developerName: Gem Wallet LLC
features: 

---

## App Description from Google Play 

> Gem Wallet is a secure, self-custodial DeFi crypto wallet that prioritizes the utmost privacy of your sensitive information. With Gem Wallet, you retain full ownership of your cryptocurrencies and private keys. We deeply value your privacy, ensuring we don't track any personally identifiable information, wallet addresses, or asset balances.
>
> When you choose Gem Wallet, you gain access to a Bitcoin wallet, Ethereum wallet, toncoin wallet, USDT/USDC wallet, BNB wallet, solana wallet, litecoin wallet, injective wallet, celestia wallet, bonk wallet, SEI wallet, avax wallet, MATIC wallet, SUI wallet, PEPE wallet, Manta wallet, ATOM wallet, and more! Gem Wallet is your key to the Web3 world. A single solution for multiple challenges.
> 
> Gem Crypto Wallet Key Features:
- Open Source Wallet
- Supports ERC-20, BEP-20, and TRC-20
- Store, Track, Send, Receive Tokens, Stake and Swap Coins
- Stake your SUI, INJ, ATOM, TIA, SEI, SOL, TRX, OSMO and BNB
- Use Swap and DEXes like 1inch directly from wallet with best rates
- Protect your Crypto and Private Keys with Industry-leading security
- Completely Free to Use
- Buy crypto with credit card
- Access NFT features
- View Detailed History of Your Transactions
- Use built in WalletConnect to connect with DApps, earn, stake, swap, use nft marketplaces, play games, make loans, sky is the limit if there is a Dapp, you can connect Gem Wallet with it.


## Analysis

- We installed Gem Wallet app version 1.2.144 on our device. 
- Initialization began with wallet creation including the seed phrases.
- This app supports multiple coins including Bitcoin.
- There was an option to send and receive. The Bitcoin address was in the Bech32 format.
- As they claimed to be an Open Source project, we easily found their [repository](https://github.com/gemwalletcom/gem-android). 

## Build Dependencies Using Docker

-   Ubuntu 22.04
    -   curl
    -   unzip
    -   git
    -   make
    -   nano
    -   zip
    -   build-essential
    -   libssl-dev
    -   pkg-config
    -   OpenJDK 17
-   SDKMAN
    -   Android SDK
    -   platform-tools
    -   platforms;android-34
    -   build-tools;34.0.0
    -   ndk;26.1.10909125
-   Rust
-   typeshare-cli
-   Homebrew
-   python3
-   bundletool
-   Gradle

## Reproducibility Testing Attempt

We made a
[Dockerfile](https://gitlab.com/walletscrutiny/walletScrutinyCom/-/raw/d8e5f53c384b19035cb3447b34389d1fe59b7bfa/scripts/test/android/com.gemwallet.android.dockerfile)
and
[shell script](https://gitlab.com/walletscrutiny/walletScrutinyCom/-/raw/d8e5f53c384b19035cb3447b34389d1fe59b7bfa/scripts/test/android/com.gemwallet.android.sh)
that would build Gemwallet's Android App Bundle (.aab) within a custom image. 

The `bundletool` command would build an .apks archive from the .aab:

```
    RUN bundletool build-apks \
    --bundle=/home/gemwallet/gem-android/app/build/outputs/bundle/release/app-release.aab \
    --output=/home/gemwallet/gem-android/device-app-release.apks \
    --device-spec=/home/gemwallet/device-spec.json 
```


## Running the build with testAAB.sh script

For Gemwallet, we thought it was appropriate to create a new script *testAAB.sh* for the purpose of testing reproducibility with an android app bundle. 

"TestAAB.sh" is a script modified from our original <strong>test script <a href="/testScript">(?)</a></strong>. It can pass arguments such as a device's specifications listed in a json file to a bundletool command that can generate the appropriate apk files from a bundle.

`./testAAB.sh -d ~/work/apk/com.gemwallet.android/1.2.144/ -s ~/work/device-spec/a11/device-spec.json`

In this instance, we generated **unsigned** apks with specific device data which we would then compare to the official apk extracted from a Play Store installation. Both the built and official apk's contents were extracted into folders using `unzip -d qq`. Here is the diff resulting from this:

```
Binary files fromBuild_com.gemwallet.android_1.2.144/AndroidManifest.xml and fromPlay_com.gemwallet.android_1.2.144/AndroidManifest.xml differ
Binary files fromBuild_com.gemwallet.android_1.2.144/assets/dexopt/baseline.prof and fromPlay_com.gemwallet.android_1.2.144/assets/dexopt/baseline.prof differ
Binary files fromBuild_com.gemwallet.android_1.2.144/classes2.dex and fromPlay_com.gemwallet.android_1.2.144/classes2.dex differ
Binary files fromBuild_com.gemwallet.android_1.2.144/classes3.dex and fromPlay_com.gemwallet.android_1.2.144/classes3.dex differ
Binary files fromBuild_com.gemwallet.android_1.2.144/classes.dex and fromPlay_com.gemwallet.android_1.2.144/classes.dex differ
Only in fromPlay_com.gemwallet.android_1.2.144/META-INF: BNDLTOOL.RSA
Only in fromPlay_com.gemwallet.android_1.2.144/META-INF: BNDLTOOL.SF
Only in fromPlay_com.gemwallet.android_1.2.144/META-INF: MANIFEST.MF
Binary files fromBuild_com.gemwallet.android_1.2.144/res/xml/splits0.xml and fromPlay_com.gemwallet.android_1.2.144/res/xml/splits0.xml differ
Binary files fromBuild_com.gemwallet.android_1.2.144/resources.arsc and fromPlay_com.gemwallet.android_1.2.144/resources.arsc differ
Only in fromPlay_com.gemwallet.android_1.2.144/: stamp-cert-sha256
```
**AndroidManifest.xml diff:**

```
<         <meta-data android:name="com.android.stamp.source" android:value="https://play.google.com/store"/>
<         <meta-data android:name="com.android.stamp.type" android:value="STAMP_TYPE_DISTRIBUTION_APK"/>
121d118
<         <meta-data android:name="com.android.vending.derived.apk.id" android:value="4"/>
diff /tmp/fromPlay_com.gemwallet.android_1.2.144/apktool.yml /tmp/fromBuild_com.gemwallet.android_1.2.144/apktool.yml
2c2
< apkFileName: base.apk
---
> apkFileName: base-master.apk
```

Looking over the changes, [we noticed many of the differences pertain to read-and-write permissions, file permissions, and timestamps.](https://gitlab.com/walletscrutiny/walletScrutinyCom/-/merge_requests/708#note_2023566413)  Additionally, [in classes.dex](https://xrviv.github.io/walletScrutinyBuildCasts/www/diffoscope-results/android/com.gemwallet.android/1.2.144/diffoscope.classes.dex.html) as well as [classes2](https://xrviv.github.io/walletScrutinyBuildCasts/www/diffoscope-results/android/com.gemwallet.android/1.2.144/diffoscope.classes2.dex.html) and [classes3](https://xrviv.github.io/walletScrutinyBuildCasts/www/diffoscope-results/android/com.gemwallet.android/1.2.144/diffoscope.classes3.dex.html), many of the variables were changed or omitted with the reason for it being unexplained.

The huge diffoscope output for version 1.2.144 lead us to give a verdict of **nonverifiable**

### Thank you to Gem Wallet for their donation

* $500 on [2024-06-12](https://x.com/dannybuntu/status/1805418147580887150)

{% include asciicast %}