---
wsId: swissBitcoinPay
title: Swiss Bitcoin Pay
date: 2026-07-21
authors:
- danny
- keraliss
website: https://swiss-bitcoin-pay.ch
twitter: SwissBitcoinPay
social:
- https://www.linkedin.com/company/swiss-bitcoin-pay
- https://www.youtube.com/@swissbitcoinpay
features:
- nfc
- foss
- ln
redirect_from:
- /android/ch.swissbitcoinpay.checkout/
- /iphone/ch.swissbitcoinpay.checkout/
android:
  appId: ch.swissbitcoinpay.checkout
  users: 1000
  appCountry: us
  released: 2022-11-15
  updated: 2026-09-24
  version: 2.7.3
  reviews: 3
  icon: ch.swissbitcoinpay.checkout.webp
  signer: 17d9c0bf025008da16d5a146e1beaca6ddcfe3cb0cf063da23c847d3007eb621
  alternativeStores:
  - fdroid
  - zapstore
  meta: ok
  verdict: sourceavailable
  developerName: Swiss Bitcoin Pay
  repository: https://github.com/SwissBitcoinPay/app
iphone:
  appId: ch.swissbitcoinpay.checkout
  idd: '6444370155'
  appCountry: us
  released: 2022-11-19
  updated: 2026-09-25
  version: 2.7.3
  reviews: 1
  icon: ch.swissbitcoinpay.checkout.webp
  meta: ok
  verdict: sourceavailable
  developerName: Swiss Bitcoin Pay Sarl
  repository: https://github.com/SwissBitcoinPay/app

---

{% include review/externalResearchAlert.html url="https://kek.lol/research/appstore-wallets/#app-6444370155" author="overtorment" severity="critical" finding="Wallet login POSTs the twelve words to /auth. Public GitHub does the same. The UI says the seed never leaves." note="overtorment's research page is dated 2026-09-06; he announced it on X on 2026-09-12 at 11:43 UTC. The developers removed the recovery phrase from the login request in version 2.6.6, committed the same day at 18:33 UTC. Releases 2.5.16 to 2.6.5 are affected. See the timeline below." %}

## Update 2026-09-15: recovery phrase sent at login, fix, and breach announcement

All times are UTC. Every entry links to its source.

### Timeline

