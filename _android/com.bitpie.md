---
wsId: bitpie
title: Bitpie Wallet
altTitle: 
authors:
- leo
- danny
users: 100000
appId: com.bitpie
appCountry: 
released: 2016-10-23
updated: 2025-03-11
version: 5.0.187.g
stars: 3.9
ratings: 847
reviews: 126
website: http://bitpie.com
repository: 
issue: 
icon: com.bitpie.png
bugbounty: 
meta: ok
verdict: nosource
appHashes: 
date: 2024-07-17
signer: 
reviewArchive: 
twitter: BitpieWallet
social:
- https://www.facebook.com/BitpieOfficial
- https://www.reddit.com/r/BitpieWallet
redirect_from:
- /com.bitpie/
- /posts/com.bitpie/
developerName: getcai
features:
- ln

---

**Update 2024-07-17**: The last time this app was updated was in March 27, 2024. Prior to that, an [issue was filed](https://github.com/bitpiedotcom/bitpiedotcom.github.com/issues/7) on behalf of WalletScrutiny asking for its source-code to be made available. It went unanswered. Moreover, a search for the app ID on GitHub, turned up [hits on some cybersecurity database](https://github.com/github/advisory-database/blob/d8b7bd8352e1621965179b11ac9eff056e6363e1/advisories/unreviewed/2022/05/GHSA-8rhq-wwg6-2476/GHSA-8rhq-wwg6-2476.json#L9), which had a partial match on the app ID string. We are including the text for posterity:

> The Bitpie application through 3.2.4 for Android and iOS uses cleartext storage for digital currency initial keys, which allows local users to steal currency by leveraging root access to read /com.biepie/shared_prefs/com.bitpie_preferences.xml (on Android) or a plist file in the app data folder (on iOS).

With that interesting excerpt aside, the app is still **not source-available**.

**Update 2022-11-23**: This app is available once more.

**Update 2022-03-30**: This app is not available anymore.

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
