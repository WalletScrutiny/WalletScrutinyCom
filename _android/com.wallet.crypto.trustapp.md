---
wsId: sixdays
title: 'Trust: Crypto & Bitcoin Wallet'
altTitle: 
authors:
- leo
users: 10000000
appId: com.wallet.crypto.trustapp
appCountry: 
released: 2017-10-01
updated: 2023-03-07
version: '7.7'
stars: 4.6
ratings: 841930
reviews: 13592
size: 
website: https://trustwallet.com/
repository: 
issue: 
icon: com.wallet.crypto.trustapp.png
bugbounty: 
meta: ok
verdict: nosource
date: 2019-11-20
signer: 
reviewArchive: 
twitter: trustwalletapp
social:
- https://www.facebook.com/trustwalletapp
- https://www.reddit.com/r/trustapp
redirect_from:
- /trust/
- /com.wallet.crypto.trustapp/
- /posts/2019/11/trust/
- /posts/com.wallet.crypto.trustapp/
developerName: DApps Platform, Inc.
features: 

---

Trust - Crypto & Bitcoin Wallet
claims to be a non-custodial wallet. In the description on Google Play we read:

> Trust Wallet provides a full security audited system to send, receive and store multiple digital assets so that you have complete control over your private keys that are only stored on your device.

They decided to close their Android app's source code and provided an
[explanation](https://medium.com/@trustwallet/why-open-sourcing-android-app-could-be-a-harm-to-the-crypto-community-fb3ae1707dc6):

> As of today, we decided to move the Trust Wallet app for Android into closed source development.
>
> It has come to our attention that some dishonest developers have been cloning Trust Wallet and either scamming users or using the code without permission as their own product. Unfortunately, it is almost impossible to trace and remove those applications in the Android ecosystem.
>
> We would like to support Coinomi wallet on this critical issue. We understand their decision for keeping wallet closed source to protect users and would like to do the same.
>
> Our mission doesn’t change. We still want to be transparent in the development of our product, that is why we have made an earlier version of Trust Wallet for Android available to public.


Further Observations
--------------------

Above quote

> We would like to support Coinomi wallet on this critical issue

made us to look into {% include walletLink.html wallet='android/com.coinomi.wallet' verdict='true' %} more closely.

Also in the description we read:

> Trust Browser is a full-fledged Web3 browser that allows you to interact with decentralized applications (DApp) directly from the app.

which raises strong security concerns given browsers are prone to security
issues and the Android way of giving exclusive access of apps to their own data
usually means that all code within the app is a huge step closer to the app's
data and thus the private keys than other apps for example and as browsers
(and certainly "full-fledged ... browsers") come with code execution, malicious
code could be dynamically loaded without being subject to code review.

Without public code the verdict is anyway: **not verifiable**.
