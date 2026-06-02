---
wsId: albyGo
title: Alby Go
date: 2025-09-09
authors:
- danny
website: https://getalby.com/
twitter: getAlby
social:
- https://phoenix.social/p/npub1getal6ykt05fsz5nqu4uld09nfj3y3qxmv8crys4aeut53unfvlqr80nfm
- https://www.youtube.com/@getalbycom
- https://discord.com/invite/5wG4Gr5Fxm
features:
- foss
- ln
- ownLN
redirect_from:
- /android/com.getalby.mobile/
- /iphone/com.getalby.mobile/
android:
  appId: com.getalby.mobile
  users: 5000
  appCountry: us
  released: 2024-09-16
  updated: 2026-01-22
  version: 2.0.1
  reviews: 19
  icon: com.getalby.mobile.png
  meta: ok
  verdict: sourceavailable
  developerName: Alby Inc.
  repository: https://github.com/getAlby/go
iphone:
  appId: com.getalby.mobile
  idd: '6471335774'
  appCountry: us
  released: 2024-09-18
  updated: 2026-01-22
  version: 2.0.1
  reviews: 23
  icon: com.getalby.mobile.jpg
  meta: ok
  verdict: sourceavailable
  developerName: Alby Inc.
  repository: https://github.com/getAlby/go

---

## Android

## App Description

Alby Go is a mobile interface application that connects to external Lightning Network wallets and nodes via the Nostr Wallet Connect (NWC) protocol. The app does not generate, store, or manage Bitcoin private keys locally on the device. Instead, it establishes secure communication channels with self-custodial Lightning wallets such as Alby Hub, Umbrel, Start9, or other NWC-compatible services. The application stores only NWC connection credentials in the device's secure storage to authenticate with external wallet services. Users initiate Lightning Network transactions through the app's interface, but the actual signing and execution occurs on the connected external wallet or node. The app supports standard Lightning operations including sending payments, receiving payments, and managing Lightning addresses through its connected services. All Bitcoin custody and key management responsibilities remain with the external wallet providers that users connect to via NWC.

## Analysis

Alby Go functions as a Bitcoin wallet interface that enables users to send and receive Lightning Network payments through connected external wallets. The app's architecture centers around the Nostr Wallet Connect protocol, storing only communication credentials needed to interface with external Lightning wallets rather than Bitcoin private keys directly. According to the source code, the app defines wallet connections through a `Wallet` type structure containing `nostrWalletConnectUrl`, `lightningAddress`, and `nwcCapabilities` fields, demonstrating its role as a wallet client. The secure storage implementation in `lib/secureStorage.ts` uses `expo-secure-store` to protect NWC connection secrets, which are 32-byte hex strings generated locally for Nostr protocol authentication via `generateSecretKey()` from the nostr-tools library. This architecture allows users to actively transact Bitcoin while maintaining the security benefits of external key management.

The application's dependency on external wallet services represents a distributed custody model where users maintain control through their chosen Lightning node operators. The NWC connection string follows the format `nostr+walletconnect://{pubkey}?secret={secretKey}&relay={relayUrl}`, where the secret parameter represents the locally generated communication key that enables encrypted transaction requests to external wallets. During testing, the app successfully connected to a NWC service provided by coinos.io rather than Alby's own hub, demonstrating its interoperability with various NWC-compatible providers and confirming its function as a genuine wallet interface. The app's security model isolates communication authentication from Bitcoin key management, with all cryptographic operations related to Bitcoin transactions occurring on the connected external wallet through secure, encrypted channels. This design enables users to maintain self-custody through their chosen external wallet while benefiting from Alby Go's streamlined mobile interface for Lightning payments.

The verdict of **sourceavailable** applies because Alby Go provides genuine wallet functionality with publicly available source code that can be audited and potentially reproduced. While the app implements an external key management model rather than local private key storage, it still qualifies as a Bitcoin wallet since users can independently send and receive Bitcoin payments through the interface. Users maintain meaningful control over their Bitcoin through their choice of external wallet provider and can migrate between different NWC-compatible services without losing access to their funds. The open-source nature of the codebase allows for security audits and build verification, meeting the criteria for source availability despite its distributed architecture that separates the user interface from key custody responsibilities.

{% include featureEvidence.html feature="ln" quote="A simple lightning mobile wallet interface that works great with Alby Hub or any other NWC wallet service." source="GitHub README" %}

{% include featureEvidence.html feature="foss" quote="MIT License Copyright (c) 2024 Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the &quot;Software&quot;), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software..." source="GitHub README" %}

{% include featureEvidence.html feature="ownLN" quote="it establishes secure communication channels with self-custodial Lightning wallets such as Alby Hub, Umbrel, Start9, or other NWC-compatible services" source="App Description" %}

---

## iPhone

{% include copyFromAndroid.html %}

{% include featureEvidence.html feature="ln" quote="Instant, low-cost, global payments – sent directly from your phone in a self-custodial way." source="Store" %}

{% include featureEvidence.html feature="ownLN" quote="Connect Alby Hub and other lightning nodes like Umbrel or Start9." source="Store" %}
