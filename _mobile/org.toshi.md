---
wsId: CoinbaseWallet
title: 'Coinbase Wallet: Trade to Win'
date: 2026-10-30
authors:
- leo
- danny
website: https://wallet.coinbase.com/
twitter: CoinbaseWallet
redirect_from:
- /coinbasewallet/
- /org.toshi/
- /posts/2019/11/coinbasewallet/
- /posts/org.toshi/
- /android/org.toshi/
- /iphone/org.toshi.distribution/
android:
  appId: org.toshi
  users: 10000000
  appCountry: us
  released: 2017-09-20
  updated: 2026-10-09
  version: 30.16.0
  reviews: 14174
  icon: org.toshi.webp
  meta: ok
  verdict: nosource
  developerName: Coinbase Wallet
iphone:
  appId: org.toshi.distribution
  idd: 1278383455
  appCountry: us
  released: 2017-09-27
  updated: 2026-10-12
  version: '30.16'
  reviews: 161387
  icon: org.toshi.distribution.webp
  meta: ok
  verdict: nosource
  developerName: Coinbase Wallet

---

## Android

**Update 2026-10-30:** Still self-custodial, still no public app source.
Coinbase renamed the app "Base App" in July 2025
([CoinDesk](https://www.coindesk.com/tech/2025/07/17/coinbase-wallet-becomes-base-app-in-major-rebrand))
and back to "Coinbase Wallet" in September 2026, saying "the wallet will remain
self-custodial, with users retaining their own keys"
([The Block](https://www.theblock.co/news/defi/2026-09-10-coinbase-rebrands-base-app-back-to-coinbase-wallet-after-just-over-a-year-as-social-experiment-falls-short-414115)).
The [website](https://wallet.coinbase.com/) now advertises trading "in one
self-custodial wallet". A GitHub code search for the app ID `org.toshi` in an
`AndroidManifest.xml` finds nothing, and the
[CoinbaseWallet](https://github.com/CoinbaseWallet) account still holds only
libraries and tools. The verdict stays
{% include verdictBadge.html verdict="nosource" type='short' %}.

## Update 2024-07-15

The app is now called "Coinbase Wallet: NFTs & Crypto". Coinbase has made its wallet-sdk available for scrutiny but not the actual wallet. It has another project called the Smart Wallet, but that is Ethereum-exclusive and does not support Bitcoin. Apart from that, no changes have been noted. This app is still **not source-available**.

## Review 2021-05-31

Coinbase Wallet — Crypto Wallet & DApp Browser certainly sounds a lot like
{% include walletLink.html wallet='android/com.coinbase.android' verdict='true' %}
but this is actually a second wallet
[endorsed by the same Coinbase](https://wallet.coinbase.com/).

From their [FAQ](https://web.archive.org/web/20220427150034/https://wallet.coinbase.com/faq/):

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

---

## iPhone

**Update 2026-10-30:** The same rename applies here, and we found no public
source for the iPhone app either. The verdict stays
{% include verdictBadge.html verdict="nosource" type='short' %}.

This is the iPhone version of the Android
{% include walletLink.html wallet='android/org.toshi' %}.

Just like the Android version, this wallet is **not verifiable**.
