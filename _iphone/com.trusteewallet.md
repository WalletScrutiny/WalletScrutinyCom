---
wsId: Trustee
title: "Trustee Wallet bitcoin wallet"
altTitle: 
authors:
- leo
appId: com.trusteewallet
appCountry: 
idd: 1462924276
released: 2019-06-14
updated: 2022-02-11
version: "1.50.5"
stars: 3
reviews: 14
size: 73391104
website: https://trusteeglobal.com/
repository: 
issue: 
icon: com.trusteewallet.jpg
bugbounty: 
meta: ok
verdict: nonverifiable
date: 2021-07-30
signer: 
reviewArchive:
twitter: Trustee_Wallet
social:
- https://www.facebook.com/Trustee.Wallet
---

**Update 2021-02-07**: This wallet
[has its issues](https://github.com/bitcoin-dot-org/Bitcoin.org/pull/3514) you
might want to take into consideration, too.

On the App Store the provider claims:

> NON-CUSTODIAL<br>
  Trustee doesn’t authorize third parties to store private keys and details of
  your assets, so operations remain only yours!<br>
  Any time you buy or sell bitcoin we guarantee that no one else will save your
  transaction details. Everything is stored solely on your Trustee wallet and
  you are the only owner of your private keys and the seed phrase.

This is weirdly worded but the final sentence is very clear about who owns the
private keys: You alone on your phone.

On public source their website claims:


> **Our benefits**<br>
  Trustee Wallet is an open-source mobile multi-currency crypto wallet, this is
  the ideal solution for the safe storage and operational management of your
  crypto assets

and we found [their GitHub](https://github.com/trustee-wallet/trusteeWallet).

There they comment in length on the issue of reproducibility for their Android app
{% include walletLink.html wallet='android/com.trusteewallet' %} but make no such claims for
their iPhone product which leads us to the verdict: **not verifiable**.
