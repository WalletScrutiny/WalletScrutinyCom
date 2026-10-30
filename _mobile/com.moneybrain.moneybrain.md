---
wsId: Moneybrain
title: Moneybrain Financial SuperApp
date: 2026-10-30
authors:
- danny
website: https://www.moneybrain.com
twitter: MoneybrainBiPS
features:
- buyWithCC
- fingerprint
- tradeAlts
appCountry: gb
redirect_from:
- /android/com.moneybrain.moneybrain/
- /iphone/com.moneybrain.moneybrain/
android:
  appId: com.moneybrain.moneybrain
  users: 1000
  appCountry: gb
  released: 2019-10-17
  updated: 2026-05-23
  version: 3.16.2-retail
  icon: com.moneybrain.moneybrain.webp
  meta: removed
  verdict: custodial
  developerName: Moneybrain LTD
iphone:
  appId: com.moneybrain.moneybrain
  idd: 1476827262
  appCountry: gb
  released: 2019-10-15
  updated: 2026-05-25
  version: 3.16.2
  reviews: 10
  icon: com.moneybrain.moneybrain.webp
  meta: ok
  verdict: custodial
  developerName: Moneybrain LTD

---

## Android

**Update 2026-10-30:** The app is listed on Google Play. On 2022-05-30 the FCA refused
Moneybrain's application to be registered as a cryptoasset exchange provider and a custodian wallet provider,
because it had published "misleading marketing and promotional material" about its BiPS tokens, and on 2022-09-22 the Upper Tribunal refused to
suspend that decision
([Upper Tribunal decision](https://assets.publishing.service.gov.uk/media/639080d7d3bf7f32887a69b6/Moneybrain_Ltd_v_FCA_suspension_hearing_decision.pdf)).
The [website](https://www.moneybrain.com) now says "Moneybrain Global Ltd is registered with The Jersey
Financial Services Commission as a Virtual Asset Services Provider" and still describes a "crypto wallet and
payment platform". We found no self-custody option, so the verdict stays {% include verdictBadge.html verdict="custodial" type='short' %}.

## App Description

> Moneybrain is the first global App to provide access to a full reserve Peer to Peer digital loans and mortgage platform; FCA regulated JustUs. In addition, the Moneybrain App also provides access to the world's first global equity crowdfunding platform Koodoo.
>
> As an FCA regulated business, Moneybrain has integrated tried and tested identity and money laundering tools to power a global asset backed Peer to Peer digital currency BiPS. BiPS can be stored within the Moneybrain wallet and App, spent and exchanged globally alongside local fiat currencies such as Sterling (GBP), Euro (EUR), US Dollars (USD).


## The Site

From the [General Terms and Conditions:](https://www.moneybrain.com/terms-conditions/)

> (e) We may disable your account at any time in our sole discretion without notice or explanation.

## The App

We tried the app and registered. It required both email and mobile verification.

While the app features a Personal Account and a Business Account, it is mandatory to complete identity verification first.

Users are redirected to a KYC application online.

We found a tab for Digital Assets and found it was possible to withdraw and deposit BTC. However, before you are given access to these features, you must first complete the KYC verification. 

## Verdict

We conclude that this is a **custodial** app and as such, **not verifiable.**

---

## iPhone

**Update 2026-10-30:** The iPhone app is still listed (version 3.16.2, 2026-05-25). The findings
above apply to it as well; the verdict stays {% include verdictBadge.html verdict="custodial" type='short' %}.

{% include copyFromAndroid.html %}

{% include featureEvidence.html feature="tradeAlts" quote="BiPS can also be exchanged in-App with other established digital currencies such as Bitcoin (BTC), Ethereum (ETH) Cardano (ADA) Ripple (XRP) Bitcoin Cash (BCH) Litecoin (LTC) and UniSwap (UNI)." source="Store description" %}

{% include featureEvidence.html feature="buyWithCC" quote="Buy & store crypto with Visa or Mastercard" source="Website" %}

{% include featureEvidence.html feature="fingerprint" quote="Manage your access settings for biometric, touch/face ID logins." source="Store description" %}
