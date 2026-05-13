---
wsId: cake
title: Cake Wallet
altTitle: 
authors:
- leo
appId: com.fotolockr.cakewallet
appCountry: 
idd: 1334702542
released: 2018-01-19
updated: 2026-04-23
version: 6.1.2
reviews: 4208
website: https://cakewallet.com
repository: https://github.com/cake-tech/cake_wallet
icon: com.fotolockr.cakewallet.jpg
bugbounty: 
meta: ok
verdict: sourceavailable
date: 2022-11-02
signer: 
twitter: cakewallet
social:
- https://www.facebook.com/cakewallet
- https://www.reddit.com/r/cakewallet
features:
- taproot
- hd
- TOR
- batching
- buyWithCC
- coinCtrl
- customNode
- multiAccount
- segwit
- tradeAlts
developerName: Cake Technologies, LLC

---

{% include featureEvidence.html feature="taproot" source="[App Store](https://apps.apple.com/app/com.fotolockr.cakewallet)" quote="Powerful Bitcoin privacy tools like Silent Payments and Payjoin" %}
{% include featureEvidence.html feature="hd" source="[App Store](https://apps.apple.com/app/com.fotolockr.cakewallet)" quote="All your wallets and crypto with just one seed" %}

**Note:** iPhone products are **not verifiable**.

**Update  2022-11-02**: Apparently this product fails to build from source. The
relatively old
[issue](https://github.com/cake-tech/cake_wallet/issues/337) was not closed yet.
We have to assume this product remains to be **not verifiable**.

**Update 2021-04-14**: They now do have a public issue tracker and
[emanuel](/authors/emanuel) tried to build with
[slightly more success](https://github.com/cake-tech/cake_wallet/issues/112)
but the verdict remains the same.

> Cake Wallet allows you to safely store, send receive and exchange your XMR /
  Monero and BTC / Bitcoin.

is an implicit claim of this being a non-custodial Bitcoin wallet but:

> -You control your own seed and keys

is more explicit about the non-custodial part.

On their website we read:

> **FEATURES**<br>
  ...<br>
  Open source

and indeed, there is [a source code repo](https://github.com/cake-tech/cake_wallet).

There is no claim about reproducibility or build instructions. As the app uses
[Flutter](https://flutter.dev/) and we have no experience with that, we have to
stop here. Usually at this point we open issues on the code repository but they
have no public issue tracker.

{% include featureEvidence.html feature="coinCtrl" quote="Bitcoin coin control (specify specific outputs to spend)" source="README" %}

{% include featureEvidence.html feature="batching" quote="Specify multiple recipients for batch sending" source="README" %}

{% include featureEvidence.html feature="customNode" quote="Select your own custom nodes/servers" source="README" %}

{% include featureEvidence.html feature="buyWithCC" quote="Buy cryptocurrency (BTC/LTC/XMR/ETH) with credit/debit/bank" source="README" %}

{% include featureEvidence.html feature="tradeAlts" quote="Built-in exchange for dozens of pairs" source="README" %}

{% include featureEvidence.html feature="TOR" quote="Native Tor integration for powerful network-level privacy" source="Store" %}

{% include featureEvidence.html feature="multiAccount" quote="Create several wallets" source="README" %}

{% include featureEvidence.html feature="segwit" comment="(no justification provided by LLM)" %}

An issue has been opened at [https://github.com/cake-tech/cake_wallet/issues/337](https://github.com/cake-tech/cake_wallet/issues/337)
