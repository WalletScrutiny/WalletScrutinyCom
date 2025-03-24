---
wsId: 
title: Shango Lightning Wallet
altTitle: 
authors:
- leo
users: 1000
appId: com.shango
appCountry: 
released: 
updated: 2019-06-01
version: Varies with device
stars: 
ratings: 
reviews: 
website: http://www.shangoapp.com
repository: 
issue: https://github.com/neogeno/shango-lightning-wallet/issues/84
icon: com.shango.png
bugbounty: 
meta: removed
verdict: nosource
appHashes: 
date: 2021-07-16
signer: 
reviewArchive: 
twitter: shangoapp
social:
- https://www.facebook.com/shangoapp
redirect_from:
- /com.shango/
- /posts/com.shango/
developerName: 
features: 

---

**Update 2021-07-16**: This app is not available on the Play Store. Given our
findings below, we don't expect it to come back.

This app features

> No hassle, instant setup. The Shango service offers you a FREE, secure LND
  cloud server instance paired to your device, without requiring you to master
  advanced technical skills and command line tools.

but although they set those servers up, they claim:

> Note: Shango doesn't hold any funds, does not store any user identifiable
  information, does not have access to any private keys nor perform any
  transactions. It relies on and sends commands to the open source daemon LND to
  perform Lightning network operations.

so that is certainly weird. Maybe the website is more informative ...

Turns out, the website uses a ten months expired ssl certificate and greets us
with:

> **Warning: Potential Security Risk Ahead**

Not exactly inspiring confidence. So we ignore the warning for you and get
rewarded with a link to their GitHub with the label:

> **Open Source**
> 
> Don't trust us, verify the code. All source files on Github.

but there we see some 20 files that are definitely not an Android app and no
activity in over a year.

This app is for all we can see closed source and thus **not verifiable**.
