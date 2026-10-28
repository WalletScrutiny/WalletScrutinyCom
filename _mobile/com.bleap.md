---
title: 'Bleap: Finance & Cashback Card'
date: 2026-10-28
authors:
- leo
website: https://www.bleap.finance
twitter: BleapApp
android:
  appId: com.bleap
  users: 50000
  appCountry: us
  released: May 23, 2024
  updated: 2026-10-20
  version: 1.55.0
  reviews: 9
  icon: com.bleap.webp
  meta: ok
  verdict: nobtc
  developerName: Bleap
iphone:
  appId: com.bleap
  idd: '6467641662'
  appCountry: gb
  released: '2024-08-19T07:00:00Z'
  updated: 2026-10-22
  version: 1.55.0
  reviews: 18
  icon: com.bleap.webp
  meta: ok
  verdict: nobtc
  developerName: Bleap

---

## App Description

Bleap is a crypto finance app from Bleap (Bleap SIA, Latvia). It combines a Mastercard debit card with cashback, a wallet, zero-fee trading and DeFi savings vaults. The Play Store description calls it "a non-custodial Web3 wallet" with "No seed phrase required" that is "Built with account abstraction". The help centre says the wallet's key is an MPC key generated with PortalHQ. Transactions are normally co-signed by the user and "Bleap's signing service". The listing names Bitcoin (BTC) among the tokens you can buy, sell, hold and spend.

## Analysis

- **Bitcoin support.** The wallet is a smart-contract wallet. According to [What happens if I send funds to Bleap on the wrong chain?](https://help.bleap.finance/en/articles/15820235-what-happens-if-i-send-funds-to-bleap-on-the-wrong-chain), "Bleap uses a smart-contract wallet that must be deployed on the target network to access or control the funds." Bitcoin has no such smart-contract accounts, so this wallet cannot hold native BTC. The [How to add Funds](https://help.bleap.finance/en/articles/11125240-how-to-add-funds-to-your-bleap-wallet) guide offers Arbitrum as the network for manual crypto deposits. Linked wallets can only send funds to "Bleap's Bridging address".
- **Bitcoin is listed as "Soon".** In the cash-out table [What tokens and chains does Bleap support when selling](https://help.bleap.finance/en/articles/8728603-what-tokens-and-chains-does-bleap-support-when-selling-cash-out) (April 15, 2025), "BTC Bitcoin Bitcoin" and "WBTC Wrapped Bitcoin Ethereum" are both marked "Soon". [The Block](https://www.theblock.co/news/markets/2025-04-16-ex-revolut-bleap-mastercard-stablecoins-350832) reported at the same time that "Bleap's smart wallet supports the USDC, USDT, USDA and EURA stablecoins. It is only deployed on Arbitrum." Bitcoin was listed only among the networks of its "on and off-ramp and bridging services".
- **Tracking is not holding.** The listing's "Sync wallets across Ethereum, Bitcoin, and Solana" describes tracking external wallets. It does not mean Bleap holds Bitcoin.
- **Custody (for completeness).** [Security & Keys at Bleap](https://help.bleap.finance/en/articles/11012551-security-keys-at-bleap) says the key "consists of two separate parts" (one on your device, one on PortalHQ). [How to use your wallet without Bleap](https://help.bleap.finance/en/articles/15887052-how-to-use-your-wallet-without-bleap-guide) describes a "Slow Withdrawal" that needs only the user's exported key and a waiting period of 24 to 72 hours. We did not look into this further, because it only matters for the non-Bitcoin assets.

Any "Bitcoin" in Bleap would be a token on a smart-contract chain such as Arbitrum, or a conversion through Bleap's bridge, not BTC on the Bitcoin network. Bleap is therefore {% include verdictBadge.html verdict="nobtc" type='short' %}.

## iPhone

The iOS app is published by Bleap, the same provider, and it gives access to the same account and service, so the same verdict applies to it.

**A wallet but not for Bitcoin**
