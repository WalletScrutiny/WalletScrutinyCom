---
wsId: coinme
title: 'Coinme: Buy Bitcoin & Crypto'
date: 2026-10-30
authors:
- danny
website: https://www.coinme.com
twitter: Coinme
social:
- https://www.linkedin.com/company/coinme
- https://www.facebook.com/Coinme
features:
- buyWithCC
- tradeAlts
redirect_from:
- /android/com.coinme/
- /iphone/com.coinme.CoinMe/
android:
  appId: com.coinme
  users: 100000
  appCountry: us
  released: 2021-05-06
  updated: 2026-10-02
  version: 3.4.5
  reviews: 1169
  icon: com.coinme.webp
  meta: ok
  verdict: custodial
  developerName: Coinme
iphone:
  appId: com.coinme.CoinMe
  idd: 1545440300
  appCountry: us
  released: 2021-05-11
  updated: 2026-10-06
  version: 3.4.5
  reviews: 6633
  icon: com.coinme.CoinMe.webp
  meta: ok
  verdict: custodial
  developerName: Coinme Inc.

---

## Android

**Update 2026-10-30:** Coinme is still custodial. Section 9.1 of its current [Terms of Service](https://help.coinme.com/en/articles/9039676-terms-of-service) says "Coinme controls the private keys for the blockchain addresses for deposited Tokens", and customer tokens are tracked "on internal ledgers maintained by Coinme". Regulators have acted against Coinme since our review. California's DFPI [fined it $300,000](https://dfpi.ca.gov/enforcement_action/coinme-inc/) in 2025, and Washington's DFI [moved to halt its money transfers](https://dfi.wa.gov/news/press/washington-state-dfi-takes-action-against-coinme-halt-all-money-transfers-washington-due) in that state. In October 2026, a $2.5 million multistate settlement required Coinme to stop operating its crypto kiosks in the covered states by 2027-01-01. Coinme may keep offering its other crypto services ([Hoodline](https://hoodline.com/2026/10/coinme-must-pull-bitcoin-atms-from-oregon-by-2027-after-2-5m-settlement/)). The verdict stays {% include verdictBadge.html verdict="custodial" type='short' %}.

### Google Play

The app is described as an on-ramp and off-ramp bitcoin and cash exchange. It allows users to receive, store and send Bitcoin. It is also possible to sell bitcoins and pick-up the cash from several locations. Security-wise, it claims:

> Assets are secured with industry-leading, bank-level security. Your account requires mobile phone 2FA. Sophisticated anti-fraud analysis tools are employed to monitor for any suspicious activity.

### The Site

In Coinme's [How to Page](https://coinme.com/how-to/):

>**What is Coinme?**<br>
Coinme is a _licensed_ and _regulated_ digital currency exchange and wallet provider. That means we help everyday people get access to bitcoin and cryptocurrency. Coinme powers a large network of physical locations where users can buy and sell bitcoin with cash.

Coinme's [Legal Terms indicate that they hold the private keys](https://coinme.com/legal/) (that page now only links to the [current terms](https://help.coinme.com/en/articles/9039676-terms-of-service))

> **7.1 Private Keys; Storage of Tokens.** Coinme will retain the private keys for any Tokens in the Hosted Wallet, for which private keys are necessary in order to transfer any Tokens out of the Hosted Wallet. Coinme will use the private keys in order to affect the transfers initiated using your Coinme Account. Tokens shown as being held in your Hosted Wallet may be in the Hosted Wallet based on internal ledgers and records maintained by Coinme, but customer Tokens may be held in pooled accounts controlled by Coinme on the public distributed ledger for the applicable Token (“Blockchain”).

### Verdict

Section 7.1 of Coinme's [Terms and Conditions](https://coinme.com/legal/) strongly points to a **custodial** service that's **not verifiable**.

---

## iPhone

**Update 2026-10-30:** The iPhone app is the same custodial service under the same [Terms of Service](https://help.coinme.com/en/articles/9039676-terms-of-service). The verdict stays {% include verdictBadge.html verdict="custodial" type='short' %}.

{% include copyFromAndroid.html %}

{% include featureEvidence.html feature="tradeAlts" quote="Easily buy and sell crypto with popular assets like Bitcoin (BTC), Solana (SOL), Dogecoin (DOGE), Ethereum (ETH), and more." source="Store description" %}

{% include featureEvidence.html feature="buyWithCC" quote="connect your debit card for online crypto purchases from home" source="Store description" %}
