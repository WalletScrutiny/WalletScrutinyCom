---
wsId: krakenSuperWallet
title: 'Kraken Wallet: Crypto & NFT'
altTitle: 
authors:
- danny
- keraliss
users: 100000
appId: com.kraken.superwallet
appCountry: 
released: 2024-04-11
updated: 2025-02-14
version: 1.17.1 (1)
stars: 4.6
ratings: 
reviews: 57
website: https://kraken.com/wallet
repository: https://github.com/krakenfx/wallet
issue: 
icon: com.kraken.superwallet.png
bugbounty: 
meta: ok
verdict: nonverifiable
appHashes: 
date: 2025-03-29
signer: 
reviewArchive: 
twitter: krakenfx
social:
- https://www.linkedin.com/company/krakenfx
- https://www.facebook.com/KrakenFX
- https://www.reddit.com/r/Kraken
redirect_from: 
developerName: Payward, Inc.
features: 

---

**Update: 2025-03-29**

**Review: Kraken Wallet Build**

## Build Process

We created a Dockerfile based on the provided build instructions for Kraken Wallet. The Dockerfile sets up an environment with all necessary dependencies to build the Android APK:

- Ubuntu 22.04 as the base image
- Node.js 18.x
- OpenJDK 17
- Android SDK with build tools 33.0.0
- Yarn 3.6.4

The build was successful with the command:

```bash
docker build -t kraken-wallet-builder .
```

We then extracted the APK from the build:

```bash
docker create --name kraken-temp kraken-wallet-builder
docker cp kraken-temp:/app/android/app/build/outputs/apk/release/app-release.apk ./app-release.apk
docker rm kraken-temp
```

## Verification Process

We obtained the official APK (v1.17.1) from the GitHub release of version 1.17.0 and compared it with our built APK. Both APKs were unzipped and compared:

```bash
mkdir -p fromOfficial fromBuild
unzip -qqd fromOfficial "Kraken Wallet.apk"
unzip -qqd fromBuild app-release.apk
diff -r fromOfficial fromBuild
```

This is the diff output:   

```
Binary files fromOfficial/assets/dexopt/baseline.prof and fromBuild/assets/dexopt/baseline.prof differ
Binary files fromOfficial/assets/index.android.bundle and fromBuild/assets/index.android.bundle differ
Binary files fromOfficial/classes2.dex and fromBuild/classes2.dex differ
Binary files fromOfficial/classes.dex and fromBuild/classes.dex differ
Only in fromBuild: lib
Only in fromOfficial/res: anim
Only in fromOfficial/res: animator
Only in fromOfficial/res: animator-v21
Only in fromOfficial/res: anim-v21
Only in fromOfficial/res: anim-v33
Only in fromOfficial/res: drawable
Only in fromOfficial/res: drawable-anydpi-v23
Only in fromOfficial/res: drawable-hdpi-v4
Only in fromOfficial/res: drawable-mdpi-v4
Only in fromOfficial/res: drawable-v21
Only in fromOfficial/res: drawable-v23
Only in fromOfficial/res: drawable-v29
Only in fromOfficial/res: drawable-watch-v20
Only in fromOfficial/res: drawable-xxhdpi-v4
Only in fromOfficial/res: interpolator
Only in fromOfficial/res: interpolator-v21
Only in fromOfficial/res: layout
Only in fromOfficial/res: layout-land
Only in fromOfficial/res: layout-ldrtl-v17
Only in fromOfficial/res: layout-sw600dp-v13
Only in fromOfficial/res: layout-v14
Only in fromOfficial/res: layout-v19
Only in fromOfficial/res: layout-v21
Only in fromOfficial/res: layout-v26
Only in fromOfficial/res: layout-watch-v20
Only in fromOfficial/res: mipmap-anydpi-v26
Only in fromOfficial/res: mipmap-hdpi-v4
Only in fromOfficial/res: mipmap-mdpi-v4
Only in fromOfficial/res: mipmap-xhdpi-v4
Only in fromOfficial/res: mipmap-xxhdpi-v4
Only in fromOfficial/res: mipmap-xxxhdpi-v4
Only in fromOfficial/res: raw
Only in fromOfficial/res: xml
Binary files fromOfficial/resources.arsc and fromBuild/resources.arsc differ
Only in fromOfficial: stamp-cert-sha256
```


## Results

Significant differences were found between the APKs, including:

1. **Version difference**: App config showed v1.17.1 in official APK vs v1.17.0 in our build, but the github release the version is listed as 1.17.0 and the apk is 1.17.1, so we are assuming there is some version number misshap and both refers to the same built apk. 
2. **Resource organization**: Different directory structures and file naming
3. **Binary files**: Differences in AndroidManifest.xml, DEX files, and resources.arsc
4. **Missing/different files**: Many files present in one build but not the other

## Analysis

The GitHub release is labeled as version 1.17.0, but the APK file is named v1.17.1 and reports the same version internally. This suggests they should be identical builds despite the version label discrepancy. However, substantial differences in file structure, resources, and binary files indicate that the source code in the repository does not produce an identical build to the official release.

## Conclusion

Based on our findings, the Kraken Wallet is **non-verifiable**. The differences cannot be explained solely by the version numbering convention and suggest either:

1. The public repository does not contain all code used in the official build
2. The build process includes non-deterministic elements

We wanted to open an issue regarding the versioning discrepancy and the diffs, but the repository does not have a public issue tracker.

---

Kraken Superwallet is a self-custodial cryptocurrency wallet designed for securely managing digital assets, NFTs, and decentralized finance (DeFi) holdings. It supports multiple blockchain networks, enabling users to store, send, and receive Bitcoin, Ethereum, Solana, Dogecoin, Polygon, and other cryptocurrencies.

### Key Features

- Multi-Asset Support – Allows users to manage various cryptocurrencies, NFT collections, and DeFi assets within a single interface.
- Seed Phrase Management – Supports multiple wallets under a single seed phrase, providing a unified recovery mechanism.
- Privacy Measures – Implements minimal data collection policies and shields IP addresses to enhance user privacy.
- Security Model – The wallet’s security architecture follows Kraken’s established security practices, including open-source code audits.
- Dapp Integration – Features a built-in browser for interacting with decentralized applications (dapps) and monitoring DeFi positions.

The wallet is source-available, with security audits ensuring code integrity and trustworthiness. It serves as a gateway to decentralized finance while maintaining strong security and privacy principles.

## Analysis

This app is **for verification**