---
title: 'Plaxswap: Crypto & USDT Wallet'
date: 2026-11-17
website: https://plaxswap.com/wallet
twitter: plaxswap_com
social:
- https://x.com/plaxswap_com
android:
  appId: com.plaxswap.wallet
  users: 1
  appCountry: us
  updated: 2026-11-12
  version: 2.1.12
  meta: fewusers
  verdict: nosource
  developerName: SAMZAL LLC

---

**⚠️ Warning:** This is a very new project with almost no track record. The plaxswap.com domain was registered on 2026-10-15, the Play listing shows "1+" downloads and no ratings, and the provider's [GitHub organization](https://github.com/plaxswap-com) was created on 2026-11-09. Google Play names the developer as SAMZAL LLC at 421 W Broadway Ste 302, Council Bluffs, Iowa. Many unrelated small companies are [registered at that address](https://opencorpdata.com/us-ia/760761), which belongs to a registered-agent service. The phone number in the same Play listing is Indian (+91). The [about page](https://plaxswap.com/about) points out that plaxswap.io, a DEX with a PLAX token, is a different project with a similar name. The wallet is closed source, so its self-custody claim cannot be checked.

## App Description

Plaxswap Wallet is the wallet of Plaxswap, which also runs a swap service, a payment gateway and payment links. The Play description calls it "a self-custody crypto wallet for Bitcoin, USDT and 370+ coins" and says "your recovery phrase and private keys are created and stored only on your device". According to the [wallet page](https://plaxswap.com/crypto-wallet), it sends on 12 networks, including Bitcoin, Ethereum and other EVM chains, Solana, Tron, XRP Ledger, Litecoin and Dogecoin. In-app swaps go through third-party routes (KyberSwap, LI.FI, NEAR Intents and Relay) and carry a Plaxswap fee of 0.20 to 0.40%. The same wallet is also offered as a web wallet at plaxswap.com/wallet.

## Analysis

- **Bitcoin support.** Bitcoin is one of the networks the app can send on, according to the [wallet page](https://plaxswap.com/crypto-wallet).
- **Custody.** The provider says the 12 or 24-word recovery phrase is created on the device and never sent to its servers. The [about page](https://plaxswap.com/about) calls the wallet non-custodial and the payment gateway custodial.
- **Source code.** In its [listing request](https://gitlab.com/walletscrutiny/walletScrutinyCom/-/work_items/1025), the provider told us that the wallet app is closed source and that its public repositories "are SDKs and plugins, not the wallet". The [plaxswap-com](https://github.com/plaxswap-com) organization holds API clients, a WooCommerce plugin, payment-gateway examples and forks of "awesome" lists. None of them is wallet code.

There is no public source code for this app, so the provider's self-custody claim cannot be verified. The app is {% include verdictBadge.html verdict="nosource" type='short' %}.
