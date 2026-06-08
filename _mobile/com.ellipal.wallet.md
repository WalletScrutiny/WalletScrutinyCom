---
wsId: ELLIPAL
title: 'ELLIPAL: Crypto Wallet'
date: 2021-12-03
authors:
- leo
- danny
website: http://www.ellipal.com
twitter: ellipalwallet
social:
- https://www.facebook.com/ellipalclub
- https://www.reddit.com/r/ELLIPAL_Official
features:
- airGapped
- buyWithCC
- camera
- companion
- hd
- multiAccount
- tradeAlts
appCountry: us
redirect_from:
- /android/com.ellipal.wallet/
- /iphone/com.Ellipal.Ellipal/
android:
  appId: com.ellipal.wallet
  users: 100000
  appCountry: us
  released: 2018-07-02
  updated: 2026-05-26
  version: 4.13.0
  reviews: 550
  icon: com.ellipal.wallet.png
  meta: ok
  verdict: nosource
  developerName: ellipal
iphone:
  appId: com.Ellipal.Ellipal
  idd: '1426179665'
  appCountry: us
  released: 2018-08-25
  updated: 2026-05-28
  version: 4.13.0
  reviews: 2955
  icon: com.Ellipal.Ellipal.jpg
  meta: ok
  verdict: nosource
  developerName: Ellipal

---

## Android

## Update 2024-07-17

This article confirms that Ellipal is a [closed source](https://www.ellipal.com/blogs/news/how-much-does-open-source-contribute-to-security) product.

>  "ELLIPAL allows Private keys import to overcome any worries originating from being closed source."

## Old Review 2021-12-03 

This appears to be the companion app to
{% include walletLink.html wallet='hardware/ellipaltitan' verdict='true' %}.

This app comes with the claim:

> Secure HD wallet for cryptocurrencies. Store, transact, and trade Bitcoin and
  Crypto: BTC ETH LTC DGB BSV BAT OMG XRP XVG & 1000+ more.

and absent more explicit claims, we have to guess that HD means "hierarchically
deterministic", a standard for self-custodial wallets.

As we can't find a source code repository on their website or
[their company GitHub account](https://github.com/ELLIPAL?tab=repositories&type=source),
we assume the app is closed source and thus **not verifiable**.

---

## iPhone

{% include copyFromAndroid.html %}

{% include featureEvidence.html feature="tradeAlts" quote="You can send, receive, swap, buy, sell, and stake various crypto assets all in one place" source="Store description" %}

{% include featureEvidence.html feature="buyWithCC" quote="You can send, receive, swap, buy, sell, and stake various crypto assets all in one place" source="Store description" %}

{% include featureEvidence.html feature="multiAccount" quote="Manage multiple wallet accounts" source="Store description" %}

{% include featureEvidence.html feature="airGapped" quote="ELLIPAL cold wallet pioneered air-gapped technology, featuring no Bluetooth, Wi-Fi, USB, or any network connections, using only QR codes to transmit information while keeping private keys 100% offline." source="Store description" %}

{% include featureEvidence.html feature="camera" quote="using only QR codes to transmit information while keeping private keys 100% offline." source="Store description" %}

{% include featureEvidence.html feature="companion" quote="It supports connection to ELLIPAL cold wallet devices to significantly enhance security. ELLIPAL cold wallet pioneered air-gapped technology, featuring no Bluetooth, Wi-Fi, USB, or any network connections, using only QR codes to transmit information while keeping private keys 100% offline." source="Store description" %}

{% include featureEvidence.html feature="hd" quote="Easy wallet import through seed phrases or private keys" source="Store description" %}
