---
wsId: osmoWallet
title: Osmo Money
date: 2023-08-24
authors:
- danny
website: https://www.osmowallet.com/
twitter: osmowallet
social:
- https://www.linkedin.com/company/osmo-wallet
- https://discord.com/invite/9qmKes8drZ
- https://www.instagram.com/osmowallet
- https://www.facebook.com/osmoenvios
features:
- buyWithCC
- fingerprint
- ln
- tradeAlts
redirect_from:
- /android/com.osmo.smt/
- /iphone/com.osmowallet.app/
android:
  appId: com.osmo.smt
  users: 100000
  appCountry: us
  released: 2022-07-01
  updated: 2026-05-27
  version: 4.9.14
  reviews: 44
  icon: com.osmo.smt.jpg
  meta: ok
  verdict: custodial
  developerName: osmo
iphone:
  appId: com.osmowallet.app
  idd: '1610776134'
  appCountry: us
  released: 2022-06-14
  updated: 2026-05-29
  version: 4.9.14
  reviews: 143
  icon: com.osmowallet.app.jpg
  meta: ok
  verdict: custodial
  developerName: Hodl Group Inc.

---

## Android

## App Description from Google Play

> Osmo is a mobile wallet that allows you to send and receive money easily and quickly, both locally and internationally.
>
> Top up your account in three ways: You can make a bank transfer at Guatemala, deposit cash through our network of affiliated points or send money to through the Bitcoin network from anywhere in the world

## Security Information from Website

> high-end security
>
> Your funds and data are safe. We use the highest safety standards in the industry.
>
> - The Bitcoin that we protect is in cold storage
> - Foreign currency funds are held in bank accounts
> - We protect your account with biometrics and PIN
> - All your information is encrypted

## Analysis 

- The app was not available for our country
- The provider explicitly describes the use of cold-storage therefore this app is **custodial** and **non-verifiable**.

{% include featureEvidence.html feature="fingerprint" quote="We protect your account with biometrics and PIN" source="Security Information from Website" %}

{% include featureEvidence.html feature="tradeAlts" quote="AHORRA EN DISTINTAS MONEDAS En OSMO puedes tener saldo en distintas monedas, intercambiar entre ellas en segundos y pagar con el saldo que prefieras." source="Website" %}

{% include featureEvidence.html feature="buyWithCC" quote="Tarjeta de Crédito o Débito" source="Website" %}

---

## iPhone

{% include copyFromAndroid.html %}

{% include featureEvidence.html feature="buyWithCC" quote="Tarjeta de Crédito o Débito" source="Website" comment="Website lists credit/debit card as a way to top up the account, implying buying crypto with a credit card." %}

{% include featureEvidence.html feature="tradeAlts" quote="Bitcoin o USDT" source="Website" comment="Website mentions USDT as a supported asset alongside Bitcoin, implying trading between crypto currencies." %}

{% include featureEvidence.html feature="fingerprint" quote="Protección avanzada: Seguridad con biometría, encriptación y un sistema sofisticado de prevención de fraude que detecta actividad de alto riesgo al instante." source="Store" comment="Biometric security explicitly mentioned in store description." %}
