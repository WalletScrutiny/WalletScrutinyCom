---
wsId: LumiWallet
title: Lumi Crypto Bitcoin Wallet
altTitle: 
authors:
- leo
users: 100000
appId: com.lumiwallet.android
appCountry: 
released: 2018-01-15
updated: 2022-09-26
version: 4.1.5
stars: 4.5
ratings: 6388
reviews: 280
size: 
website: https://lumiwallet.com
repository: 
issue: 
icon: com.lumiwallet.android.png
bugbounty: 
meta: ok
verdict: nosource
date: 2021-06-16
signer: 
reviewArchive: 
twitter: Lumi_wallet
social:
- https://www.facebook.com/lumiwallet
redirect_from:
- /com.lumiwallet.android/
- /posts/com.lumiwallet.android/

---

**Update 2021-06-16**: Something weird is going on. Apparently there are three
Lumi apps: {% include walletLink.html wallet='iphone/com.lumiwallet.HD' %} on
the App Store, another on the Play Store:
{% include walletLink.html wallet='android/com.btc.lumi.bestofwallet' %}
and this one here. The first
two are defunct. 

**Update 2020-06-15:** *Following a
[conversation on Twitter](https://twitter.com/Lumi_wallet/status/1272393956870049792)
we checked again and also added statements of being Open Source and our take on
those.*

The description on their Play Store listing gets straight to the point:

> With Lumi Wallet, you are the only one in charge of your funds. Your private
  keys are stored on your device, and the funds are protected with a 12-word
  mnemonic.

So they are not custodial but can we verify this?

On their website we find no link to the wallet's source code although they
claim:

> **Open-source** We’re ready to prove our reliability that’s why our code is
  publicly available.

In their
[FAQ we find](https://support.lumiwallet.com/support/solutions/articles/60000144083-is-lumi-open-source-):

> **Is Lumi open-source?**
> 
> Open-source is one of the major concepts in the cryptocurrency space as the
  whole industry basically grew up on it. Nowadays, building a crypto project
  without publishing at least a part of your code on GitHub is considered to be
  bad manners.
>
> We are proud to say that our core wallet technology is open-source. You can
  view the libraries (for Android, iOS and Web) that we use to generate private
  keys and sign the transactions.
>  
> We use these libraries in our apps and in the web version of the wallet. You
  are welcome to see and review it anytime via this
  [link](https://github.com/lumiwallet).

Public source is not about good or "bad manners". and "publishing at least a
part of your code" achieves nothing at all in terms of security of the app in
Google Play.

"We are proud to say that our core wallet technology is open-source." ... this
in turn is indeed something to proudly announce: The code they have on GitHub is
not only public but also Open Source. Their `lumi-android-core` for example is
released under the very permissive MIT license. Kudos to their contribution!

For peace of mind that the wallet doesn't contain backdoors though,
publishing libraries that are *used by the wallet*, without also *publishing
the wallet's code* itself is not enough and until that code is public at least
under a less permissive license, we have to remain with our verdict:
**not verifiable**
