---
wsId: revolutX
title: 'Revolut X: Buy Bitcoin, Crypto'
altTitle: 
authors:
- danny 
users: 100000
appId: com.revolut.revolutx
appCountry: 
updated: 2025-05-13
version: '1.8'
stars: 
ratings: 
reviews: 
website: https://www.revolut.com/revolut-x/
repository: https://github.com/orgs/revolut-engineering/repositories
issue: 
icon: com.revolut.revolutx.png
bugbounty: 
meta: ok
verdict: custodial
appHashes: 
date: 2025-05-19
signer: 
twitter: RevolutApp
social:
- https://www.linkedin.com/company/revolut
- https://www.tiktok.com/@revolutapp
- https://www.instagram.com/revolutapp
- https://www.facebook.com/revolutapp 
redirect_from: 
developerName: Revolut Ltd
features: 

---

Revolut X [supports Bitcoin (BTC) deposits and withdrawals](https://help.revolut.com/help/wealth/cryptocurrencies/transferring-cryptocurrencies/withdrawing-cryptocurrencies/how-do-i-send-crypto-to-an-external-wallet) via the Bitcoin blockchain. This functionality is accessible to verified users, though still managed under a custodial framework. 

**Open Source Status**\
Revolut X is not open source. While Revolut maintains a GitHub presence [(revolut-engineering and revolut-mobile)](https://github.com/orgs/revolut-engineering/repositories), these repositories do not include the source code for the Revolut X app itself. This lack of open-source code prevents independent verification of the app's functionality and security.

**Reproducible Builds**\
There is no evidence that Revolut X supports reproducible builds. Without access to the source code and build processes, it's impossible to confirm that the distributed APK matches the source code, a key aspect of WalletScrutiny's reproducibility requirement.

**App Distribution and Platform Restrictions**\
Revolut X is available exclusively through the Google Play Store. Notably, the app has been [reported to block](https://community.e.foundation/t/sorry-revolut-is-not-supported-on-devices-with-custom-firmware/63282/91?page=5) usage on devices running custom firmware like GrapheneOS and /e/OS by checking specific system properties, such as `ro.build.user` and `ro.build.host`, and denying access if these indicate a non-standard environment . This behavior suggests a reliance on Google's Play Integrity API or similar mechanisms, which can hinder user freedom and transparency.


🔐 **Custodial Nature**

Revolut X operates as a **custodial** platform. Users do not have direct access to their private keys. While the app allows for crypto withdrawals to external wallets, the custody model inherently requires a high level of trust in the platform's security and operational integrity.
