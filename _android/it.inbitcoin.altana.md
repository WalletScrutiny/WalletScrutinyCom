---
wsId: 
title: Altana - Bitcoin Wallet
altTitle: 
authors:
- emanuel
- leo
users: 1000
appId: it.inbitcoin.altana
appCountry: 
released: 2017-04-18
updated: 2021-10-14
version: Varies with device
stars: 
ratings: 
reviews: 
size: Varies with device
website: https://inbitcoin.it
repository: https://github.com/inbitcoin/altana-android
issue: https://github.com/inbitcoin/altana-android/issues/1
icon: it.inbitcoin.altana.png
bugbounty: 
meta: ok
verdict: nonverifiable
date: 2021-04-09
signer: 
reviewArchive: 
twitter: 
social: 
redirect_from: 

---

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
