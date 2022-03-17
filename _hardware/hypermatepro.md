---
title: "HyperMate Pro"
appId: hypermatepro
authors:
- kiwilamb
- danny
- leo
released: 2021-04-14
discontinued: 
updated: 2021-09-22
version: "4.1.7"
binaries: 
dimensions: [44, 70, 4.5]
weight: 
provider: "HyperPay"
providerWebsite: https://hyperpay.tech/
website: https://hyperpay.tech/hypermatepro/pro
shop: https://shop.hyperpay.tech/collections/hypermate-g/products/hypermate-pro
country: HK
price: 229USD
repository: https://github.com/hyperpayorg/hardwallet
issue: https://github.com/hyperpayorg/hardwallet/issues/4
icon: hypermatepro.png
bugbounty: 
meta: ok
verdict: nosource
date: 2021-12-12
signer: 
reviewArchive: 
twitter: HyperPay_tech
social: 
- https://www.facebook.com/hyperpayofficial
---

This hardware wallet is paired with {% include walletLink.html wallet='android/com.legendwd.hyperpayW' verdict='true' %}

There are at least 5 HyperMate Pro Review or Unboxing videos on [YouTube](https://www.youtube.com/results?search_query=hypermate+pro)

## Private keys can be created offline - ✔️

From [How to connect HyperMate Pro to HyperPay Mobile](https://hyperpayhelp.zendesk.com/hc/en-us/articles/4409734220815-CONNECT-HYPERMATE-PROTO-A-HYPERPAY-MOBILE):

> HyperMate Pro device will not activate Bluetooth or USB data connection (USB charging is available) before a wallet is created or restored.

## Private keys are not shared - ✔️

From [Is HyperPay Wallet safe?](https://hyperpayhelp.zendesk.com/hc/en-us/articles/360005546373-Is-HyperPay-Wallet-Safe-)

> Our on-chain wallet is protected by routine coding check and vetting. You control your own Mnemonic and private key. We provide you with the safest infrastructure, you shoulld  take care of your own Mnemonic and private key.

## Device displays receive address for confirmation - ✔️

Yes, this is [demonstrated](https://hyperpayhelp.zendesk.com/hc/article_attachments/4409868364559/mceclip8.jpg) on this tutorial: "[Multisig Transaction](https://hyperpayhelp.zendesk.com/hc/en-us/articles/4409861125263-MULTISIG-TRANSACTION)" 

## Interface - ✔️

It has a 1.3" Color Touchscreen

## Code and Reproducibility

On their website they link to a GitHub account that also features a repository
called [hardwallet](https://github.com/hyperpayorg/hardwallet) but it's not
clear what to make of this. There are no clear build instructions and neither
is there any version tagged. According to
[their official Twitter](https://twitter.com/Hyperpay_tech/status/1440563446681010180)
the latest version is `4.1.7` from 2021-09-22 but their repository has no such
tag. In fact it has
[no tags at all](https://github.com/hyperpayorg/hardwallet/tags).

[The commit history](https://github.com/hyperpayorg/hardwallet/commits/master)
is also rather curious. 14 commits with the last commit half a year before the
latest release `4.1.7`. That
[last commit](https://github.com/hyperpayorg/hardwallet/commit/1e9f498b69567102b2679386b7759c14be27c961#diff-30663e890bef06f6e1d74fa964e25d82781e8f95c62995ec3e3f3fd00bbf9f6a)
adds the folder `HardWalletSDK` to the project. GitHub describes the commit:

> 773 changed files with 116,778 additions and 0 deletions

The content of that folder is actually the "SDK" of
{% include walletLink.html wallet='hardware/jubiterblade' verdict='true' %}:
[JubiterWallet/JubiterSDK_C](https://github.com/JubiterWallet/JubiterSDK_C)

With the missing build instructions but above all missing commits leading up to
the latest release, we find this product to be **not verifiable**.
