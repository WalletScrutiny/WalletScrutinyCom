---
wsId: onekeySo.new
title: 'OneKey: Secure Crypto Wallet'
altTitle: 
authors:
- danny
appId: so.onekey.wallet
appCountry: us
idd: '1609559473'
released: 2022-04-27
updated: 2025-11-01
version: 5.16.0
reviews: 668
website: https://onekey.so?utm_source=app_store
repository: https://github.com/OneKeyHQ/app-monorepo
icon: so.onekey.wallet.jpg
bugbounty: 
meta: ok
verdict: sourceavailable
appHashes: 
date: 2025-07-21
signer: 
twitter: OneKeyHQ
social:
- https://discord.com/invite/nwUJaTzjzv#deadLink
features:
- airGapped
- batching
- buyWithCC
- camera
- companion
- customNode
- fingerprint
- secEl
- tradeAlts
developerName: ONEKEY LIMITED

---

## Update 2025-07-21

The Android App's verdict is now **source available** and is **for verification**. 

The iPhone app remains non-verifiable because all apps distributed through the Apple App Store are re-signed and encrypted by Apple before delivery to users. This process alters the original binary, making it impossible to directly compare the published app with a version built from source code. As a result, researchers and users cannot independently verify that the code released by developers matches the app actually installed on iOS devices.

{% include copyFromAndroid.html %}

{% include featureEvidence.html feature="fingerprint" quote="Multiple protection layers: App password, biometrics, and hardware wallet integration" source="Store" %}

{% include featureEvidence.html feature="secEl" quote="Our hardware wallets use EAL6+ secure elements, supporting offline signing, Bluetooth, or QR code communication for real air-gapping." source="Store" %}

{% include featureEvidence.html feature="tradeAlts" quote="OneKey Swap aggregates liquidity across multiple chains and DEXs to find the best rates and lowest slippage." source="Store" %}

{% include featureEvidence.html feature="buyWithCC" quote="The system automatically compares quotes from multiple trusted providers to get you the best price." source="Store" %}

{% include featureEvidence.html feature="airGapped" quote="Our hardware wallets use EAL6+ secure elements, supporting offline signing, Bluetooth, or QR code communication for real air-gapping." source="Store" %}

{% include featureEvidence.html feature="camera" quote="supporting offline signing, Bluetooth, or QR code communication for real air-gapping." source="Store" %}

{% include featureEvidence.html feature="customNode" quote="Custom RPC networks, batch address import, instant balance preview." source="Store" %}

{% include featureEvidence.html feature="companion" quote="qr-wallet-sdk/ # QR-code hardware wallet SDK" source="GitHub README" %}

{% include featureEvidence.html feature="batching" quote="batch address import, instant balance preview." source="Store" %}