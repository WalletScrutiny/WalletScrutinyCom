---
wsId: 
title: 2FA (BitBox01)
altTitle: 
authors:
- danny
users: 1000
appId: com.digitalbitbox.tfa
appCountry: 
released: 2016-01-24
updated: 2019-10-17
version: 3.0.5
stars: 
ratings: 
reviews: 
website: https://shiftcrypto.ch/bitbox01/
repository: 
issue: 
icon: com.digitalbitbox.tfa.png
bugbounty: 
meta: obsolete
verdict: nowallet
appHashes: 
date: 2023-05-23
signer: 
twitter: 
social: 
redirect_from: 
developerName: BitBox Swiss
features: 

---

## App Description from Google Play

This app needs the {% include walletLink.html wallet='hardware/bitbox01' verdict='true' %} in order to work. It is not an official app.

> NOTE: This app is NOT used by the BitBox02 hardware wallet, which has its own onboard screen.
>
> This app works only with the now discontinued BitBox01 device.
Check out the website for more details: https://shiftcrypto.ch/bitbox01/.
>
> This app allows using a mobile phone as a large screen for securely verifying transactions and receiving addresses created by the Digital Bitbox (BitBox01) hardware wallet.
>
> The code is open source and available here: https://github.com/BitBoxSwiss/2FA-app. 

## Analysis 

- We installed the app on a BlueStacks 5 Android Nougat virtual device.

As the Google Play description describes, the app is dependent on a legacy {% include walletLink.html wallet='hardware/bitbox01' verdict='false' %}. Without it, the app won't run. 

- It only shows the following text:

> First, click on the 'Connect Mobile App' button in the desktop app's Options tab. 
>
> Then scan that QR code here.

This app is **not a wallet**.
