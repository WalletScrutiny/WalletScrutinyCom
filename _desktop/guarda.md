---
title: Guarda
appId: guarda
authors:
- danny
released: 2021-05-01
discontinued: 
updated: 2021-08-13
version: 1.0.20
binaries: 
provider: Guardaco LDA
providerWebsite: 
website: https://guarda.com
repository: https://github.com/guardaco/guarda-desktop-releases
issue: 
icon: guarda.png
bugbounty: 
meta: obsolete
verdict: nosource
date: 2024-04-25
twitter: GuardaWallet
social: 
features: 

---

## Related to:

- {% include walletLink.html wallet='android/com.crypto.multiwallet' verdict='true' %}

- {% include walletLink.html wallet='iphone/com.crypto.multiwallet' verdict='true' %}

## App Description

> Guarda Wallet is a cross-platform, non-custodial cryptocurrency wallet that supports Bitcoin and hundreds of other assets. It offers desktop apps for Windows, macOS, and Linux,

App initialization begins with creating a password which encrypts the private keys. We found a BTC wallet, and an option to download the backup. Strangely the backup is a text file which is comprised of 9944 characters.

Initially we thought this app was source available since they had a GitHub repository with releases and files. Upon closer inspection, we downloaded the release source zip file and extracted it. We found nothing. Despite having 94 repositories for their GitHub organization page, the [empty desktop release src archive](https://github.com/guardaco/guarda-desktop-releases/archive/refs/tags/v1.0.20.zip) is definitely **not source-available**.

