---
title: Ginger Wallet
appId: gingerwallet
authors:
- danny
released: 2024-06-06
discontinued: 
updated: 2026-02-10
version: 2.0.24
binaries: https://github.com/GingerPrivacy/GingerWallet/releases
provider: GingerPrivacy
providerWebsite: https://gingerwallet.io
website: https://gingerwallet.io
repository: https://github.com/GingerPrivacy/GingerWallet
issue: 
icon: gingerwallet.jpg
bugbounty: 
meta: ok
verdict: sourceavailable
date: 2025-09-17
twitter: 
social:
- https://t.me/gingerwallet
- https://njump.me/npub1rqw94s9dt8lf0lernt72w29ctkr0skc5mjpy6e92ppktnvms0kwq540l8l
builds:
- arch: x86_64-linux
  types:
    standalone:
    - "Ginger-*-linux-x64.zip"
- arch: x86_64-windows
  types:
    standalone:
    - "Ginger-*.msi"
features:
- camera
- TOR
- bip158spv
- buyWithCC
- hd
- mix
- segwit

---
{% include featureEvidence.html feature="camera" source="[Website](https://gingerwallet.io)" quote="Enjoy advanced features like CoinJoin with the default coordinator, 2FA with wallet encryption, multilingual support, block filters, Tor integration, and QR code functionality." %}

## App Description

Ginger wallet is a fork of {% include walletLink.html wallet='desktop/wasabi' verdict='true' %}. It features a self-custodial BTC wallet that is source-available. It has features that allow for coinjoin, two-factor authentication, bitcoin knots integration and TOR. 

This app should be **for verification.**

{% include featureEvidence.html feature="segwit" quote="Discover the ultimate open-source, non-custodial Bitcoin wallet for desktop! Enjoy advanced features like CoinJoin with the default coordinator, 2FA with wallet encryption, multilingual support, block filters, Tor integration, and QR code functionality." source="Website" comment="Ginger is a fork of Wasabi Wallet which is SegWit-native; block filters and address reuse discouragement imply SegWit support, but the source does not explicitly mention SegWit or bech32 addresses." %}

{% include featureEvidence.html feature="mix" quote="Ginger Wallet was created to help Bitcoin retain its cypherpunk principles on its journey to becoming a global reserve currency and to address the inherent privacy issues of its public ledger. This is why Ginger Wallet is an open-source, non-custodial, privacy-focused Bitcoin wallet for desktop that implements trustless coinjoin technology." source="Website" %}

{% include featureEvidence.html feature="TOR" quote="All Ginger network traffic goes via Tor by default -there's no need to set up Tor by yourself. If you do already have Tor, and it is running, then Ginger will try to use that first." source="Website" %}

{% include featureEvidence.html feature="bip158spv" quote="The software is engineered to ensure that neither the public nor the developers can compromise your privacy. This is achieved through coinjoins , client-side block filtering , and communication via the Tor anonymity network." source="Website" %}

{% include featureEvidence.html feature="hd" quote="The password you set is used as a 13th seed word (as described in BIP 39 ) and to encrypt the private key of the extended private key (as described in BIP 38 ) to get an encrypted secret which is stored on the computer." source="Website" %}

{% include featureEvidence.html feature="buyWithCC" quote="Buying and selling Bitcoin has never been easier with Ginger Wallet. Simply choose your amount, select your payment method, and complete your transaction in just a few steps. Whether you're buying to invest or selling to cash out, Ginger Wallet ensures a secure and seamless experience." source="Website" %}