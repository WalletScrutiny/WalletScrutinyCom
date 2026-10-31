---
title: Wirex One
date: 2026-10-31
authors:
- leo
website: https://www.wirexapp.com/
android:
  appId: com.wirexapp.one
  users: 50000
  appCountry: us
  released: Apr 27, 2026
  updated: 2026-10-29
  version: 10.0.0
  reviews: 6
  icon: com.wirexapp.one.webp
  meta: ok
  verdict: custodial
  developerName: Wirex
iphone:
  appId: com.wirexapp.one
  idd: '6762381032'
  appCountry: us
  released: '2026-06-16T07:00:00Z'
  updated: 2026-10-29
  version: '10.0'
  reviews: 15
  icon: com.wirexapp.one.webp
  meta: ok
  verdict: custodial
  developerName: Wirex Limited

---

## App Description

Wirex One is Wirex's new app, launched in 2026, combining a Visa card with cashback, fiat accounts in USD, EUR and GBP, crypto trading, "Earn" yield and crypto-backed loans. Wirex calls it self-custodial. The Play description says: "Your assets are held in non-custodial wallets — Wirex never holds or controls your funds. Built on Circle Arc blockchain through our partnership with Circle, with wallet security powered by Privy." It also says: "No seed phrases. No wallet addresses. Just tap and pay."

Wirex One replaces the main Wirex app, {% include walletLink.html wallet='android/com.wirex' verdict='true' %}. The help article [Upgrade to Wirex One](https://wirexone.freshdesk.com/support/solutions/articles/76000088360-upgrade-to-wirex-one-what-to-expect) says that after the upgrade "the Wirex app becomes a read-only view of your past activity, while Wirex One becomes your main account going forward", and that "old Wirex app deposit addresses are no longer valid". An earlier Wirex wallet app ID is listed as {% include walletLink.html wallet='android/com.wirex.wallet' verdict='true' %}.

## Analysis

- **Bitcoin support.** Wirex One supports "around 70 assets", and the help pages show BTC in buy and sell rates ("1 BTC : 70,000 USD") and among the [Earn](https://wirexone.freshdesk.com/support/solutions/articles/76000088184-how-to-start-earning-) currencies. The help pages do not say whether BTC is held on the Bitcoin network or as a token on another chain. The [terms](https://www.wirexapp.com/en-gb/legal/one/terms) describe the wallet as "a non-custodial smart contract account" and mention "wrapped, bridged, synthetic or derivative representations of digital assets".
- **Sending and receiving.** The help center explains how to [receive crypto](https://wirexone.freshdesk.com/support/solutions/articles/76000088117-how-to-receive-crypto) ("Select the token you want to receive... Select the network. Your wallet address is displayed") and how to [send it](https://wirexone.freshdesk.com/support/solutions/articles/76000088138-how-to-withdraw-crypto) to "an external wallet or exchange".
- **Custody.** The keys are not in the app. According to the [Wallets, Keys & Passkeys FAQ](https://wirexone.freshdesk.com/support/solutions/articles/76000088551-wallets-keys-passkeys-faq), the key is generated inside Privy's server-side enclave ("Privy uses AWS Nitro Enclaves") and split into "one tied to your login (your authenticated session), and one protected inside the secure enclave", plus a recovery share. When the user sends funds, "your key is reconstructed in isolated memory" inside that enclave "just long enough to sign the transaction". The user only proves a login with an email and a passkey. Privy's servers hold the key material and do the signing. The terms confirm: "Your Self-Custodial Wallet private keys and cryptographic credentials are generated and managed by Privy Technologies, Inc." Wirex and Privy say neither of them can access the keys. That is a promise about how their servers are run, which users cannot check. The FAQ says the key can be exported, but export also goes through Privy, and "Applications can optionally require a 2-of-2 authorisation quorum to gate export; Wirex One's policy is communicated in-app."
- **Source code.** Wirex's GitHub organization, [wirexapp](https://github.com/wirexapp), has only forks of third-party iOS libraries, a utilities repository last updated in 2021, and agent skills for its banking API. There is no Wirex One app code.

We rate apps built on Privy's embedded wallets the same way, for example {% include walletLink.html wallet='android/com.useguap.android.rn' verdict='true' %}. The key is created, stored in shares, and used for signing on Privy's servers, and the user holds no complete key or seed. However the shares are split, a third party holds the keys, so this app is {% include verdictBadge.html verdict="custodial" type='short' %}.

**Custodial: The provider holds the keys**
