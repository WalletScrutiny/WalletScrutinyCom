---
wsId: 
title: 'Rust: Bitcoin Wallet - BTC'
altTitle: 
authors:
- leo
users: 5000
appId: com.rust.bitcoinwallet
appCountry: 
released: 2023-04-15
updated: 2023-05-15
version: 3.04.30
stars: 
ratings: 
reviews: 
website: https://altrafinance.io/
repository: 
issue: 
icon: com.rust.bitcoinwallet.png
bugbounty: 
meta: removed
verdict: obfuscated
appHashes: 
date: 2023-06-21
signer: 
twitter: 
social: 
redirect_from: 
developerName: 
features: 

---

After users
[reported this wallet](https://www.reddit.com/r/Bitcoin/comments/13ieh29/stolen_bitcoin/)
as stealing their funds, we had a look at it. While we can't confirm this
particular user's losses being due to theft by the wallet, the product sure
does look suspicious:

* Logo, Splash screen logo animation and website were copied from
  {% include walletLink.html wallet='android/io.bluewallet.bluewallet' verdict='true' %}.
* The "Download on the App Store" button does nothing - Apple is stricter
  with apps than Google.
* 5k downloads after just one month of launching the product, yet we can't find
  reviews.
* We downloaded the app and decompiled it. It was obfuscated.
* They claim it's open source but link no source anywhere.
* No social accounts.
* No [features](https://altrafinance.io/features/)
* No [support](https://altrafinance.io/support/)

We decompiled the app to get more insight - if it's copied from a competitor for example but it's obfuscated. This product can **not be verified**.
