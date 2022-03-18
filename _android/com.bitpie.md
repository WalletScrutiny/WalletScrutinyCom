---
wsId: bitpie
title: Bitpie Wallet - Bitcoin USDT ETH EOS BCH TRON LTC
altTitle: 
authors:
- leo
users: 100000
appId: com.bitpie
appCountry: 
released: 2016-10-23
updated: 2021-12-27
version: 5.0.056
stars: 3.9038463
ratings: 847
reviews: 112
size: 57M
website: http://bitpie.com
repository: 
issue: 
icon: com.bitpie.png
bugbounty: 
meta: ok
verdict: nosource
date: 2021-12-11
signer: 
reviewArchive: 
twitter: BitpieWallet
social:
- https://www.facebook.com/BitpieOfficial
- https://www.reddit.com/r/BitpieWallet
redirect_from:
- /com.bitpie/
- /posts/com.bitpie/

---

**Update 2021-12-11**: This app recently got very bad reviews, with people who
lost funds. On the other hand we did review their hardware wallets, that might
be out of stock but had recent firmware updates and are indeed reproducible.

## Old Analysis

This app has bold claims:

> Bitpie Wallet is the world's leading multi-chain wallet

Many apps we review, claim to have a unique position somehow. For now we just
assume it claims to be a wallet.

> Access to BitHD Cold wallet;

What exactly does that mean? **access** to **cold wallet** sounds like an
oxymoron assuming a cold wallet is
defined as one that is offline. (**Update**: As we later found out, they also
provide hardware wallets:

* {% include walletLink.html wallet='hardware/bithdrazor' verdict='true' %}
* {% include walletLink.html wallet='hardware/bithdwatch2' verdict='true' %}
* {% include walletLink.html wallet='hardware/bithdwatch1' verdict='true' %}

In how far a bluetooth connected hardware wallet can
be considered a "cold" wallet is debatable though, too. But they share that
hardware wallet's [source code](https://github.com/bithd), too.)

Here there are the key words we want to read:

> As a true decentralized wallet, your private key will never leave the device.

It is non-custodial. At least so they claim. Let's see if it is reproducible ...

In the description we find no link to their source code. On the website ...

(The provider might want to change those download links "Google down" could be
mistaken as the link being "down" as in "unavailable".)

Unfortunately we cannot find any code for the Android wallet and thus have to
give the verdict: **not verifiable**.
