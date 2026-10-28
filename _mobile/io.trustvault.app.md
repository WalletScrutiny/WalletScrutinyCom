---
title: 'TrustVault: Crypto Wallet'
date: 2026-10-28
authors:
- leo
android:
  appId: io.trustvault.app
  users: 1000
  appCountry: us
  released: Aug 5, 2026
  updated: 2026-08-05
  version: 0.1.0
  icon: io.trustvault.app.webp
  meta: ok
  verdict: nosource
  developerName: Shawk Turn

---

## App Description

TrustVault: Crypto Wallet is a multi-chain wallet published on Google Play by a developer listed as "Shawk Turn", with a Gmail contact address and no website. The description lists Bitcoin (native SegWit), Ethereum and several EVM networks, plus USDT, USDC and DAI. It calls the app "fully open-source" and "non-custodial", with a BIP-39 recovery phrase generated and encrypted on the device. The [privacy policy](https://telegra.ph/TrustVault-Privacy-Policy-08-05) is a Telegraph post signed "TrustVault Open Source Project". It gives a third contact address and says the app uses "mempool.space's public API for Bitcoin". The listing calls the app "an early release".

## Analysis

- **Bitcoin support.** The description lists "Bitcoin (native SegWit — lower fees)" with QR codes for receiving and fee estimates for sending.
- **Custody.** The description says: "Your keys are generated on your device, encrypted on your device, and never leave your device", with a "12- or 24-word recovery phrase (BIP-39), compatible with all standard wallets". The privacy policy adds "We run no servers" and "we never take custody of funds". We could not verify these claims.
- **Source code.** The description says the app is "free software (GPL-3.0)" and invites users to "contribute on GitHub", but neither the listing nor the privacy policy links to a repository. A GitHub code search for `io.trustvault.app` found only [opnsrcntrbtr/TrustVault-PWA](https://github.com/opnsrcntrbtr/TrustVault-PWA). That repository uses the same ID in its Capacitor configuration, but it is an Apache-2.0 password manager ("zero-knowledge credential vault"), not a crypto wallet. Repository searches for "trustvault wallet", "trustvault bitcoin" and "trustvault crypto wallet" returned no GPL wallet of this name. Code searches for the developer's and the policy's contact addresses returned nothing relevant.
- **Name.** Two other listings use the TrustVault name and are not this app: [Trust Vault Crypto Web3 Wallet](/mobile/com.trustvault.wallet/) (`com.trustvault.wallet`, another developer, rated fake), and Bitpanda's BE Custody (`io.trustology.trustvault`), formerly TrustVault.

The app claims to be open source, but we could not find its source code, so a [reproducible build](/methodology/#nosource) cannot be attempted. If the developer publishes the repository, we will review it.

**No source for current release found**
