---
title: KeyCard
appId: keycard
authors:
- kiwilamb
- danny
released: 
discontinued: 
updated: 
version: 
binaries: 
dimensions:
- 54
- 85
- 1
weight: 10
provider: KeyCard
providerWebsite: https://keycard.tech
website: https://keycard.tech
shop: https://get.keycard.tech/
country: 
price: 29EUR
repository: https://github.com/keycard-tech/status-keycard
icon: keycard.webp
bugbounty: 
meta: ok
verdict: noita
date: 2026-10-30
signer: 
twitter: Keycard_
social: 
builds: 
features:
- airGapped
- camera
- foss
- hd
- nfc
- secEl

---

**Update 2026-10-30:** Keycard is still sold and still open source. The [Keycard shop](https://keycard.tech/products/keycard) sells a single card for 29 € (we updated the price). The [applet repository](https://github.com/keycard-tech/status-keycard) moved from status-im to the keycard-tech organization and got its last release, 4.0.1, on 2026-10-13. Keycard now also sells the {% include walletLink.html wallet='hardware/keycard-shell' verdict='true' %}, a signer with a screen and keypad that uses the card as its secure element. We review it separately. The card alone still has no screen or button, so it stays {% include verdictBadge.html verdict="noita" type='short' %}.

## Update 2022-11-03

- This device is NFC-enabled
- It is paired with the [Status.im mobile app](https://status.im/keycard-integration/)
- The keys are generated via the app and then later on stored on the card.
- Secured with passcode, PUK code, pairing code, 12-word seedphrase.

A demo is available here:

<iframe width="560" height="315" src="https://www.youtube.com/embed/oBVLwXL7JJQ" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

## Addendum

Its [affordability](https://keycard.tech/) also allows for physical value transfer by passing it along other users:

> Designed similar to a credit/debit card, Smartcards are an inexpensive, simple, and secure way to onboard new users.

## Previous 2021-08-08

This hardware device lacks a screen or a button, this device cannot provide basic security of hardware wallets.

{% include featureEvidence.html feature="hd" quote="Keycard is an implementation of a BIP-32 HD wallet running on Javacard 3.0.4+" source="GitHub README" %}

{% include featureEvidence.html feature="secEl" quote="Keycard secure element has the highest level of certification provided by Common Criteria." source="Website" %}

{% include featureEvidence.html feature="airGapped" quote="Through Keycard Shell's camera or Keycard's contactless nature, our products can be airgapped." source="Website" %}

{% include featureEvidence.html feature="camera" quote="Through Keycard Shell's camera or Keycard's contactless nature, our products can be airgapped." source="Website" %}

{% include featureEvidence.html feature="nfc" quote="It supports both NFC and ISO7816 physical interfaces, meaning that it is compatible with any Android phone equipped with NFC, and all USB Smartcard readers." source="GitHub README" %}

{% include featureEvidence.html feature="foss" quote="Fully open source Open-source code on an open framework, making it the most open way to design a secure element. View on GitHub" source="Website" %}
