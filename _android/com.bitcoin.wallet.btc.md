---
wsId: 
title: "Bitcoin Wallet Blockchain"
altTitle: 
authors:
- leo
users: 100000
appId: com.bitcoin.wallet.btc
launchDate: 2019-05-01
latestUpdate: 2021-02-17
apkVersionName: "2.0.1"
stars: 4.3
ratings: 1906
reviews: 436
size: 21M
website: https://bitcoin-wallet.flycricket.io
repository: https://github.com/hoanghiephui/Bitcoin-Wallet
issue: https://github.com/hoanghiephui/Bitcoin-Wallet/issues/15
icon: com.bitcoin.wallet.btc.png
bugbounty: 
verdict: obfuscated # wip fewusers nowallet nobtc obfuscated custodial nosource nonverifiable reproducible bounty defunct
date: 2020-11-30
reviewStale: true
signer: 
reviewArchive:
- date: 2019-11-19
  version: "1.8.1"
  apkHash: 
  gitRevision: 8dc1853115753c1c3ab4e8dc321ee339f071541a
  verdict: nonverifiable

providerTwitter: 
providerLinkedIn: 
providerFacebook: 
providerReddit: 

redirect_from:
  - /bitcoinblockchainwallet/
  - /com.bitcoin.wallet.btc/
  - /posts/2019/11/bitcoinblockchainwallet/
  - /posts/com.bitcoin.wallet.btc/
---


Something shady is going on here. This wallet looked like a wallet when we
tried to reproduce it from the provided source a year ago and we failed to
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