- **2025-07-19 10:56** – Commit [`dee8dd3`](https://github.com/SwissBitcoinPay/app/commit/dee8dd3dbd68ba618f364714384c45ec7d781fc3) ("Encrypt with password") adds the wallet's recovery phrase (`words`) to the login request that the app sends to `https://api.swiss-bitcoin-pay.ch/auth`:

  ```ts
  const signatureLoginData = {
    messageToSign: message,
    signature,
    zPub,
    words
  };
  ```

  Before this commit the same request carried only `messageToSign` and `signature`, and the phrase was only stored on the device.
- **2025-07-19 13:20** – [Release v2.5.16](https://github.com/SwissBitcoinPay/app/releases/tag/v2.5.16) is the first GitHub release that contains this commit. Every release up to and including v2.6.5 (2025-10-29) contains it.
- **2026-09-06** – Date on overtorment's [research page](https://kek.lol/research/appstore-wallets/#app-6444370155). He analysed the App Store build of version 2.6.4 and reports: "Wallet login POSTs the twelve words to /auth. Public GitHub does the same. The UI says the seed never leaves."
- **2026-09-12 11:43** – overtorment announces the research [on X](https://x.com/overtorment/status/2098739225105453192).
- **2026-09-12 18:33** – Commit [`1a23cb2`](https://github.com/SwissBitcoinPay/app/commit/1a23cb2e811f584639bdfe01d78765705bdc2398), titled "minor security fix", removes `words` from the login request and raises the version from 2.6.5 to 2.6.6. Apart from the version number and a build-pipeline file (`codemagic.yaml`), it is the only change between v2.6.5 and v2.6.6:

  ```diff
         const signatureLoginData = {
           messageToSign: message,
           signature,
  -        zPub,
  -        words
  +        zPub
         };
  ```

- **2026-09-12 19:08** – [Release v2.6.6](https://github.com/SwissBitcoinPay/app/releases/tag/v2.6.6) is published on GitHub. Google Play shows the update at 19:16 and the App Store at 2026-09-13 00:41. The release notes in both stores read "Minor security fix" and do not mention the recovery phrase.
- **2026-09-14 12:20** – Swiss Bitcoin Pay [announces on X](https://x.com/SwissBitcoinPay/status/2099473448162488618):

  > A malicious user has likely gained access to Swiss Bitcoin Pay’s internal systems. As a precaution, we are temporarily shutting down our servers while we investigate and secure our infrastructure.
  >
  > At this stage, we believe they may have accessed customer email addresses, Bitcoin addresses and IBANs, transaction history, and hashed passwords. It is not yet clear whether any other information was accessed.
  >
  > User funds are safe, and any amounts owed to users will be fully returned.

### Who is affected

We checked this in the public source of v2.6.5. The recovery phrase goes into the login request on the **"Signature with 12 words"** login screen, where a merchant logs in by typing the 12 words of their wallet. That screen tells the user:

> Your 12 words will stay on your device, to sign a message to authenticate you.

In the same source we found no other request that carries the phrase:

- Logging in with a hardware wallet, or with email and password, does not send a recovery phrase.
- When a wallet is created in the app, the phrase is stored on the device. That flow tells the user the phrase "is never sent to our servers". The sign-up request does not contain it.
- The address verification request (`/verify-signature`) receives only the message and signature.

We did not check each intermediate release between v2.5.16 and v2.6.5 for other paths.

### What is not known

- The server code is not public, so we cannot tell whether the server stored or logged the phrases it received between v2.5.16 and v2.6.5.
- The breach announcement lists what may have been accessed and does not mention recovery phrases.

If you logged in with "Signature with 12 words" on any version from 2.5.16 to 2.6.5, the app sent your recovery phrase to Swiss Bitcoin Pay's server. Moving the funds to a new wallet with a new recovery phrase removes that exposure.

The verdict remains **source-available**: the app's source code is public, and that code includes both the flaw and the fix.

## Android

{% include featureEvidence.html feature="nfc" source="[README](https://github.com/SwissBitcoinPay/app#readme)" quote="BoltCard support" %}

*Legacy verification [here](https://gitlab.com/walletscrutiny/walletScrutinyCom/-/blob/97657556fba10b8ce60e568af1e2729166ad419b/_android/ch.swissbitcoinpay.checkout.md)*

## Swiss Bitcoin Pay – Technical Overview

Swiss Bitcoin Pay is a non-custodial point-of-sale application designed to accept Bitcoin payments across web, iOS, and Android platforms. Built using React, React Native, and React Native Web, the app prioritizes simplicity, requiring no KYC and allowing account creation in under a minute. It supports automatic daily withdrawals to user-controlled wallets and includes partial or full fiat conversion. Additional features include support for BoltCards, multi-currency compatibility, and management of multiple employee accounts. The app supports various languages including English, French, German, Italian, Spanish, Portuguese, and Finnish.

The project is open source under the MIT License and is structured for cross-platform development. Web builds are launched with `npm start` and accessed via `https://localhost:7474`, while mobile builds require `npm run mobile-start` followed by platform-specific commands (`npm run ios` or `npm run android`). The codebase is primarily written in TypeScript (91%) and integrates with external services like Crowdin for translations. Contributions are welcomed, particularly in areas such as UI simplification, testing, and security. The repository includes over 50 releases, with active maintenance by a small contributor base.

{% include featureEvidence.html feature="foss" quote="MIT License Copyright (c) 2023 Swiss Bitcoin Pay Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the &quot;Software&quot;), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software" source="GitHub README" %}

An issue has been opened at [https://github.com/SwissBitcoinPay/app/issues/53](https://github.com/SwissBitcoinPay/app/issues/53)
