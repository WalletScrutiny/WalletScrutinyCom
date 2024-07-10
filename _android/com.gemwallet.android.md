---
wsId: gemWallet
title: Gem Wallet - Crypto Bitcoin
altTitle: 
authors:
- danny
users: 10000
appId: com.gemwallet.android
appCountry: ae
released: 2023-06-26
updated: 2024-06-14
version: 1.2.144
stars: 4.6
ratings: 
reviews: 40
size:
website: https://gemwallet.com
repository: https://github.com/gemwalletcom/gem-android
issue: 
icon: com.gemwallet.android.png
bugbounty: 
meta: ok
verdict: obfuscated
date: 2024-06-25
signer: 
reviewArchive: 
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
\- Open Source Wallet
\- Supports ERC-20, BEP-20, and TRC-20
\- Store, Track, Send, Receive Tokens, Stake and Swap Coins
\- Stake your SUI, INJ, ATOM, TIA, SEI, SOL, TRX, OSMO and BNB
\- Use Swap and DEXes like 1inch directly from wallet with best rates
\- Protect your Crypto and Private Keys with Industry-leading security
\- Completely Free to Use
\- Buy crypto with credit card
\- Access NFT features
\- View Detailed History of Your Transactions
\- Use built in WalletConnect to connect with DApps, earn, stake, swap, use nft marketplaces, play games, make loans, sky is the limit if there is a Dapp, you can connect Gem Wallet with it.

## Analysis

- We installed Gem Wallet app version 1.2.142 on our device. 
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
    --device-spec=/home/gemwallet/device-spec.json \
    --ks=$ANDROID_KEYSTORE_FILENAME \
    --ks-pass=pass:$ANDROID_KEYSTORE_PASSWORD \
    --ks-key-alias=$ANDROID_KEYSTORE_ALIAS \
    --key-pass=pass:$ANDROID_KEYSTORE_PASSWORD
```

Specifying "--device-spec" would allow bundletool to generate apk files from the aab that were specifically tailored for a mobile device. Alternatively, you could use "--mode:universal" which would generate a singular "universal" apk.

"--ks" and "--key-pass" allows developers to set a specific keystore to sign the apks. It is possible to leave them out, however an unsigned apk cannot be installed on your device.

In this instance, we generated **unsigned** apks with **specificed device data** which we would then compare to official apks:

```
$ apktool d device-specific-unsigned.apks -o device-specific-unsigned/`
$ cd device-specific-unsigned/unknown/splits/
$ sha256sum base-master.apk 
8c5a4e056ab4c0ed80edf419b1346101fffa4da7db0f433fe04ecf6f44951439  base-master.apk
```

In comparison to the apk file extracted from the device and downloaded from Google Play:

```
$ sha256sum base.apk 
d416a9f8206e27127d0056cab197a7766a32c9695babed3098da3b08a06d000c  base.apk
```

In our second attempt, ApkSigCopier transferred the signatures *from* the official apks *to* the unsigned apks.:

```
$ ls
out.apk  signed.apk  unsigned.apk
$ apksigcopier copy signed.apk unsigned.apk out.apk
$ sha256sum out.apk
0e121e54b405f1bee8549b1160bdbe8de816fc6bb43056feb487405b77a9815e  out.apk
$ sha256sum signed.apk 
d416a9f8206e27127d0056cab197a7766a32c9695babed3098da3b08a06d000c  signed.apk

```

Once again, it resulted in differing checksums.


Diff between extracted apk directories:

```
$ diff fromBuildPatched/ fromPlay/
diff fromBuildPatched/AndroidManifest.xml fromPlay/AndroidManifest.xml
117a118,119
>         <meta-data android:name="com.android.stamp.source" android:value="https://play.google.com/store"/>
>         <meta-data android:name="com.android.stamp.type" android:value="STAMP_TYPE_DISTRIBUTION_APK"/>
118a121
>         <meta-data android:name="com.android.vending.derived.apk.id" android:value="4"/>
diff fromBuildPatched/apktool.yml fromPlay/apktool.yml
2c2
< apkFileName: out.apk
---
> apkFileName: signed.apk
143a144
>   stamp-cert-sha256: '8'
171,172c172,173
<   versionCode: '1'
<   versionName: '1.0'
---
>   versionCode: '385'
>   versionName: 1.2.144
Common subdirectories: fromBuildPatched/assets and fromPlay/assets
Common subdirectories: fromBuildPatched/kotlin and fromPlay/kotlin
Common subdirectories: fromBuildPatched/META-INF and fromPlay/META-INF
Common subdirectories: fromBuildPatched/original and fromPlay/original
Common subdirectories: fromBuildPatched/res and fromPlay/res
Common subdirectories: fromBuildPatched/smali and fromPlay/smali
Common subdirectories: fromBuildPatched/smali_classes2 and fromPlay/smali_classes2
Common subdirectories: fromBuildPatched/smali_classes3 and fromPlay/smali_classes3
Common subdirectories: fromBuildPatched/unknown and fromPlay/unknown
```

We tried again with a universal, unsigned build - and came up with similar results.

## Running the build with testAAB.sh script

Finally, we ran testAAB.sh with device-spec.json, the gemwallet script plus dockerfile that we prepared, and these were the results:

```
========================================
APK Summary
========================================
- Official APKs:
   1. base.apk - d416a9f8206e27127d0056cab197a7766a32c9695babed3098da3b08a06d000c
   2. split_config.armeabi_v7a.apk - 41ea2df5f2c97ab47cfe56d0346811197d1170b04266e91c37f8838e52eb3ff7
   3. split_config.en.apk - 582409b2cf48736c79957ede2d64a881fdc89bca99cd7fdff6839ebad8a3e074
   4. split_config.xhdpi.apk - a446ca6f339deb489fd34e5661bebf6658971546002ea4e47c8bd531c03c40bb
- Built APKs:
   1. base-xxhdpi.apk - 35822b7cae800b77c0575553c419944d3314f9b6403c90c33256ecf1d4461ec3
   2. base-x86_64.apk - 81eb5921a2f301afc102878177d5f83154df4ad6a110005d403c54d4feb87a4b
   3. base-en.apk - c4624a13f25f9f6274b4e69520bb36a8e10389574edac57fdd455b7b06fcc7e9
   4. base-master.apk - ccd93eacf9c7c92841b4b2afaa2e250807111a4d6a37b4476f70fb2f9b5f5c63
========================================
```

With none of the sha256sums matching in any of the tests we performed above, numerous diffs in many tests, and with knowledge that the project uses ProGuard to obfuscate its source code, we can only give the verdict of **obfuscated**. 

{% include asciicast %}


### Thank you to Gem Wallet for their donation

* $500 on [2024-06-12](https://x.com/dannybuntu/status/1805418147580887150)
