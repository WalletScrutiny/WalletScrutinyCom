---
title: KeyWallet Touch
appId: keywallettouch
authors:
- kiwilamb
- danny
released: 
discontinued: 
updated: 
version: 
binaries: 
dimensions:
- 54
- 85
- 0.8
weight: 5.4
provider: 
providerWebsite: http://www.keywallet.co.kr
website: 
shop: 
country: 
price: 
repository: 
issue: 
icon: keywallettouch.png
bugbounty: 
meta: ok
verdict: noita
date: 2023-02-07
signer: 
reviewArchive:
- date: 2021-08-01
  version: 
  appHash: 
  gitRevision: 8762a3742
  verdict: wip
twitter: keywallet
social:
- https://www.youtube.com/channel/UCpw_1bcmnaI-TIHZP5hXXww/videos
- https://www.facebook.com/profile.php?id=100050621501094
- https://medium.com/@keywallet
features: 

---

## Companion Apps

Here are our reviews of {{ page.title }}'s companion apps.

{% include walletLink.html wallet='android/kr.co.keypair.keywalletTouch' verdict='true' %} <br />
{% include walletLink.html wallet='iphone/kr.co.keypair.keywalletTouchiOS' verdict='true' %}


## Analysis 

According to the [site's technical specifications](http://www.keywallet.co.kr), this product is CC EAL 5+ and FIDO certified. It resembles a credit card in appearance and is meant to connect with an external device with NFC.

As shown in [this video](https://youtu.be/0ePgzZmz9ws?t=22), the companion app is responsible for making transactions but it depends on the card to sign them. The card signs whatever the non-verifiable companion app asks to sign.

**Updated Verdict 2023-04-05**: the device **does not have input/output interfaces.**