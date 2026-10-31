---
title: Bitaroo Express - Buy Bitcoin
date: 2026-10-30
authors:
- danny
website: https://www.bitaroo.com.au
twitter: BitarooExchange
social:
- https://www.youtube.com/@bitarooexchange
- https://www.linkedin.com/company/bitaroo/
- https://www.reddit.com/r/Bitaroo/
features:
- buyWithCC
- ln
- multiSig
redirect_from:
- /android/au.com.bitaroo.express/
- /iphone/au.com.bitaroo.express/
android:
  appId: au.com.bitaroo.express
  users: 1000
  appCountry: us
  updated: 2026-10-13
  version: 5.3.2
  icon: au.com.bitaroo.express.webp
  meta: ok
  verdict: custodial
  developerName: Bitaroo
iphone:
  appId: au.com.bitaroo.express
  idd: '6444825898'
  appCountry: au
  released: 2022-12-20
  updated: 2026-10-10
  version: 5.3.1
  reviews: 26
  icon: au.com.bitaroo.express.webp
  meta: ok
  verdict: custodial
  developerName: Bitaroo

---

**Update 2026-10-30:** The app now has two optional self-custody features next to the custodial exchange account: the Bitaroo Wallet, a hot wallet whose 12-word recovery phrase is created on the phone and never leaves it ([Bitaroo](https://www.bitaroo.com.au/bitaroo-wallet/)), and Bitaroo Guardian, a 2-of-3 multisig wallet where the user holds two keys and Bitaroo the third ([Bitaroo](https://www.bitaroo.com.au/)). Buying, selling and Lightning still happen in the custodial account, so the verdict stays {% include verdictBadge.html verdict="custodial" type='short' %}.

## Android

## Analysis

- Supports bitcoin
- Allows for deposit/withdrawal
- Users are not in control of the private keys

## Observations

Bitaroo Express is an exchange with support for Lightning Network and on-chain transactions and it supports the buying, selling, deposit/withdraw of bitcoin. There's no mention of private keys or self custody anywhere in the description of the app. [However, this article](https://support.bitaroo.exchange/hc/en-au/articles/8633601898767-Why-did-Bitaroo-build-a-Vault) has some more information on how Bitaroo "holds" users' bitcoin.

> Users who utilise our long-term custodial services but do not engage in buying, selling, paying a BPAY bill, depositing, or withdrawing will have their coins automatically moved to the [Bitaroo Vault](https://support.bitaroo.exchange/hc/en-au/articles/7880245231759-What-is-Bitaroo-Vault).

The Bitaroo Vault mentioned here is a **custodial** storage solution. It's unlikely that this app lets the users hold their own private keys, and even less likely to be open source and available for reproducibility testing.

---

## iPhone

The Android analysis above applies to the iPhone app too.

{% include featureEvidence.html feature="ln" quote="It supports both on-chain transactions and the Lightning Network, giving you speed and flexibility." source="Store" %}

{% include featureEvidence.html feature="multiSig" quote="We guard one of your keys Collaborative multi-sig security for peace of mind." source="Website" %}

{% include featureEvidence.html feature="buyWithCC" quote="Bitaroo Express lets you buy, sell, receive, store, and send bitcoin with ease." source="Store" %}
