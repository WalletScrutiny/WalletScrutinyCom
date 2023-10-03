---
title: Ledger Nano S Plus
appId: ledger.nano.splus
authors:
- danny
released: 2022-04-05
discontinued: 
updated: 
version: 
binaries: 
dimensions:
- 62
- 17
- 8.2
weight: 21
provider: 
providerWebsite: 
website: https://www.ledger.com/
shop: https://shop.ledger.com/products/ledger-nano-s-plus
country: FR
price: 79USD
repository: https://github.com/LedgerHQ/app-bitcoin
issue: 
icon: ledger.nano.splus.png
bugbounty: 
meta: ok
verdict: nosource
date: 2022-05-17
signer: 
reviewArchive: 
twitter: Ledger
social:
- https://www.linkedin.com/company/ledgerhq
- https://www.facebook.com/Ledger
- https://www.reddit.com/r/ledgerwallet
- https://www.instagram.com/ledger
- https://www.youtube.com/Ledger
- https://www.tiktok.com/@ledger
features: 

---

## Background 

The Ledger Nano S Plus is a new iteration of the {% include walletLink.html wallet='hardware/ledgerNanoS' verdict='true' %}

<blockquote class="twitter-tweet"><p lang="en" dir="ltr">P.S - All Nano apps that are already available on the Nano S and X will be made compatible with the Nano S Plus by <a href="https://twitter.com/hashtag/Ledger?src=hash&amp;ref_src=twsrc%5Etfw">#Ledger</a> and its partners.</p>&mdash; Ledger (@Ledger) <a href="https://twitter.com/Ledger/status/1506684714052161538?ref_src=twsrc%5Etfw">March 23, 2022</a></blockquote> <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script><br />

## Product Specifications

>- Connector: USB Type-C
- Certification level: CC EAL5+
- Chips: ST33K1M5
- Display: 128x64 OLED 
- 2 buttons
- Has no battery 
- No bluetooth
- USB C-Port
- Ledger Nano S Plus [User Manual](https://support.ledger.com/hc/en-us/articles/4457314683549-Ledger-Nano-S-Plus-User-manual-?docs=true)

**Can the private keys be created offline?**

Yes. This is described in the {{ page.title }} Getting Started [guide](https://support.ledger.com/hc/en-us/articles/4416927988625-Set-up-your-Ledger-Nano-S-Plus-?docs=true):

> - Set up your Nano S Plus as a new device: it will generate new private keys so you can manage your crypto assets. You will also write down a new 24-word recovery phrase, the only backup of your private keys.  
- Restore your device from a recovery phrase: it will recover the private keys linked to an existing recovery phrase.

**Are the private keys shared?** 

No. 

> Ledger uses a standard called BIP 39 for the generation and interpretation of the recovery phrase on all of our devices. 

However, since the {{ page.title }} does not have its own battery, it must connect to a computer or a mobile phone using the USB port. Ideally, the private keys should not be shared when the device is plugged. 

**Does the device display the receive address for confirmation?**

Yes. 

**Does the interface have a display screen and buttons which allows the user to confirm transaction details?**

Yes.

**Is it reproducible?**

No. Ledger combines a Secure Element chip with an Operating System called BOLOS. This hardware wallet does not have a monolithic design. Although BOLOS (Blockchain Open Ledger Operating System) is described as having an "Open Framework" and "Open Source friendly", it is not open source. We were able to find a [repository](https://github.com/LedgerHQ/ledger-dev-doc/blob/master/source/bolos/overview.rst#id3) but it is only for documentation purposes.  

> We developed a distinctive operating system (OS) called BOLOS, which we integrate either to a secure chip for the Ledger wallet line, or to a Hardware Security Module (HSM) for various enterprise solutions. 

**[BOLOS Introduction](https://developers.ledger.com/docs/nano-app/bolos-introduction/)**
>
BOLOS provides a lightweight, open-source framework for developers to build source code portable applications that run in a secure environment. BOLOS is a way of turning hardware wallets into fully-fledged personal security devices.
>
BOLOS allows users to review and install applications that let them do more with their cryptographic secrets, while protecting the device and other applications from malicious code. The key to BOLOS’s open-source friendliness and ability to limit the exposure of user’s cryptographic secrets to their apps is its application isolation technology. 

## Analysis 

The {{ page.title }} is very different from other hardware wallets because of BOLOS. Developers can make apps that run on BOLOS so users can make use of different blockchains along with their respective features. NFTs and Defi are among the touted applications that could use this framework. But ultimately, Ledger **does not provide the BOLOS source code publicly**. 