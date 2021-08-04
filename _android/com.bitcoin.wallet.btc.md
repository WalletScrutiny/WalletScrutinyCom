---
wsId: 
title: "Bitcoin Wallet Blockchain"
altTitle: 
authors:
- leo
users: 100000
appId: com.bitcoin.wallet.btc
released: 2019-05-01
latestUpdate: 2021-07-20
version: "2.3.0"
stars: 4.3
ratings: 4663
reviews: 866
size: 28M
website: https://bitcoin-wallet.flycricket.io
repository: https://github.com/hoanghiephui/Bitcoin-Wallet
issue: https://github.com/hoanghiephui/Bitcoin-Wallet/issues/15
icon: com.bitcoin.wallet.btc.png
bugbounty: 
verdict: fake
date: 2021-07-26
signer: 
reviewArchive:
- date: 2021-06-04
  version: "2.3.0"
  appHash: 
  gitRevision: b994137e4f91927a8680b389b81bb5945d1ddf71
  verdict: obfuscated
- date: 2019-11-19
  version: "1.8.1"
  appHash: 
  gitRevision: 8dc1853115753c1c3ab4e8dc321ee339f071541a
  verdict: nonverifiable

providerTwitter: 
providerLinkedIn: 
providerFacebook: 
providerReddit: 

redirect_from:

---


**Update 2021-07-26**: The provider features several apps that either through
their logo or the name try to resemble trusted wallets like
{% include walletLink.html wallet='android/de.schildbach.wallet' %}
or
{% include walletLink.html wallet='android/piuk.blockchain.android' %}.
Given other issues with the products, we assume they are fakes.

**Update 2021-06-04**: The provider
[promised to "check soon" back in 2019](https://github.com/hoanghiephui/Bitcoin-Wallet/issues/15#issuecomment-557786905)
but several later attempts to get an update failed.

We list the following apps of this provider:

* {% include walletLink.html wallet='android/com.bitcoin.wallet.btc' verdict=true %}
* {% include walletLink.html wallet='android/com.blockchain.wallet.btc' verdict=true %}
* {% include walletLink.html wallet='android/com.blockchain.bitcoin.wallet' verdict=true %}
* {% include walletLink.html wallet='android/com.blockchain.explorer' verdict=true %}
* {% include walletLink.html wallet='android/com.blockchain.btc.coinhub' verdict=true %}

Something shady is going on here. This wallet looked like a wallet when we
tried to reproduce it from the provided source in 2019 and we failed to
do that. Check "Older reviews" above for details. Now (ok, a while ago:
2020-09-16), user "alex Kijvanit" commented on the wallet:

> What a crazy app! I install then open the app. First thing came up was "we no
  longer support this app. Please backup". What the hell!!

We tried to start the app as it is installed on our device (after all it might
contain funds) and do not even get this message. Just an instant close or crash.

Other users report the same.

After deleting the app's data (or re-installing it), the app starts without any
such symptoms but for example the backup appears to not get written to the
sdcard.

Upon further investigation of their app, we find it is obfuscated. This is a big
red flag for a wallet that claims to be open source. We put those wallets in
their own category as they clearly are worse than closed source. **Do not trust
this wallet!**
