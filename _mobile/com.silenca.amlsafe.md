---
title: Safe3 - Crypto Wallet
date: 2026-10-30
authors:
- leo
website: https://safe3.app/
features:
- buyWithCC
- tradeAlts
redirect_from:
- /android/com.silenca.amlsafe/
- /iphone/com.avelot.amlsafe/
android:
  appId: com.silenca.amlsafe
  users: 100000
  appCountry: us
  released: 2020-10-26
  updated: 2026-10-05
  version: '2.47'
  reviews: 2
  icon: com.silenca.amlsafe.webp
  meta: ok
  verdict: nosource
  developerName: Avelot Limited
iphone:
  appId: com.avelot.amlsafe
  idd: '1519145333'
  appCountry: us
  released: 2020-07-28
  updated: 2026-10-05
  version: 2.47.843
  reviews: 51
  icon: com.avelot.amlsafe.webp
  meta: ok
  verdict: nosource
  developerName: Avelot Limited

---

**Update 2026-10-30:** AMLSafe is now called Safe3. The [website](https://safe3.app/) and the
app descriptions now call it a "Non-custodial wallet", and the
[terms of use](https://safe3.app/terms-of-use) say Safe3 "does not
receive or store your Wallet password, encrypted private key, unencrypted private
key, or mnemonic (backup) phrase". We found no source code for the app, so we
change the verdict of both apps from custodial to
{% include verdictBadge.html verdict="nosource" type='short' %}.

## Android

> AMLSafe is a cutting edge crypto wallet with fiat pairs and an instant
  Anti-Money Laundering (AML) checking. Our wallet gives you the ability to buy
  and sell many cryptocurrencies with fiat.

Seriously?

It is non-custodial! And also not for terrorists.

> Our non-custodial crypto wallet helps ensure that your crypto assets are not
  related to money laundering or terrorist financing.

But ... is it reall non-custodial? On the website we read:

> **Security**<br>
  Your private key is stored on-premise and secured with a multilevel security
  system.

Their [documentation](https://amlsafe.io/en/documentation#deadLink) is "under
construction".

With the conflicting claims about where the keys are stored, we have to assume
they retain access to the users' keys. Either way this app is **not verifiable**.

{% include featureEvidence.html feature="tradeAlts" quote="Exchange" source="Website" %}

{% include featureEvidence.html feature="buyWithCC" quote="Purchasing with a card" source="Website" %}

---

## iPhone

> AMLSafe is a cutting edge crypto wallet with fiat pairs and an instant
  Anti-Money Laundering (AML) checking. Our wallet gives you the ability to buy
  and sell many cryptocurrencies with fiat.

Seriously?

It is non-custodial! And also not for terrorists.

> Our non-custodial crypto wallet helps ensure that your crypto assets are not
  related to money laundering or terrorist financing.

But ... is it reall non-custodial? On the website we read:

> **Security**<br>
  Your private key is stored on-premise and secured with a multilevel security
  system.

Their [documentation](https://amlsafe.io/en/documentation#deadLink) is "under
construction".

With the conflicting claims about where the keys are stored, we have to assume
they retain access to the users' keys. Either way this app is **not verifiable**.

{% include featureEvidence.html feature="tradeAlts" quote="Exchange" source="Website" %}

{% include featureEvidence.html feature="buyWithCC" quote="Purchasing with a card" source="Website" %}
