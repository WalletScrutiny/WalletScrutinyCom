---
title: IriKey
appId: irikey
authors:
- danny
released: 
discontinued: 
updated: 
version: 
binaries: 
dimensions: 
weight: 
provider: Iritech, Inc
providerWebsite: https://www.iritech.com/
website: >-
  https://www.iritech.com/news-events/news/irikey-%E2%80%93-iris-based-secure-id-management-blockchain-applications
shop: 
country: 
price: 
repository: 
issue: 
icon: irikey.png
bugbounty: 
meta: defunct
verdict: nosource
date: 2022-03-23
signer: 
reviewArchive: 
twitter: IriTechInc
social:
- https://www.youtube.com/channel/UCOzyeb6Fyk-liU3zYlzvZuA
- http://www.facebook.com/IriTechInc?ref=hl

---

While Iritech's social media still looks to be active, there is little recent information online concerning their bitcoin hardware product. They are primarily a biometrics company. Listed relevant videos and articles all come from 2018-2019. Additionally, we found it odd there does not seem to be any clear link to any store for this hardware wallet.

IriKey is said to be a hardware wallet that utilizes iris biometrics. [Here is a video](https://www.youtube.com/watch?v=X1it12CVWzc) demonstrating this product's functions.

The providers state that IriKey does not utilize seed phrases. From [its article:](https://www.iritech.com/news-events/news/irikey-%E2%80%93-iris-based-secure-id-management-blockchain-applications)

> IriKey has a built-in NIR iris camera and on-board iris software that is used to “mix” (or “lock”) the wallet’s secret seed with its owner’s iris data. Once the so-called “iris locked seed” is generated (i.e., the mixture is done), the original seed and iris data will be forensically deleted for security purposes. The original seed can be retrieved from the locked seed if and only if a newly captured iris image is determined to be from the same eye used in locking the seed. That way, it will only take the owner an iris scan to login to IriKey (no PIN needed) or recover their assets in case the device is lost or stolen, given that the locked seed has been backed up in advance.

Generally, using biometrics for authorization is a bad idea. The presence (or mere visibility) of the user's eye does not mean the user's consent as

* it has no good replacement for [duress or decoy wallets](https://support.keys.casa/hc/en-us/articles/360045501331-How-to-Protect-Your-Bitcoin-from-5-Wrench-Attacks)
* you can't change the PIN if the login credentials (biometric features) leaked
* you have no plausible deniability about knowing a PIN/password

There wasn't any information on IriKey's source code. With little information about this product, we'll have to assume its code is **not up for review.**