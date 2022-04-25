---
wsId: CoinbaseWallet
title: Coinbase Wallet - Store Crypto
altTitle: 
authors:
- leo
users: 5000000
appId: org.toshi
appCountry: 
released: 2017-09-20
updated: 2022-04-19
version: 26.8.431
stars: 3.9
ratings: 38828
reviews: 8745
size: Varies with device
website: https://wallet.coinbase.com/
repository: 
issue: 
icon: org.toshi.png
bugbounty: 
meta: ok
verdict: nosource
date: 2021-05-31
signer: 
reviewArchive: 
twitter: CoinbaseWallet
social: 
redirect_from:
- /coinbasewallet/
- /org.toshi/
- /posts/2019/11/coinbasewallet/
- /posts/org.toshi/

---

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
