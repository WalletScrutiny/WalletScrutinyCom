---
wsId: guarda
title: 'Guarda: Crypto Bitcoin Wallet'
altTitle: 
authors:
- leo
- danny
users: 500000
appId: com.crypto.multiwallet
appCountry: 
released: 2018-11-01
updated: 2025-04-09
version: 3.0.82
stars: 3.3
ratings: 3831
reviews: 559
website: https://guarda.com
repository: 
issue: https://github.com/guardaco/guarda-android-wallets/issues/42
icon: com.crypto.multiwallet.jpg
bugbounty: 
meta: ok
verdict: nosource
appHashes: 
date: 2024-07-13
signer: 
twitter: GuardaWallet
social:
- https://www.facebook.com/guarda.co
- https://www.reddit.com/r/GuardaWallet
redirect_from:
- /guardawallet/
- /com.crypto.multiwallet/
- /posts/2019/11/guardawallet/
- /posts/com.crypto.multiwallet/
developerName: GUARDA
features: 

---

## Update 2024-07-13

The repository named [guarda-android-wallets](https://github.com/guardaco/guarda-android-wallets) has been archived in 2021.

## 2019-12-17

This wallet - `com.crypto.multiwallet` according to their applicationId,
"Moxi wallet" according to the first sentence of their description on Google
Play and "Guarda Wallet – for Bitcoin, Ethereum, etc." according to the app name -


doesn't have access to your private keys ...

> Moxi wallet doesn't have access to your keys and does not store your funds,

or do they? Here is the next sentence from the Google Play description:

> they are stored offline. We provide a wallet's backup for extra safety.

That sounds a lot like the provider keeps a copy of your private keys, does it
not?

Yet under features they explicitly claim:

> – Non-custodial wallet. We do not store your money.

Also good to know:

> This app does not mine cryptocurrency.

So maybe the confusion above is just a language barrier thing. We will assume
for now that the wallet is in fact non-custodial and the backup scheme actually
does work without them having access. In a deeper review, this would certainly
be one of the first points to check.

Looking for source code, we found a link to the company GitHub and from there to
a repository named
[guarda-android-wallets](https://github.com/guardaco/guarda-android-wallets) -
very promising.

As it turns out, "guarda-android-wallets" can be used to compile single coin
wallets but no app with the application ID `com.crypto.multiwallet`. In fact a
[search over all of GitHub](https://github.com/search?q=%22com.crypto.multiwallet%22)
didn't yield results neither.

Without source code available, our verdict is: **not verifiable**.
