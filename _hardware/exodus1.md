---
title: "HTC Exodus 1"
appId: exodus1
authors:
- kiwilamb
- leo
- danny
released: 2018-10-23
discontinued: # date
updated:
version:
dimensions: 
weight: 
website: https://www.htcexodus.com/us/cryptophone/exodus1/
shop: 
company: HTC
companywebsite: https://www.htcexodus.com
country: US
price: 
repository: https://github.com/htczion
issue:
icon: exodus1.png
bugbounty: https://www.htcexodus.com/mea-en/bounty-program/
verdict: defunct
date: 2021-07-11
signer:
reviewArchive:


providerTwitter: htcexodus
providerLinkedIn: 
providerFacebook: htcexodus
providerReddit: HTCExodus
---


The HTC Exodus 1 Cryptophone is not comparable to other hardware wallets such as Trezor or Ledger Nano because it is in essence, still a smartphone.

[Here is a video review](https://www.youtube.com/watch?v=PR5PkTa1ags) of this product.

In 2019, security researchers [discovered and reported](https://donjon.ledger.com/Stealing-all-HTC-Exodus-users/) a security problem with this product. It has since been patched.

## Private keys can be created offline - ✔️

We found making a conclusion here rather confusing as there is seemingly contradicting evidence.

On ["What is the Exodus 1?"](https://www.htcexodus.com/eu/cryptophone/exodus1/):

> Most app-based wallets (where you automatically store your newly-purchased crypto) is always connected to the internet and therefore susceptible to hacking and stealing. With EXODUS 1, it is more than meets the eyes. Under the hood, we use the best hardware and software technologies to create Zion - the perfect wallet with an easy-to-use software integrated with on-board hardware security.

Exodus 1 [also claims it is](https://www.htcexodus.com/mea-en/support/exodus-one-s/category_howto/wi-fi.html) capable of connecting to a Wifi hotspot.

[This article](https://www.htcexodus.com/eu/support/exodus-one/category_howto/how-is-exodus-different-from-hardware-wallets.html) on the Help Center gives the impression that you will be able to connect to the internet.

> The hardware wallets available on the market are typically cold wallets. With Zion on HTC EXODUS 1‍, you'll be able to own your keys—stored securely on the phone hardware—while still enjoying all the convenience of a high-end mobile device. No complicated log-in process or PC is required to access the blockchain world when you use HTC EXODUS 1‍.

This [article](https://www.htcexodus.com/sg/support/exodus-one/faq/is-exodus-a-cold-wallet.html) also implies that this is not an offline wallet:

> HTC EXODUS‍ is not a cold wallet. The term ​“‍cold wallet” refers to a wallet held offline and only connected to the Internet when needed.

We found information on this wallet's [Trusted Execution Environment.](https://www.htcexodus.com/eu/support/exodus-one/category_howto/what-is-the-secure-enclave.html)

> The term Trusted Execution Environment (TEE) describes a secure area inside the processor, which is isolated from the rest of the operating system. The TEE helps maintain the confidentiality and integrity of keys and is protected from unauthorized access.

We conclude that, while this hardware wallet is a smartphone, the keys are still stored offline with them being "[on a separate part of the phone's processor.](https://www.htcexodus.com/eu/support/exodus-one/category_howto/how-is-the-private-key-generated.html)"

## Private keys are not shared - ✔️

[Users are provided with a recovery phrase.](https://www.htcexodus.com/sg/support/exodus-one/faq/recovery-phrase.html#recovery-phrase)

> Zion Vault generates your 12-word recovery phrase when you create a new Vault. Your recovery phrase is unique to you, and is used to generate the public and private keys for all your crypto assets. 

Additionally, you are told to keep the phrase in a safe, offline place.

> It's important to write it down—by hand—and keep it in a safe, offline place so that it can't be easily hacked, stolen, or duplicated.

## Interface

It also claims to store the full bitcoin ledger (which is currently around the amount of 358GB) in a 400GB micro SD card.

## Reproducibility

{{ page.title }} does not have a link to any Github repository, although we found a possibly related Github account [here](https://github.com/htczion?tab=repositories). Unfortunately, the repositories do not appear to be directly related to the wallet. 

The app did not advertise itself as an open-source offering.

We cannot find any official shop on the HTC website for {{ page.title }}, with the social media account's last post dating back to December 2020. Even the GitHub account's repos has had no updates since 2019. Until further update, this app is classified as **defunct.**