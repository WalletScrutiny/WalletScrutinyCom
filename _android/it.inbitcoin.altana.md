---
wsId: 
title: 'Altana - Bitcoin Wallet'
altTitle: 
authors:
- 'emanuel'
- 'leo'
users: 1000
appId: 'it.inbitcoin.altana'
appCountry: 
released: '2017-04-18'
updated: '2024-09-15'
version: 'VARY'
stars: 
ratings: 
reviews: 
size: 
website: 'https://inbitcoin.it'
repository: 'https://github.com/inbitcoin/altana-android'
issue: 'https://github.com/inbitcoin/altana-android/issues/5'
icon: 'it.inbitcoin.altana.png'
bugbounty: 
meta: 'removed'
verdict: 'nosource'
appHashes: 
date: '2024-11-04'
signer: 
reviewArchive: 
twitter: 
social: 
redirect_from: 
developerName: 'inbitcoin'
features: 

---

**Update 2022-08-07:** This app released version 21.10.13 without updating the
source code.

This analysis is based on [this issue by Emanuel](https://gitlab.com/walletscrutiny/walletScrutinyCom/-/issues/165).

This app is a fork of the currently reproducible
{% include walletLink.html wallet='android/com.greenaddress.greenbits_android_wallet' %}
and supports Bitcoin with the same timelock-and-multisig setup as Green.

> Altana is based on services offered by GreenAddress.

sounds like the app doesn't come with their own servers but relies on
Blockstream's servers.

["Their website"](https://inbitcoin.it/) has only a small section on the wallet
which basically links back to Google Play for details and a code repository is
nowhere to be found. But I think Emanuel found this wallet the other way around,
by searching GitHub for Bitcoin wallets and so he shared [this repo](https://github.com/inbitcoin/altana-android)

Emanuel also managed to build the wallet but with plenty of differences to the
version from Google Play. Until those are resolved, the app is
**not verifiable**. Check [the issue](https://github.com/inbitcoin/altana-android/issues/1)
for details.
