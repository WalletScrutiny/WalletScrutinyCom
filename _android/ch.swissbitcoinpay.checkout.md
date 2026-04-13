---
wsId: swissBitcoinPay
title: Swiss Bitcoin Pay
altTitle: 
authors:
- danny
- keraliss
users: 1000
appId: ch.swissbitcoinpay.checkout
appCountry: 
released: 2022-11-15
updated: 2025-10-29
version: 2.6.5
reviews: 3
website: https://swiss-bitcoin-pay.ch
repository: https://github.com/SwissBitcoinPay/app
icon: ch.swissbitcoinpay.checkout.png
bugbounty: 
meta: ok
verdict: sourceavailable
appHashes:
- 4c027a43cc9fddff3fe15d55ff32a083c761ecfb9c84a3326384cb863455282d
- 24f70d0f31812cf8012b933d2836e8c6b222e276595164a3d773926fe468c56c
- e9510b07234d4ff047684745e48250f02fb298117136ed6624ed2ef93d21dc65
date: 2025-02-06
signer: 17d9c0bf025008da16d5a146e1beaca6ddcfe3cb0cf063da23c847d3007eb621
twitter: SwissBitcoinPay
social:
- https://www.linkedin.com/company/swiss-bitcoin-pay
- https://www.youtube.com/@swissbitcoinpay
redirect_from: 
developerName: Swiss Bitcoin Pay
builds: 
features:
- nfc
- foss
- ln

---

{% include featureEvidence.html feature="nfc" source="[README](https://github.com/SwissBitcoinPay/app#readme)" quote="BoltCard support" %}

*Legacy verification [here](https://gitlab.com/walletscrutiny/walletScrutinyCom/-/blob/97657556fba10b8ce60e568af1e2729166ad419b/_android/ch.swissbitcoinpay.checkout.md)*

## Swiss Bitcoin Pay – Technical Overview

Swiss Bitcoin Pay is a non-custodial point-of-sale application designed to accept Bitcoin payments across web, iOS, and Android platforms. Built using React, React Native, and React Native Web, the app prioritizes simplicity, requiring no KYC and allowing account creation in under a minute. It supports automatic daily withdrawals to user-controlled wallets and includes partial or full fiat conversion. Additional features include support for BoltCards, multi-currency compatibility, and management of multiple employee accounts. The app supports various languages including English, French, German, Italian, Spanish, Portuguese, and Finnish.

The project is open source under the MIT License and is structured for cross-platform development. Web builds are launched with `npm start` and accessed via `https://localhost:7474`, while mobile builds require `npm run mobile-start` followed by platform-specific commands (`npm run ios` or `npm run android`). The codebase is primarily written in TypeScript (91%) and integrates with external services like Crowdin for translations. Contributions are welcomed, particularly in areas such as UI simplification, testing, and security. The repository includes over 50 releases, with active maintenance by a small contributor base.

{% include featureEvidence.html feature="foss" quote="MIT License Copyright (c) 2023 Swiss Bitcoin Pay Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the &quot;Software&quot;), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software" source="GitHub README" %}

An issue has been opened at [https://github.com/SwissBitcoinPay/app/issues/53](https://github.com/SwissBitcoinPay/app/issues/53)
