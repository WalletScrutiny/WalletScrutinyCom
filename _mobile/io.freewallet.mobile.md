---
wsId: FreeWalletIO
title: FreeWallet
verdict: sourceavailable
meta: obsolete
authors:
- leo
- danny
website: https://freewallet.io
repository: https://github.com/jdogresorg/freewallet-mobile
twitter: freewallet
social:
- https://www.facebook.com/freewallet.io
features:
- foss
- segwit
- fingerprint
developerName: Jeremy Johnson
redirect_from:
- /io.freewallet.mobile/
- /android/io.freewallet.mobile/
- /iphone/io.freewallet.mobile/
android:
  appId: io.freewallet.mobile
  users: 10000
  released: 2016-09-01
  updated: 2019-03-17
  version: 0.1.9
  reviews: 30
  icon: io.freewallet.mobile.jpg
  date: 2021-10-01
iphone:
  appId: io.freewallet.mobile
  idd: 1151168579
  released: 2016-11-05
  updated: 2019-03-18
  version: 1.0.9
  reviews: 38
  icon: io.freewallet.mobile.jpg
  date: 2021-10-22

---

## Android

{% include featureEvidence.html feature="foss" source="[License](https://github.com/jdogresorg/freewallet-mobile/blob/master/LICENSE)" quote="The MIT License (MIT)" %}
{% include featureEvidence.html feature="segwit" source="[Website](https://freewallet.io)" quote="Supports multiple addresses as well as segwit, importing private keys, and watch-only addresses." %}
{% include featureEvidence.html feature="fingerprint" source="[Website](https://freewallet.io)" quote="Add an Password, PIN or thumbprint scan to give your wallet an additional layer of security." %}

The provider of this Freewallet reached out to us to stress that freewallet.io
was not the same as freewallet.org which is spamming Google Play with many
wallets and we have reviewed three of those here, too:

* {% include walletLink.html wallet='android/btc.org.freewallet.app' verdict='true' %}
* {% include walletLink.html wallet='android/mw.org.freewallet.app' verdict='true' %}
* {% include walletLink.html wallet='android/org.freewallet.lite.android' verdict='true' %}

He says that his wallet is non-custodial and open source and indeed we see those
same claims on Google Play.

On the website we read:

> **Open Source**<br>
  FreeWallet Mobile is open-source, and available for anyone to fork or review, so you know that it works exactly the way that it is supposed to.

and indeed we find [a repository](https://github.com/jdogresorg/freewallet-mobile).
It had no changes for two years and also Google Play does not report any changes
since March 2019 but this looks like open source.

Unfortunately there is no build instructions so we cannot reproduce the app and
it remains **not verifiable**.

An issue has been opened at [https://github.com/jdogresorg/freewallet-mobile/issues/34](https://github.com/jdogresorg/freewallet-mobile/issues/34)

---

## iPhone

{% include featureEvidence.html feature="segwit" source="[Website](https://freewallet.io)" quote="Supports multiple addresses as well as segwit, importing private keys, and watch-only addresses." %}

**Update 2022-01-04**: The iOS version of the app is available again. [(Twitter Screenshot)](https://twitter.com/BitcoinWalletz/status/1478292560443367427). The last update however was 2019-03-18.

**Update 2021-10-12**: This app is not available anymore.

In the description we can read:

> Secure<br>
  Wallet Passphrase & private keys never leave device

and

> FreeWallet is an open source mobile wallet which supports Bitcoin.

so it's a non-custodial, open source Bitcoin wallet but can we verify the
claims?

On their website we find a link to their GitHub and from their to the mobile
wallet's repository. There we find no claims of reproducibility and not even
build instructions, so this app is **not verifiable**.
