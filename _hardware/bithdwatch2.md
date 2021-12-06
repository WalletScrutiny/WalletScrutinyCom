---
title: "BITHD Watch 2"
appId: bithdwatch2
authors:
- kiwilamb
- danny
released: 2019-01-01
discontinued: # date
updated:
version:
dimensions: [42, 36, 12]
weight: 
website: https://bithd.com/BITHD-watch-2.html
shop: https://bithd.com/BITHD-watch-2.html
company: BitHD
companywebsite: https://bithd.com
country: CH
price: 
repository: https://github.com/bithd
issue:
icon: bithdwatch2.png
bugbounty:
verdict: wip
date: 2021-12-04
signer:
reviewArchive:


providerTwitter: 
providerLinkedIn: 
providerFacebook: 
providerReddit: 
---


The BitHD Watch 2 is described as a wearable and open source cold wallet. It can be paired with the {% include walletLink.html wallet='android/com.bitpie' verdict='true' %} wallet via Bluetooth.

## 📄 Link to [Official Documentation](https://docs.bithd.com/en/latest/)

## Private keys can be created offline - ✔️

Prior to creating a wallet and thus generating the seed, the [device must first be paired with the bitpie app](https://docs.bithd.com/en/latest/bithd/initialize.html#id3). 

After creating a BitHD account, the wallet can then be created.

## Private keys are not shared - ✔️

- Unauthorized physical access to wallet protected by PIN
- Password account – (protect private key leak)
- No private keys leak risk in case of theft

## Device displays receive address for confirmation - ✔️

The device display is [big enough to show the address](https://twitter.com/BitcoinWalletz/status/1464200501650542594) prior to transaction confirmation.

## Interface - ✔️

The watch has a [0.96 inch display](https://bitcointalk.org/index.php?topic=5104019.0)

## Reproducibility - ✔️

BitHD has a page called related reports that links to a Medium blog post entitled "[How to Verify BitHD Wallet Firmware Source Code?](https://medium.com/bitpie/how-to-verify-bithd-wallet-firmware-source-code-b9128dc30e64)"

Upon checking the [GitHub page of BitHD](https://github.com/bithd?tab=repositories), we find that it has several elements that have been forked from Trezor. 

This is for verification.
