---
title: Debifi
date: 2026-06-09
website: https://debifi.com
android:
  appId: com.wagmi.debifi.android.mainnet
  users: 1000
  appCountry: us
  released: 2024-03-21
  updated: 2026-06-25
  version: 0.16.0-prod-mainnet
  icon: com.wagmi.debifi.android.mainnet.png
  meta: ok
  verdict: custodial
  developerName: Debifi
iphone:
  appId: com.debifi.ios
  idd: '6738124778'
  appCountry: us
  released: 2024-11-18
  updated: 2026-06-26
  version: 0.17.0
  reviews: 3
  icon: com.debifi.ios.jpg
  meta: ok
  verdict: custodial
  developerName: GMI SOFT LIMITED

---

## App Description

Debifi is a Bitcoin-backed lending platform where borrowers lock BTC in a multisig escrow — 3-of-4 for fiat and stablecoin loans, 2-of-3 for card loans — to receive credit in fiat (USD, EUR, GBP, CHF, AED, BRL), stablecoins, or via a prepaid card. For fiat and stablecoin loans, the four keyholders are the borrower, the lender, Debifi, and an independent Authorized Key Holder (AKH); card loans use three keyholders (borrower, lender, Debifi) with no AKH. KYC requirements vary by lender and are not universal. The app supports Coldcard MK4 integration for hardware wallet key storage, and source code is claimed at `gitlab.com/debifi-public/debifi-app`.

## Analysis

Debifi offers three products — fiat loans, stablecoin loans, and card loans — across two multisig structures, both of which allow third parties to move collateral without the borrower's signature.

For regular loans, the escrow uses a 3-of-4 multisig (borrower, lender, Debifi, AKH). Any three keyholders can sign — meaning lender, Debifi, and AKH can form a quorum and execute liquidation at the configured LTV threshold (lenders may set 75%, 80%, 85%, or 90%) without the borrower. Debifi's [FAQ](https://debifi.com/faq#what-happens-if-i-fail-to-repay-my-loan-what-is-forced-liquidation) states that collateral is released to the lender following a Debifi manager's review once the threshold is breached, confirming that the quorum can move funds without the borrower's signature.

For card loans, the escrow is 2-of-3 (borrower, lender, Debifi). The script permits lender and Debifi to sign without the borrower; while Debifi's materials do not explicitly describe unilateral third-party liquidation for card products, the signing arrangement makes it structurally possible — a weaker custody guarantee than even the regular-loan structure.

In both cases, the Bitcoin script enforces the signing quorum's authority without independently verifying whether the liquidation conditions were legitimately met. Under WalletScrutiny's [custodial definition](https://gitlab.com/walletscrutiny/walletScrutinyCom/-/blob/master/_data%2Fverdicts%2Fcustodial.yml?blame=1#L17), shared or conditional third-party access to funds is still custodial regardless of the multisig arrangement. The GitLab repository (`debifi-public/debifi-app`) is public; scope and completeness require verification before any reproducibility assessment. **Debifi is custodial.**
