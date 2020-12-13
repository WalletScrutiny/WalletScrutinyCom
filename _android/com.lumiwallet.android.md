---
title: "Lumi Crypto and Bitcoin Wallet"
altTitle: 

users: 100000
appId: com.lumiwallet.android
launchDate: 2018-01-15
latestUpdate: 2020-12-09
apkVersionName: "3.2.4"
stars: 4.8
ratings: 2963
reviews: 791
size: 7.6M
website: https://lumiwallet.com
repository: 
issue: 
icon: com.lumiwallet.android.png
bugbounty: 
verdict: nosource # wip fewusers nowallet nobtc obfuscated custodial nosource nonverifiable reproducible bounty defunct
date: 2020-06-15
reviewStale: true
signer: 
reviewArchive:


providerTwitter: Lumi_wallet
providerLinkedIn: 
providerFacebook: lumiwallet
providerReddit: 

redirect_from:
  - /com.lumiwallet.android/
  - /posts/com.lumiwallet.android/
---


**Update:** *Following a
[conversation on Twitter](https://twitter.com/Lumi_wallet/status/1272393956870049792)
we checked again and also added statements of being Open Source and our take to
those.*

The description on their Playstore listing gets straight to the point:

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
