---
wsId: 
title: "Samourai Wallet"
altTitle: 
authors:
- leo
users: 100000
appId: com.samourai.wallet
released: 
latestUpdate: 2021-08-05
version: "Varies with device"
stars: 
ratings: 
reviews: 
size: Varies with device
website: https://samouraiwallet.com
repository: https://code.samourai.io/wallet/samourai-wallet-android
issue: https://code.samourai.io/wallet/samourai-wallet-android/-/issues/376
icon: com.samourai.wallet.png
bugbounty: 
verdict: nonverifiable
date: 2021-08-02
signer: 6ab9471c21d2cddd628172975cff8ba23584da41c6962df074eb56e4ef08d990
reviewArchive:


providerTwitter: SamouraiWallet
providerLinkedIn: 
providerFacebook: 
providerReddit: 

redirect_from:
  - /samourai/
  - /com.samourai.wallet/
  - /posts/2019/11/samourai/
  - /posts/com.samourai.wallet/
---


**Update 2021-08-02**: Samourai is currently certainly not reproducible as it's
even not possible to build it - due to an issue reported two months ago. We
tried to build it again, as the Samourai devs don't get tired to lie about the
project's reproducibility and we
[tried it again](https://twitter.com/LeoWandersleb/status/1422035180794089473).


**Update 2021-03-02**: Samourai [claims](https://twitter.com/SamouraiWallet/status/1366582280895004672)
to be on F-Droid, implying ... what exactly? FDroid.org has very strict rules
about code being open source but FDroid itself is also open source and allows to
add secondary repositories that might apply different rules and standards and
that's exactly what's happening here. FDroid.org does not list Samourai but
the Copperhead FDroid repository apparently does. As long as the binary on
Google Play is not the same as the one on Copperhead, the presence on Copperhead
has no relevance to the security of the 100k users that downloaded the app from
Google Play. Smoke and mirrors from Samourai as always.

**Update 2020-08-02**: Samourai [claims](https://twitter.com/SamouraiWallet/status/1289942465047396352)

![](/images/samouraiTweetLie.png)

which is a direct claim of falsehood of our findings. No other neutral party
supported this claim so far and neither did the provider explain how such
a verification should work or where our findings are wrong. This is so far the
clearest lie and thus red flag about this wallet.

**Update 2019-12-27**: The provider closed
[the issue we had opened on their repository](https://github.com/Samourai-Wallet/samourai-wallet-android/issues/376).

**Update 2019-12-16**: Samourai
[tweeted](https://twitter.com/SamouraiWallet/status/1206521035689996291) in
response to us:

> [@SamouraiWallet](https://twitter.com/SamouraiWallet) Replying to
  [@BashCo_](https://twitter.com/BashCo_) deterministic builds have not been a
  priority or goal at this stage of dev using the resources we have. The goals
  we have focused on (privacy, dojo, whirlpool, etc) we have continued to
  deliver on. There is limited value in this investment without expert audits
  for each release

**The original review**:

Samourai is still "early access" which means that there are no Google ratings or
comments.

Their website claims the wallet is non-custodial:

> Be your own Swiss Bank
> Fully non custodial software ensures you are always in control of your private
keys. No email address, no ID checks, and no hassle. Just install and go.

Given claims like:

> We are privacy activists who have dedicated our lives to creating the software
that Silicon Valley will never build, the regulators will never allow, and the
VC's will never invest in. We build the software that Bitcoin deserves.

we are not surprised to not find who is behind this wallet.

But the build instructions on their GitHub are fairly simple:

> Import as Android Studio project. Should build "as is".

so lets see what we get when we do this:


```
/tmp/$ git clone git@github.com:Samourai-Wallet/samourai-wallet-android.git
/tmp/$ cd samourai-wallet-android
/tmp/samourai-wallet-android$ git tag
0.81
0.99.27-gb
0.99.87
0.99.88
/tmp/samourai-wallet-android$ git checkout 0.99.88
```

We open the folder in
[Android Studio](https://developer.android.com/studio/index.html), set the
*Build Variants* as follows:

![Samourai Build Variants](/images/samouraiBuildVariants.png)

and build the APK.

The following is the full output of diffoscope. Red lines are what the playstore
version misses compared to the self compiled version and green lines are
additions. Right in the beginning we see the expected lines:
`META-INF/MANIFEST.MF` is different, `META-INF/CERT.RSA` and `META-INF/CERT.SF`
are exclusive to the playstore version as should be.

The rest of the diff is what makes the build **not verifiable**.

We left all the diff
[here](https://gitlab.com/walletscrutiny/walletScrutinyCom/-/blob/6ab76372/_android/com.samourai.wallet.md)
(The diff was part of the review itself but that caused issues on some browsers.)
for the more curious to investigate but it's obviously
too much to consider acceptable like we might conclude if it was only the `.png`
files that were different.
