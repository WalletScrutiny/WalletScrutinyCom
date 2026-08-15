---
title: ColdLar Ultra
appId: coldlar.ultra
authors:
- danny
released: 
discontinued: 
updated: 
version: 
binaries: 
dimensions:
- 140
- 71
- 8.6
weight: 160
provider: ColdLar Information Technology Co.
providerWebsite: https://www.coldlar.com/
website: 
shop: https://www.coldlar.com/en/product/10072
country: CN
price: 680USD
repository: 
icon: coldlar.ultra.png
bugbounty: 
meta: ok
verdict: nosource
date: 2024-12-16
signer: 
twitter: Coldlar
social: 
builds: 
features:
- airGapped
- camera
- fingerprint
- nfc
- secEl

---

## [Official User's Manual](https://www.coldlar.com/en/help/manual)

<iframe width="560" height="315" src="https://www.youtube.com/embed/PkA_J-uqkG8?si=9IfitBiGsLTeptIJ" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>

## Product Description 

- CC EAL6+ chip security standard
- Multi-chain support
- Supports NFT
- 5 inch touch screen
- Fingerprint recognition 

### Companion App

- The device requires a companion app. The Android app could be [downloaded](https://www.coldlar.com/en/download) from the website since it is not available on Google Play. We installed this app on an Android emulator, and it is named "Coinbag-1.2.0.apk"
- The iPhone companion app redirects to {% include walletLinkArchived.html wallet='mobile/com.coinlinksec' %}, which at the time of this review had a different name from ColdLar: like the Android app, it was named Coinbag. The App Store listing has since been renamed to Coldlar and our review of it is archived.
- We could not find a desktop app.

### This is a recording of the companion app running on an Android emulator.

<blockquote class="twitter-tweet" data-media-max-width="560"><p lang="en" dir="ltr">ColdLar Wallet&#39;s companion app is named CoinBagWallet. <a href="https://t.co/7Cb4FBoH8p">pic.twitter.com/7Cb4FBoH8p</a></p>&mdash; 🐧 dannybuntu (@dannybuntu) <a href="https://twitter.com/dannybuntu/status/1866769455193395279?ref_src=twsrc%5Etfw">December 11, 2024</a></blockquote> <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>

- The companion app does not have an officially designated Google Play application ID. From what we tested on the emulator, if the app is not connected via QR code or NFC, it will not work since these two options are needed to access some of the wallet functionalities.

## Private keys can be created offline - ✔️

The ColdLar Ultra uses a two-part system:
- Hardware cold wallet (cold end) - handles private key generation, transaction construction and digital signatures
- Coldlar App (hot end) - connects to blockchain network for balance queries and transaction broadcasting

**Note:** The Android app is not available on Google Play.

The device offers two methods for private key generation:
1. Random seed password + payment password combination
2. Standard mnemonic phrase generation

All key operations are performed offline, with cold-hot communication strictly via QR codes, ensuring private keys never touch the internet.

## Private keys are not shared - ✔️

According to the manual:

1. The seed password is not stored in plaintext but is encrypted using the payment password
2. ColdLar explicitly states they do not store user seed passwords or payment passwords
3. Users must have both seed password and payment password to control assets
4. If either password is lost, assets cannot be recovered
5. The company recommends:
   - Writing passwords on paper only
   - Never storing electronic versions
   - Never entering passwords on any webpage
   - Never saving on networked devices

The manual claims that: 

> The cold end manages the private keys, mainly responsible for generating private keys, constructing transactions and digital signatures; the hot end connects to the blockchain network, mainly responsible for querying balances, broadcasting transactions and monitoring asset dynamics. The cold and hot ends communicate via QR codes, ensuring that the private key never touches the internet, completely eliminating the risk of private key theft by online hackers

## Device displays receive address for confirmation - ✔️

Yes. 

<iframe width="560" height="315" src="https://www.youtube.com/embed/RSFemN3hjAE" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>

## Interface - ✔️

The touchscreen allows the user to confirm the address and the amount of the transaction prior to sending the transaction.

## Reproducibility - ❌

The ColdLar Ultra does **not** make claims regarding its source-availability. 

While it has a GitHub organization page, its only public repository is a fork of the bitcoincash.org website. 

This device is **not source-available**.

{% include featureEvidence.html feature="secEl" quote="CC EAL6+ chip security standard" source="Official User's Manual" %}

{% include featureEvidence.html feature="fingerprint" quote="Fingerprint recognition" source="Official User's Manual" %}

{% include featureEvidence.html feature="camera" quote="All key operations are performed offline, with cold-hot communication strictly via QR codes, ensuring private keys never touch the internet." source="Official User's Manual" %}


{% include featureEvidence.html feature="nfc" quote="if the app is not connected via QR code or NFC, it will not work since these two options are needed to access some of the wallet functionalities." source="Official User's Manual" %}

{% include featureEvidence.html feature="airGapped" quote="The cold and hot ends communicate via QR codes, ensuring that the private key never touches the internet, completely eliminating the risk of private key theft by online hackers" source="Official User's Manual" %}