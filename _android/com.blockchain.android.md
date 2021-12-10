---
title: "Blockchain"
altTitle: 

users: 50000
appId: com.blockchain.android
released: 2020-06-15
updated: 2021-01-04
version: "1.0.7.5"
stars: 4.4
ratings: 2737
reviews: 532
size: 21M
website: 
repository: https://github.com/hoanghiephui/Bitcoin-Wallet
issue: 
icon: com.blockchain.android.png
bugbounty: 
verdict: defunct
date: 2021-01-15
signer: 
reviewArchive:
- date: 2020-11-28
  version: "1.0.7.5"
  appHash: 
  gitRevision: deed03beb86d7c7aa7d4078d9c13d1501ce35bd6
  verdict: obfuscated


providerTwitter: 
providerLinkedIn: 
providerFacebook: 
providerReddit: 

redirect_from:
---


**Update:** This wallet is no more but never looked too likely to stay around
for long:

This app looks shady and might try to imitate
[this popular wallet](/piuk.blockchain.android/).

As of writing this analysis, their names and logos resemble one another and even
the app id looks better than the "original":

<table>
<tr><td>Name:</td><td>Blockchain Wallet: Buy and Sell Bitcoin & Crypto</td><td>Blockchain</td></tr>
<tr><td>Logo:</td><td><img src="/images/wallet_icons/android/small/piuk.blockchain.android.png"></td><td><img src="/images/wallet_icons/android/small/com.blockchain.android.png"></td></tr>
<tr><td>Launched:</td><td>2013-02-01</td><td>2020-06-15</td></tr>
<tr><td>App ID:</td><td>piuk.blockchain.android</td><td>com.blockchain.android</td></tr>
<tr><td>Website:</td><td>blockchain.com</td><td>none (Google? Since when is that possible?)</td></tr>
<tr><td>Downloads</td><td>5,000,000</td><td>50,000</td></tr>
<tr><td>Stars:</td><td>3.9</td><td>4.4</td></tr>
</table>

Now "blockchain" is a generic term and any wallet might use it but their app ID
is "com.blockchain.android" which is the canonical way of naming blockchain.com's
first/only android product. Also the app description:

> Use the most popular block explorer to search and verify transactions on the
  Bitcoin, Ethereum, and Bitcoin Cash blockchain.
> 
> Especially, this is the standard Bitcoin Wallet, easy and safe to use. Because
  it is cold wallet

* "the most popular block explorer" is blockchain.com and many users confuse
  "look it up on the blockchain" with an invitation to check on blockchain.com.
  One is a technical term describing Satoshi's invention although he never used
  that term in his [whitepaper](https://bitcoin.org/bitcoin.pdf). The other is a
  brand name.
* "this is the standard Bitcoin Wallet" ... pardon what? "this" is a newcomer
  with 100 times fewer downloads so far.
* "*safe to use*" isn't blockchain.com's reputation neither :)
* "Because it is cold wallet": What? How does that make sense?

The provider claims this wallet to be open source and indeed there is a
[link to their GitHub](https://github.com/hoanghiephui/Bitcoin-Wallet) but in
contrast to all reproducible wallets, this one
[uses obfuscation](https://github.com/hoanghiephui/Bitcoin-Wallet/blob/master/mobile/build.gradle#L43)
meaning that the app is very hard to reverse engineer if not reproducible.

As the latest update was only days ago, yet the latest code change on GitHub was
published months ago, there is no point in trying to reproduce the build.

And here it gets a bit wild: This repository is nothing new. It is also
referenced in the [Bitcoin Wallet Blockchain](/com.bitcoin.wallet.btc/)!
Both apps are by the same provider: InvoVN Solutions. Read up on that other
wallet as it's not really reassuring.

**We strongly urge you to not use this app!**
