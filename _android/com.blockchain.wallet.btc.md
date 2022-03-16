---
wsId: 
title: "Bitcoin Wallet - Blockchain Explorer"
altTitle: "(Fake) Bitcoin Wallet - Blockchain Explorer"
authors:
- kiwilamb
- leo
users: 50000
appId: com.blockchain.wallet.btc
appCountry: 
released: 2021-04-03
updated: 2022-03-03
version: "1.0.2.7"
stars: 4.529412
ratings: 948
reviews: 46
size: 25M
website: https://adslab-2b1c2.web.app
repository: https://github.com/hoanghiephui/Bitcoin-Wallet
issue: 
icon: com.blockchain.wallet.btc.png
bugbounty: 
meta: ok
verdict: fake
date: 2021-07-26
signer: 
reviewArchive:
- date: 2021-06-04
  version: "1.0.1.8"
  appHash: 
  gitRevision: b994137e4f91927a8680b389b81bb5945d1ddf71
  verdict: obfuscated
twitter: 
social:
redirect_from:
---

**Update 2021-07-26**: The provider features several apps that either through
their logo or the name try to resemble trusted wallets like
{% include walletLink.html wallet='android/de.schildbach.wallet' %}
or
{% include walletLink.html wallet='android/piuk.blockchain.android' %}.
Given other issues with the products, we assume they are fakes.

We list the following apps of this provider:

* {% include walletLink.html wallet='android/com.bitcoin.wallet.btc' verdict=true %}
* {% include walletLink.html wallet='android/com.blockchain.wallet.btc' verdict=true %}
* {% include walletLink.html wallet='android/com.blockchain.bitcoin.wallet' verdict=true %}
* {% include walletLink.html wallet='android/com.blockchain.explorer' verdict=true %}
* {% include walletLink.html wallet='android/com.blockchain.btc.coinhub' verdict=true %}

Although the name "Bitcoin Wallet - Blockchain Explorer" isn't clearly saying if
it's an explorer or an actual wallet, the description is:

> Bitcoin Wallet - Blockchain Explorer is the cold wallet, it is the safest, and
  open source, for send and receive Bitcoin.

As it is for sending and receiving, it is a wallet by our understanding.

> There is no server that would hold any of your private data.

sounds pretty non-custodial and even more so, they claim there is no server.
This would actually be a fact that's easy to check: Does the wallet try to
connect to a server?

Let's see what we can verify:

### Open Source?

So they claim:

> Latest code is available at GitHub:<br>
  https://github.com/hoanghiephui/Bitcoin-Wallet

but there, the
[applicationId](https://github.com/hoanghiephui/Bitcoin-Wallet/blob/master/mobile/build.gradle#L96)
is `com.bitcoin.wallet.btc`, not `com.blockchain.wallet.btc`.

There is no branches neither where there might be alternative `applicationId`s.

We [asked about the wrong applicationId on 2021-04-15](https://github.com/hoanghiephui/Bitcoin-Wallet/issues/17)
but the developer did not answer so far.

That lets us think the app is not only not open-source but the provider might be
lying about the nature of the app's transparency.

After reviewing above mentioned apps by the same provider, we also check if this
app is obfuscated and sure enough, it is. Obfuscation is a huge red flag and we
recommend to not use this app.
