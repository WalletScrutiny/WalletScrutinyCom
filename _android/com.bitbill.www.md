---
wsId: ownbit
title: "Ownbit: Cold & MultiSig Wallet"
altTitle: 
authors:
- leo
users: 5000
appId: com.bitbill.www
released: 2018-03-22
updated: 2021-10-17
version: "4.32.1"
stars: 3.7
ratings: 76
reviews: 41
size: 33M
website: http://www.bitbill.com
repository: 
issue: 
icon: com.bitbill.www.png
bugbounty: 
verdict: nosource
date: 2020-04-15
signer: 
reviewArchive:


providerTwitter: 
providerLinkedIn: 
providerFacebook: 
providerReddit: 

redirect_from:
  - /com.bitbill.www/
  - /posts/com.bitbill.www/
---


On the Google Play description we read:

> The mnemonics, seeds (used to generate private keys) of Ownbit wallet are
  encrypted and stored on the phone side. The private key is completely under
  your control.

So this is a non-custodial wallet.

This wallet appears to feature a "cold storage" mode where the same app gets
installed on an offline and an online phone and so the private keys never are
connected to the internet. This of course provides very high security if the
private keys are generated with good entropy. An evil provider could limit the
entropy to generate only one out of a million backups to make those guessable
for him but collisions unlikely. Scrutiny is therefore even in this mode of the
essence.

So lets see if this app provides public source code ...

Turns out, [their website](http://www.bitbill.com/) is currently not. 

On GitHub
[we found](https://github.com/search?o=desc&q=%22com.bitbill.www%22&s=indexed&type=Code)
87 hits but only in localization, html, csv and reStructuredText which don't
look like the app itself but rather lists of apps.

So as we can't find any source code, we assume this app is closed source and
thus **not verifiable**.
