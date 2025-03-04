---
wsId: CoinbaseWallet
title: 'Coinbase Wallet: NFTs & Crypto'
altTitle: 
authors:
- leo
- danny
users: 10000000
appId: org.toshi
appCountry: 
released: 2017-09-20
updated: 2025-02-28
version: 29.31.0
stars: 4.2
ratings: 38828
reviews: 13224
website: https://wallet.coinbase.com/
repository: 
issue: 
icon: org.toshi.png
bugbounty: 
meta: ok
verdict: nosource
appHashes: 
date: 2024-07-15
signer: 
reviewArchive: 
twitter: CoinbaseWallet
social: 
redirect_from:
- /coinbasewallet/
- /org.toshi/
- /posts/2019/11/coinbasewallet/
- /posts/org.toshi/
developerName: Coinbase Wallet
features: 

---

## Update 2024-07-15

The app is now called "Coinbase Wallet: NFTs & Crypto". Coinbase has made its wallet-sdk available for scrutiny but not the actual wallet. It has another project called the Smart Wallet, but that is Ethereum-exclusive and does not support Bitcoin. Apart from that, no changes have been noted. This app is still **not source-available**.

## Review 2021-05-31

Coinbase Wallet — Crypto Wallet & DApp Browser certainly sounds a lot like
{% include walletLink.html wallet='android/com.coinbase.android' verdict='true' %}
but this is actually a second wallet
[endorsed by the same Coinbase](https://wallet.coinbase.com/).

From their [FAQ](https://wallet.coinbase.com/faq/):

> Wallet is a user-custodied digital currency wallet and DApp browser.

so for us the next step would be to find the source and reproduce the app ...

On the same page there is a [link to GitHub](https://github.com/CoinbaseWallet)
but none to the actual repository. Neither is there on the Playstore description.

If we filter the list of repositories by those created by CoinbaseWallet, we get
[this list](https://github.com/CoinbaseWallet?type=source) of repositories that
most lack a description or a
[README.md](https://www.quora.com/What-is-the-purpose-of-readme-file-on-GitHub).

Here is the list as we found it with the only three descriptions underlined in
green, none of which sounds much like an Android wallet:

![list of repositories](/images/CoinbaseWalletRepositories.png)

Tiny correction ... some of the projects have
[empty README](https://github.com/CoinbaseWallet/CBCore/blob/master/README.md)s.

So from the names, the only two repositories that might contain relevant code
are `CBCore` and `CBHTTP`, both of which contain a folder called `android`.

An Android app has an ID and this ID has to be referenced in its source code, so
at this point we search for this app's ID `org.toshi`
[within the organization](https://github.com/search?q=org%3ACoinbaseWallet+%22org.toshi%22&type=Code)
which yields zero results.

Searching all of GitHub we do find the string `org.toshi`
[here](https://github.com/wd1/android_appclient/blob/master/app/build.gradle#L32)
for example but as this is not linked by the company and two years old, we will
not try to build it to verify a recently updated app.

This is the point where we come to the verdict **not verifiable** given there is
no public source code to build the app from.
