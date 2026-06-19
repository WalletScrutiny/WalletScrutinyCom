---
wsId: bitpaywallet
title: 'BitPay: Buy BTC ETH & Solana'
date: 2023-03-13
authors:
- leo
- danny
- emanuel
- keraliss
website: https://bitpay.com
twitter: BitPay
social:
- https://www.linkedin.com/company/bitpay-inc-
- https://www.facebook.com/BitPayOfficial
features:
- foss
- ln
redirect_from:
- /bitpay/
- /com.bitpay.wallet/
- /posts/2019/11/bitpay/
- /posts/com.bitpay.wallet/
- /android/com.bitpay.wallet/
- /iphone/com.bitpay.wallet/
android:
  appId: com.bitpay.wallet
  users: 1000000
  appCountry: us
  released: 2016-10-01
  updated: 2026-06-04
  version: 14.43.2
  reviews: 2308
  icon: com.bitpay.wallet.png
  meta: ok
  verdict: sourceavailable
  developerName: BitPay, Inc.
  repository: https://github.com/bitpay/bitpay-app
  bugbounty: https://support.bitpay.com/hc/en-us/articles/204229369-Does-BitPay-have-a-bug-bounty-program-
iphone:
  appId: com.bitpay.wallet
  idd: 1149581638
  appCountry: us
  released: 2016-10-24
  updated: 2026-06-10
  version: 14.43.3
  reviews: 3567
  icon: com.bitpay.wallet.jpg
  meta: ok
  verdict: wip
  developerName: BitPay, Inc.
  repository: https://github.com/bitpay/bitpay-app

---

## Android

*Legacy verification [here](https://gitlab.com/walletscrutiny/walletScrutinyCom/-/blob/4858b0b76e8e8e7fe6c60e2e3af81360a79bed91/_android/com.bitpay.wallet.md)*

BitPay App v2 is a mobile wallet for managing Bitcoin and other cryptocurrencies on both Android and iOS. It allows users to send, receive, and securely store digital assets, with support for deep linking, custom network configurations, and built-in exchange features. The app is built using React Native and relies on Redux for state management. Developers can run it locally with platform-specific tools and test components using Storybook. Configuration options include support for custom URI schemes, secure communication with local servers, and debugging through React Native Debugger.

* * * 

Copay has a
[Bug Bounty Program](https://support.bitpay.com/hc/en-us/articles/204229369-Does-BitPay-have-a-bug-bounty-program-).

{% include featureEvidence.html feature="foss" quote="The MIT License (MIT) Copyright (c) 2014-2023 BitPay, Inc. Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the &quot;Software&quot;), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software" source="GitHub README" %}

{% include featureEvidence.html feature="ln" comment="(no justification provided by LLM)" %}

An issue has been opened at [https://github.com/bitpay/bitpay-app/issues/1431](https://github.com/bitpay/bitpay-app/issues/1431)

---

## iPhone

{% include copyFromAndroid.html %}

An issue has been opened at [https://github.com/bitpay/bitpay-app/issues/686](https://github.com/bitpay/bitpay-app/issues/686)
