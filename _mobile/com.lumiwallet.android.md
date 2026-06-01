---
wsId: LumiWallet
title: Lumi Crypto Bitcoin Wallet
date: 2021-06-16
authors:
- leo
website: https://lumiwallet.com
twitter: Lumi_wallet
social:
- https://www.facebook.com/lumiwallet
redirect_from:
- /com.lumiwallet.android/
- /posts/com.lumiwallet.android/
- /android/com.lumiwallet.android/
- /iphone/com.lumiwallet.HD/
android:
  appId: com.lumiwallet.android
  users: 100000
  released: 2018-01-15
  updated: 2023-07-11
  version: 4.1.6
  reviews: 247
  icon: com.lumiwallet.android.png
  meta: removed
  verdict: nosource
  developerName: Raias Llc
iphone:
  appId: com.lumiwallet.HD
  idd: 1316477906
  released: 2017-12-08
  updated: 2021-04-30
  version: 3.10.2
  reviews: 3449
  icon: com.lumiwallet.HD.jpg
  meta: removed
  verdict: nosource

---

## Android

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

---

## iPhone

**Update 2021-06-16**: It's been a few days this app is not on the App store
anymore and it looks like it's not coming back. If it should return, please open
an issue on our issue tracker!

Just like for the Play Store version, the App Store wallet is not open source.
The provider only shares some of the code they presumably use in the app, with
no way of even proving this. The app is **not verifiable**.
