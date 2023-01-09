---
wsId: 
title: Bitcoin Wallet - MaxWallet
altTitle: 
authors:
- leo
users: 10000
appId: com.maxxwallet
appCountry: 
released: 2019-03-25
updated: 2019-06-12
version: 3.7.3
stars: 
ratings: 
reviews: 
size: 
website: http://bitcoinwalletcoin.com
repository: 
issue: 
icon: com.maxxwallet.png
bugbounty: 
meta: obsolete
verdict: nosource
date: 2021-08-17
signer: 
reviewArchive: 
twitter: 
social: 
redirect_from:
- /com.maxxwallet/

---

In Google Play we read the right claims:

> Exclusive control of your wallet’s private keys.

and

> Open source

But ... this app was not updated in 18 months, has only one review which is
about lost coins and the provider did not ask to contact support but asks
details right there in public.

And that's all we can find out as the website is for sale by a Japanese
registrar. That's the same domain they provide for their contact email.

This app is **not verifiable** and **probably a scam**.

### Some more digging

So we decompiled the app using jadx and there we see it is a clone of
{% include walletLink.html wallet='android/com.breadwallet' verdict='true' %}. BRD is published under the MIT license and thus
cloning is not a problem. A bit problematic might be that this wallet connects
to BRD's servers (`HOST = "api.breadwallet.com"`).

To find out what modifications this wallet did to the original, one would
probably figure out which version they cloned from, compile that BRD wallet and
compare the decompilation of both apps.
