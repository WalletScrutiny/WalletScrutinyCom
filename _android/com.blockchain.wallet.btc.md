---
wsId: 
title: "Bitcoin Wallet - Blockchain Explorer"
altTitle: 
authors:
- kiwilamb
- leo
users: 50000
appId: com.blockchain.wallet.btc
released: 2021-04-03
latestUpdate: 2021-06-08
version: "1.0.1.7"
stars: 4.0
ratings: 750
reviews: 144
size: 24M
website: https://adslab-2b1c2.web.app
repository: https://github.com/hoanghiephui/Bitcoin-Wallet
issue: 
icon: com.blockchain.wallet.btc.png
bugbounty: 
verdict: obfuscated # wip fewusers nowallet nobtc obfuscated custodial nosource nonverifiable reproducible bounty defunct
date: 2021-06-04
reviewStale: true
signer: 
reviewArchive:


providerTwitter: 
providerLinkedIn: 
providerFacebook: 
providerReddit: 

redirect_from:

---


We list the following apps of this provider:

* [Bitcoin](/android/com.bitcoin.wallet.btc/) (obfuscated)
* [Bitcoin Wallet](/android/com.blockchain.wallet.btc/) (obfuscated)
* [Bitcoin Wallet](/android/com.blockchain.bitcoin.wallet/) (obfuscated)
* [Blockchain](/android/com.blockchain.explorer/) (not a wallet)
* [CoinHub](/android/com.blockchain.btc.coinhub/) (obfuscated)

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
