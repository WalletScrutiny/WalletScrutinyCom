---
title: Crypto & Bitcoin Wallet Paybis
date: 2026-07-24
website: https://paybis.com/contacts/
appCountry: us
redirect_from:
- /android/com.paybis/
- /iphone/com.paybis/
android:
  appId: com.paybis
  users: 500000
  appCountry: us
  released: 2021-09-06
  updated: 2025-10-07
  version: 1.6.20
  reviews: 400
  icon: com.paybis.png
  meta: ok
  verdict: custodial
  developerName: PAYBIS
iphone:
  appId: com.paybis
  idd: '1584641245'
  appCountry: us
  released: 2021-09-20
  updated: 2026-08-13
  version: 1.7.32
  reviews: 2853
  icon: com.paybis.jpg
  meta: ok
  verdict: custodial
  developerName: Paybis LTD

---

## App Description

Paybis is a cryptocurrency exchange and wallet app published by Paybis LTD, distributed on iOS and Android under the same identifier `com.paybis`. Its store listings describe buying, selling and storing more than 100 cryptocurrencies — among them Bitcoin, Ethereum, USDT, XRP and Litecoin — in over 180 countries, with credit card, debit card and bank transfer among the supported payment methods. The listings describe a "built-in digital wallet" and state that it lets users "securely store, manage, and have full control over their cryptocurrencies". Paybis says the service operates under AML/KYC compliance.

## Testing and Analysis

We did not test the app hands-on. This assessment rests on Paybis's own documentation, retrieved 2026-07-24.

**Paybis states that its wallet is custodial.** Its [wallets FAQ](https://support.paybis.com/hc/en-us/articles/5447694691485-Paybis-wallets-FAQ) answers the question directly:

> No, Paybis offers custodial wallets.

> Paybis secures the private keys and assets on your behalf using enterprise-grade security.

> You do not manage a seed phrase.

The [Bitcoin wallet page](https://paybis.com/bitcoin-wallet/) uses the same word in its own heading — *"A custodial Bitcoin-compatible wallet with on-chain verification"* — and the support article [Custodial Wallets and their risks](https://support.paybis.com/hc/en-us/articles/14723140701853-Custodial-Wallets-and-their-risks) spells out the consequence: *"You rely on the provider's solvency and integrity. If the custodian faces financial difficulties or engages in fraud, your assets may be at risk."* Paybis says it mitigates this by segregating *"customer assets ... into dedicated addresses"*, which changes where the coins sit but not who signs for them.

**This is not a buy-only forwarding service.** Purchases can be delivered to an address the user controls, but that is one option of two: *"There are two choices: Your Paybis wallet or an external wallet."* Because coins may instead remain with Paybis, the app does not qualify as `nowallet`, which WalletScrutiny reserves for apps where you can buy Bitcoin *"but only into another wallet"*.

**Access to funds is conditional.** Paybis's [Terms and Conditions](https://support.paybis.com/hc/en-us/articles/33357560172957-Terms-and-Conditions) state it *"may freeze or restrict access to your assets"* to *"comply with legal obligations, sanctions, AML/CTF requirements, or where fraudulent or suspicious activity is detected"*, and its [US Terms of Service](https://paybis.com/policies/terms-of-service-us/) that *"any Order, transaction, deposit, or withdrawal may be subject to review, delay, suspension, or freezing."* Identity verification is mandatory — *"we are legally prohibited from providing Services to unverified users"* — and the service is unavailable in sanctioned or high-risk jurisdictions.

**The store listings overstate user control.** Both describe the built-in wallet as letting users *"securely store, manage, and have full control over their cryptocurrencies"*, while Paybis's own help centre says Paybis holds the private keys and the user manages no seed phrase. A reader who saw only the store page would be misled about who controls the coins.

**Verdict: custodial.** Paybis holds the keys to any balance kept in a Paybis wallet, so those users do not control their funds and depend on the provider's solvency, policies and compliance decisions. Custody rests with the provider, so the review ends here: there is no user-held key material to audit, and source availability and reproducibility do not arise. Coins bought and sent straight to an external address are outside this verdict — once they land in a wallet the user controls, that wallet's own review applies.
