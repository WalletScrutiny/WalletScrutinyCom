---
title: BitcoinPOS - cash register
date: 2026-07-24
website: https://bitcoinpos.americanposllc.com/
appCountry: us
redirect_from:
- /iphone/cz.americanPos.bitcoinPOSThree/
iphone:
  appId: cz.americanPos.bitcoinPOSThree
  idd: '6575382133'
  appCountry: us
  released: 2025-12-22
  updated: 2026-05-25
  version: 1.0.4
  reviews: 0
  icon: cz.americanPos.bitcoinPOSThree.jpg
  meta: ok
  verdict: custodial
  developerName: BitcoinPOS

---

## App Description

BitcoinPOS is a merchant point-of-sale ("cash register") app for iPhone and iPad, published by American POS LLC. It is aimed at shops and restaurants and, according to its [website](https://bitcoinpos.americanposllc.com/), handles cash, vouchers, card payments (with a connected terminal) and cryptocurrency, alongside inventory, restaurant and receipt-printing features. Its cryptocurrency option accepts Bitcoin over the Lightning Network. The provider states a 2% per-transaction fee, paid by the customer, covers the Lightning service.

## Testing and Analysis

We were unable to test the app: it is published for iOS only, and iOS binaries cannot be reproduced in any case. This assessment is based on the provider's published documentation, retrieved 2026-07-24.

**How the Lightning payment works.** BitcoinPOS accepts Bitcoin at the point of sale over the Lightning Network, which is well suited to retail: payments are cheap and confirm in seconds. Per the provider's [Lightning Network page](https://bitcoinpos.americanposllc.com/bitcoinpos-supports-bitcoin-lightning-network), the flow is:

1. The cashier enters the amount in USD, EUR, GBP or BTC.
2. The POS generates a Lightning invoice and shows it as a QR code.
3. The customer scans it with their own Lightning wallet and pays — so the *paying* side is fully self-custodial and under the customer's control.
4. The POS shows immediate confirmation and prints or emails a receipt.

This customer-facing experience is exactly what a Lightning point-of-sale should do, and it does not require the customer to trust BitcoinPOS with anything beyond the single invoice they are paying.

**Where custody sits — the merchant's funds.** The received bitcoin does not land in a wallet the merchant controls. The integration routes payments through a third-party Lightning node operator, **Hydranode**: *"funds are credited to your LN account continuously; ready for withdrawal to your own wallet at any time,"* and *"the merchant creates or links a Hydranode account directly in the POS."* Onboarding requires only an email address and a Signal phone number, and withdrawals are verified via Signal. The merchant is given no private key or Lightning node of their own inside the app; the balance accrues in the Hydranode-operated account and must be **withdrawn to the merchant's own wallet** to leave that custodian.

**Verdict: custodial.** BitcoinPOS is Lightning-friendly and the payer's experience is self-custodial, but from the merchant's standpoint the takings are held by a third party (Hydranode) until they are withdrawn, and the merchant holds no keys within the app. Because a provider holds the funds, the review ends here: there is no user-held key material to audit, and source availability and reproducibility do not arise. A merchant wanting sole control of funds as they arrive would pair a self-custodial Lightning back-end (for example their own node or an LNURL/Lightning-address payout to a wallet they control) with a point-of-sale that supports it; BitcoinPOS as documented does not offer that.
