---
title: BitMake:trade Crypto,Bitcoin
verdict: custodial
meta: removed
date: 2024-04-03
authors:
- danny
website: https://www.bitmake.com#deadLink
twitter: BitMakeOfficial
social:
- https://www.linkedin.com/company/bitmakeofficial
- https://www.youtube.com/@BitMakeOfficial#deadLink
- https://discord.com/invite/7Bh7wpyGMk#deadLink
- https://www.instagram.com/bitmakeexchange
- https://www.facebook.com/BitMakeExchange
- https://t.me/BitMakeEN
redirect_from:
- /android/com.bitmake.app/
android:
  appId: com.bitmake.app
  users: 5000
  released: 2022-07-04
  updated: 2024-01-26
  version: 1.4.3
  icon: com.bitmake.app.png
  developerName: BITMAKE TECHNOLOGY LLC

---

## App Description from Google Play

> BUY OR SELL BITCOIN AND OTHER CRYPTO
>
> TRADE DERIVATIVES OF BITCOIN AND OTHER CRYPTO
>
> At BitMake, security is our highest priority when it comes to safeguarding customers' digital assets. Platform is supported with advanced security features like 2FA and more build-in technologies for your secured crypto investments. We use the best practices of industry to setup and operate the most secure cryptocurrency exchange for you.

## Analysis 

- This is a cryptocurrency exchange.
- There are many hallmarks that show this is a custodial provider, this can mostly be seen in the [terms](https://help.bitmake.com/hc/en-us/articles/4638528296847-Bitmake-Terms-of-Service#deadLink):
  - Right to suspend user accounts
  - Right to freeze transactions
  - Power to lock assets
  - Right to full custody of assets when user violates the terms
  - Right to control the user assets
- After registration, we found a P2SH BTC address. We were not provided with a mnemonic phrase. 
- We checked the settings to try and look for a method to back up the private keys, but found none.

Without explicitly stating the use of cold-wallets or separate offline wallet mechanisms, the app exercises a lot of controls. The absence of mechanisms to back up the private keys is the major indicator of a **custodial** provider, with a **non-verifiable** app.
