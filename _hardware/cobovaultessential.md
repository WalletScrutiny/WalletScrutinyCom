---
title: "Keystone Essential"
appId: cobovaultessential
authors:
- kiwilamb
- danny
- leo
released: 2018-03-01
discontinued: # date
updated: 2021-11-11
version: B-2.5
dimensions: 
weight: 115 g
website: https://keyst.one/
shop: 
company: Keystone
companywebsite: https://shop.keyst.one/products/keystone-essential
country: CH
price: 119USD
repository: https://github.com/KeystoneHQ/Keystone-cold-app
issue: https://gitlab.com/walletscrutiny/walletScrutinyCom/-/issues/380
icon: cobovaultessential.png
bugbounty:
verdict: nosource
date: 2021-12-08
signer:
reviewArchive:


providerTwitter: KeystoneWallet
providerLinkedIn: 
providerFacebook: 
providerReddit: 
---

**Note:** Cobovault has been renamed to Keystone, previous products were known as Cobovault Essential, Cobovault Pro and Cobovault Ultimate.

This hardware wallet has a companion app: {% include walletLink.html wallet='android/com.keystone.mobile' verdict='true' %}

## Interface - ✔️

Keystone resembles a smartphone and has a 4" touchscreen.

## Private keys can be created offline - ✔️

[From Keystone's article on Medium:](https://blog.keyst.one/keystone-product-design-principles-cd833bc11125)

> Hardware wallets isolate your private keys from the internet because physical attacks cost significantly more than remote attacks. In terms of how air-gapped your hardware wallet is and how costly it is for a hacker to steal your assets, it’s crucial how the hardware wallet connects to a companion app. Using QR codes or microSD cards for data transmission has significant advantages for air-gapping your keys compared to USB and Bluetooth, which have larger attack surfaces because they are interactive connections.

([Guide to creating a wallet](https://support.keyst.one/getting-started/setting-up-keystone-in-5-steps#1.-create-wallet))

## Private keys are not shared - ✔️

Keystone claims to be "Verifiably Air-Gapped" on the frontpage.

Information on EAL 5+ Secure Element:

> A proprietary bank-grade Secure Element ensures your private keys never leave the Keystone. The Secure Element generates a true random number for your private keys and is vital to ensuring your crypto assets are stored in the safest way possible. Our BIP32, BIP39, and BIP44 compliant firmware is also [open source.](https://github.com/KeystoneHQ)

## Device displays receive address for confirmation - ✔️

We found [an article](https://btcguide.github.io/verify-receive-address/keystone) in the user guide that states Keystone will verify receive addresses.

[A video review](https://youtu.be/4KDQqj02KK0?t=1449) about this product confirms that the device displays receive addresses for confirmation. 

## Prior Audits

The provider had an audit done in June 2020. They
[published the full report](https://github.com/KeystoneHQ/Keystone-developer-hub/blob/main/audit-report/cobo_audit_report_2020_09_en_1_0.pdf).
In this report, several issues, including of critical and high severity were
revealed, all of which were fixed quickly after. While this audit was not
designed to reveal if the provider under duress could put the users funds at
risk, their conclusion reads very positive:

> In this audit, we thoroughly analyzed the Cobo Vault documentation and
  implementation. The audited system does involve various intricacies in both
  design and implementation. The current code base is well organized and those
  identified issues are promptly confirmed and fixed.<br>
  We emphasize that using a hardware wallet alone does not make you invincible
  against social engineering, physical threats or human errors. As always, users
  need to use common sense, and apply basic security principles to protect their
  valuable assets.

## Code and Reproducibility

Keystone claims to be open source, so we checked their GitHub for relevant
repositories. These look promising:

* [Keystone-cold-app](https://github.com/KeystoneHQ/Keystone-cold-app-btc) - The Keystone hardware wallet application for BTC
* [keystone-se-firmware](https://github.com/KeystoneHQ/keystone-se-firmware)

In the former we read:

> Keystone runs as a standalone application on customized hardware and Android
  8.1 Oreo (Go Edition)

which begs the question in how far the operating system can be trusted. Where is
the repository of the "Android 8.1" they used? Is this reproducible? Does the
hardware have any radio devices that could leak key material? It absolutely can
do harm by patching any binary brought onto the device prior to installation. As
essential component to the security of the device, we have to find out what was
used here. Above quote can also be read as the Android having been customized,
too.

Searching for answers we stumbled onto this paragraph from the
[Keystone-system repository](https://github.com/KeystoneHQ/Keystone-system):

> Due to copyright, some vendors’ code cannot be made public, and we have
  removed some of the code from the source code. Therefore this open source code
  cannot be compiled. However, we can share this part of code under an NDA if
  you want to fully verify the code and reproduce it.

This means their software stack cannot be independently verified without
signing an NDA. Signing an NDA means one may not disclose details found, which
makes the effort pointless for us.

For the time being we have to consider this product **not verifiable**.
