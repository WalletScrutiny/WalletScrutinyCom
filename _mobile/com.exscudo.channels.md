---
wsId: exscudo
title: 'Fintap: BTC, ETH Crypto Wallet'
date: 2026-10-30
authors:
- kiwilamb
- leo
website: https://fintap.app
twitter: ex_scudo
social:
- https://www.facebook.com/exscudo
- https://www.reddit.com/r/EXSCUDO
features:
- buyWithCC
- tradeAlts
appCountry: ru
redirect_from:
- /android/com.exscudo.channels/
- /iphone/com.exscudo.channels/
android:
  appId: com.exscudo.channels
  users: 100000
  appCountry: ru
  released: 2018-05-17
  updated: 2026-08-28
  version: 4.0.6-prd.10
  reviews: 50
  icon: com.exscudo.channels.webp
  meta: ok
  verdict: nosource
  developerName: NIMERA LTD
iphone:
  appId: com.exscudo.channels
  idd: 1367425342
  appCountry: ru
  released: 2018-05-16
  updated: 2026-09-01
  version: 4.0.8
  reviews: 55
  icon: com.exscudo.channels.webp
  meta: ok
  verdict: nosource
  developerName: Exscudo OU

---

## Android

**Update 2026-10-30:** The app is still listed and updated, but the
self-custody claim quoted below is gone from the Play Store description. It now
presents Fintap as a wallet, exchange and messenger, lets users "send cripto via
integrated secure messenger" and "swap without energy fees", and says nothing about who
holds the keys. The website [fintap.app](https://fintap.app/) refused connections
on 2026-10-30, and the [Exscudo](https://github.com/Exscudo) account on GitHub
holds only API documentation. With no source code and an unclear custody model,
the verdict stays {% include verdictBadge.html verdict="nosource" type='short' %}.

Notably, it features a generic descriptor as its app title "{{page.title}}" while the app's description claims it's called "Fintap.app" and the Play store id is `{{page.appId}}`.

The Play Store description states...

> Be confident in your funds: our EON blockchain has existed since 2018, and Fintap.app is a blockchain wallet with a private key that is generated and stored only on the user’s side.

the provider is claiming the wallet is non-custodial.

However despite the app's frequent updates no source code can be found in a public repository.

Our verdict: This ‘wallet’ claims to be non-custodial, however with no source code for validation this is **not verifiable**.

{% include featureEvidence.html feature="tradeAlts" quote="Our platform supports cross-exchange pairs, eliminating the need for multiple transactions to acquire your desired currency. Simply top up your wallet with one currency and exchange it for any other of your choice. Trade anything you want, anytime you want, all in one place." source="Website" %}

{% include featureEvidence.html feature="buyWithCC" quote="Looking to buy Bitcoin (BTC)? It's simple with Fintap. Just download the Fintap app from your device store, select your country and start your crypto journey without any limitations." source="Website" %}

---

## iPhone

**Update 2026-10-30:** The app is still listed and updated, but the
self-custody claim quoted below is gone from the App Store description. It now
presents Fintap as a wallet, exchange and messenger, offers "zero-fee transfers"
between Fintap users and swaps "without additional gas fees", and says nothing about who
holds the keys. The website [fintap.app](https://fintap.app/) refused connections
on 2026-10-30, and the [Exscudo](https://github.com/Exscudo) account on GitHub
holds only API documentation. With no source code and an unclear custody model,
the verdict stays {% include verdictBadge.html verdict="nosource" type='short' %}.

The App Store description states...

> All funds are fully protected and no one except the owner can access them.

so the provider is sort of claiming the wallet is non-custodial.
However no source code can be found in a public repository for validation.

Our verdict: This ‘wallet’ claims to be non-custodial, however with no source
code this is **not verifiable**.
