---
title: Verus Wallet
appId: veruswallet
authors:
- danny
released: 2019-12-16
discontinued: 
updated: 2026-04-13
version: 1.2.16
binaries: 
provider: 
providerWebsite: 
website: https://verus.io
repository: https://github.com/VerusCoin/Verus-Desktop
icon: veruswallet.png
bugbounty: 
meta: ok
verdict: sourceavailable
date: 2025-09-25
twitter: veruscoin
social: 
builds: 
features:
- foss

---

## Related to

- {% include walletLink.html wallet='android/org.autonomoussoftwarefoundation.verusmobile.android' verdict='true' %}
- {% include walletLink.html wallet='iphone/org.autonomoussoftwarefoundation.verusmobile.ios' verdict='true' %}

## App Description

Verus Wallet is a multi-coin, open-source desktop wallet developed by the Verus Coin project. It is part of the broader Verus ecosystem and provides a GUI interface for interacting with Verus and other supported blockchains.

The desktop wallet is built using Electron and React, with features that include cross-platform compatibility and integration with native binaries. It supports a BTC wallet, with a lite mode (24-word seed) and a native mode (downloads the BTC blockchain). It also allows the user to generate or import an existing seedphrase or WIF key. Once the seed phrase is generated or imported, the user has the option on whether or not to use this for the main profile. Then it would be possible to send/receive BTC.

It is self-custodial, source-available and subject **for verification**

{% include featureEvidence.html feature="foss" quote="Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the &quot;Software&quot;), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:" source="GitHub README" %}