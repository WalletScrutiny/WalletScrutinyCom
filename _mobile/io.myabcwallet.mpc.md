---
wsId: abcwalletSafeWeb3Wallet
title: ABC Wallet - Safe Web3 wallet
verdict: custodial
meta: ok
date: 2025-12-27
authors:
- danny
website: https://myabcwallet.io
twitter: AhnLab_ABC
social:
- https://www.facebook.com/abcwallet2022
- https://www.youtube.com/@AhnLabBlockchainCompany
redirect_from:
- /android/io.myabcwallet.mpc/
- /iphone/io.myabcwallet.mpc/
android:
  appId: io.myabcwallet.mpc
  users: 10000
  released: 2022-12-22
  updated: 2026-03-27
  version: 2.10.5
  icon: io.myabcwallet.mpc.png
  developerName: AhnLab Blockchain Company, INC.
iphone:
  appId: io.myabcwallet.mpc
  idd: '1642837445'
  appCountry: us
  released: 2023-01-05
  updated: 2026-03-28
  version: 2.9.8
  reviews: 1
  icon: io.myabcwallet.mpc.jpg
  developerName: AhnLab Blockchain Company, INC.

---

## Android

## App Description

ABC Wallet is a multi-chain cryptocurrency wallet that supports assets including Bitcoin, Ethereum, Kaia, Aptos, Polygon, and other networks listed by the vendor. It advertises an MPC-based self-custody design with features such as social login, simple recovery, and biometric signing. The app also promotes built-in security functions like suspicious transaction detection, risky-site warnings, and device threat checks.

## Testing and Analysis

⚠️ During app initialization we were asked to install a Korean language app (com.ahnlab.v3mobileplus). 

This app [required several other app permissions](https://x.com/BitcoinWalletz/status/2004860911002202312/photo/3) detailed as follows: 

- All files access
- App notification
- Camera
- Phone
- Contacts
- Usage Access
- Display over other apps

It then [required us](https://x.com/BitcoinWalletz/status/2004860911002202312/photo/4) to agree to:  
- Terms of Use
- Security Notifications (Optional)
- Events and Promotions (Optional)
- Collection and Use of Personal Information (Optional)
- Provision of Personal Information to Third Parties (Optional)

After accepting all of these, the ABC Wallet app then [asked us to agree](https://x.com/BitcoinWalletz/status/2004861448577790445/photo/1) to the following:

- 14 years of age
- Terms of Use
- Collection and Use of Personal Information
- Provision of Personal Information to Third Parties
- Marketing Utilization and advertising information

Only then were we [able to access a Bitcoin wallet](https://x.com/BitcoinWalletz/status/2004861448577790445/photo/4). We did not find any option to give us the seed-phrases. 

**This app is custodial**.

---

## iPhone

{% include copyFromAndroid.html %}
