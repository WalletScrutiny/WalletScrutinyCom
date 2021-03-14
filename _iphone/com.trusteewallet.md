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
updated: 2021-03-09
version: "1.40.784"
score: 4.33333
reviews: 6
size: 63811584
developerWebsite: https://trustee.deals/
repository: 
issue: 
icon: com.trusteewallet.jpg
bugbounty: 
verdict: fewusers # wip fewusers nowallet nobtc obfuscated custodial nosource nonverifiable reproducible bounty defunct
date: 2020-12-21
reviewStale: true
signer: 
reviewArchive:


providerTwitter: Trustee_Wallet
providerLinkedIn: 
providerFacebook: Trustee.Wallet
providerReddit: 

redirect_from:

---

**Update:** This wallet
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

There they comment in length on the issue of reproducibility for
[their Android wallet](/android/com.trusteewallet) but make no such claims for
their iPhone product wich leads us to the verdict: **not verifiable**.
