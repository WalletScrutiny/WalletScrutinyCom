---
title: 'Blockrise: secure your bitcoin'
date: 2026-11-05
authors:
- leo
website: https://www.blockrise.com
twitter: blockrise
social:
- https://www.linkedin.com/company/blockrise
android:
  appId: com.blockrise
  users: 100
  appCountry: us
  updated: 2026-10-29
  version: 2.8.0
  icon: com.blockrise.webp
  meta: fewusers
  verdict: custodial
  developerName: Blockrise Capital B.V.
iphone:
  appId: com.blockrise.blockrise
  idd: '6443781307'
  appCountry: nl
  released: '2023-04-20T07:00:00Z'
  updated: 2026-10-29
  version: 2.8.0
  reviews: 10
  icon: com.blockrise.blockrise.webp
  meta: ok
  verdict: custodial
  developerName: Blockrise Capital B.V

---

## App Description

Blockrise Capital B.V. is a bitcoin-only broker and custodian in Rotterdam. It holds a MiCAR licence (number 41000029) from the Dutch Authority for the Financial Markets (AFM). The app is a companion to an account that has to be opened on the website: it buys and sells bitcoin against euros, shows balances and approves transactions. The provider calls its model "semi-custodial": "You hold a key. Blockrise holds the vault."

## Analysis

- **Bitcoin support.** Blockrise only supports bitcoin. Clients can [deposit bitcoin](https://support.blockrise.com/how-to-deposit-bitcoin-in-your-account) and withdraw it.
- **Withdrawals need approval.** Bitcoin can only go to an address Blockrise has [whitelisted](https://support.blockrise.com/how-to-verify-an-external-wallet-address). Whitelisting means a 15-minute video call with an ID document, where the client shows they control the address. The same page calls the company "a MiCAR-regulated Bitcoin custodian".
- **Custody.** The private key that controls the bitcoin is created in Blockrise's HSMs and never leaves them. The client holds no part of it. Their 24-word "Blockrise Seed" is, in [Blockrise's words](https://support.blockrise.com/what-is-the-blockrise-seed), "a separate authorisation credential: a transaction is only signed by the HSM when the correct Blockrise Seed is presented." Blockrise [describes](https://support.blockrise.com/what-are-hardware-security-modules-hsms) the seed as "a password for clients to access their private key on the HSM".
- **The provider can replace the seed.** With the optional, free [Back-up](https://support.blockrise.com/blockrise-back-up), support checks the client's identity and then "Blockrise will use the back-up key to replace your old Seed with your new seed". So Blockrise can hand the account to whoever passes that check.
- **No exit without the provider.** The seed doesn't restore a wallet in any other software. If Blockrise is offline, closes, or refuses to sign, the client can't move their bitcoin.

The seed protects the account well, but it is a password, not a key. Like {% include walletLink.html wallet='iphone/io.trustology.trustvault' verdict='true' %}, which also keeps the keys in its own HSM cluster and lets the device only authorise, Blockrise holds the keys. The app is {% include verdictBadge.html verdict="custodial" type='short' %}.

## iPhone

The iOS app comes from the same provider, Blockrise Capital B.V., and gives access to the same account, so the verdict above applies to it too.
