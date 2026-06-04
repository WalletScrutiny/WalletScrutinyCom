---
wsId: rhinoBitcoin
title: Rhino Bitcoin
date: 2026-05-19
authors:
- danny
website: https://www.rhinobitcoin.com/
twitter: RhinoBitcoin
social:
- https://www.linkedin.com/company/rhino-bitcoin
- https://www.instagram.com/RhinoBTCapp
- https://www.facebook.com/RhinoBTCapp
redirect_from:
- /android/com.rhinoglobal/
- /iphone/com.Rhino.Global/
android:
  appId: com.rhinoglobal
  users: 1000
  appCountry: us
  released: 2024-08-30
  updated: 2026-05-15
  version: 2.12.17
  reviews: 15
  icon: com.rhinoglobal.png
  meta: ok
  verdict: custodial
  developerName: Rhino Bitcoin
iphone:
  appId: com.Rhino.Global
  idd: '1564149079'
  appCountry: us
  released: 2022-06-29
  updated: 2026-05-18
  version: 2.12.17
  reviews: 27
  icon: com.Rhino.Global.jpg
  meta: ok
  verdict: custodial
  developerName: Rhino Global Inc

---

## Android

## App Description

Rhino Bitcoin is a Bitcoin banking and remittance app for US residents. The Play Store listing says users can buy Bitcoin, use the Lightning Network for remittances, pay bills, borrow money, access cold storage custody, send cash globally, and invest in retirement accounts.

The provider's website describes Rhino as an app for managing Bitcoin transactions, paying bills, borrowing money, and investing in retirement accounts. It also advertises buying and selling Bitcoin, on-chain and Lightning payments, global remittances, and cold storage options.

## Testing and Analysis

We reviewed the Play Store listing, Rhino's website, and Rhino's help center documentation.

Rhino clearly supports Bitcoin. Its help center documents direct Bitcoin deposits, Bitcoin withdrawals, on-chain payments, Lightning payments, and Lightning wallet funding.

The custody question fails before source-code review. Rhino is structured as a regulated financial account, not as a self-custodial wallet where the user receives and controls the Bitcoin private keys.

Rhino's help center describes Bitcoin deposits as sending BTC to a "Rhino BTC wallet." For withdrawals, the user selects "Bitcoin Withdraw" inside the Rhino account and enters an external Bitcoin address. The documentation for cold storage says Rhino lets users withdraw to a personal cold wallet or deposit to Casa from the Rhino wallet. This means the personal wallet or Casa vault is separate from the Rhino app, not the default custody model of the app itself.

The Lightning documentation also refers to a "Rhino Lightning Wallet" and says received Lightning funds are deposited there. The account flow includes KYC requirements, bank linking, ACH/wire deposits and withdrawals, and two-factor authentication requirements for banking actions.

For Bitcoin-backed loans, Rhino's help center says collateral is transferred to Anchorage Digital, a custody partner. This further confirms that at least part of the product uses third-party custody.

At this stage, we found no evidence that Rhino gives users a seed phrase or private key for the Bitcoin held inside the Rhino account. The documented self-custody path is to withdraw Bitcoin out of Rhino to a wallet the user controls.

As a result, Rhino Bitcoin is classified as **custodial**.

---

## iPhone

{% include copyFromAndroid.html %}
