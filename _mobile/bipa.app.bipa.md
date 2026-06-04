---
wsId: bipaBR
title: Bipa - Bitcoin, Pix e Cartão
date: 2023-06-14
authors:
- danny
website: https://bipa.app/
twitter: usebipa
features:
- fingerprint
- ln
- buyWithCC
redirect_from:
- /android/bipa.app.bipa/
- /iphone/bipa.app.Bipa/
android:
  appId: bipa.app.bipa
  users: 500000
  appCountry: us
  released: 2021-01-18
  updated: 2026-06-02
  version: 4.2.39
  reviews: 13
  icon: bipa.app.bipa.png
  meta: ok
  verdict: custodial
  developerName: Bipa
iphone:
  appId: bipa.app.Bipa
  idd: '1516842324'
  appCountry: br
  released: 2020-06-30
  updated: 2026-06-01
  version: 4.2.16
  reviews: 9135
  icon: bipa.app.Bipa.jpg
  meta: ok
  verdict: custodial
  developerName: Bipa Ltda

---

## Android

## App Description from Google Play

> DIGITAL ACCOUNT
> - Create a digital account in your own CPF entitled to free PIX and much more.
>
> BITCOIN WALLET
> - Deposit and transfer Bitcoins from your account.
>
> LIGHTING SUPPORT
> - Transfer and Receive Bitcoin using the Lightning Network and pay 0 fee.
>
> DIGITAL WALLET
> - Deposit and withdraw real money, whenever you want.
>
> BUY AND SELL
> - Buy and sell Bitcoin in just a few clicks, with no hidden fees.
> 
> SECURITY
> - All sensitive information and transactions are protected by Face ID or Touch ID. 

## Analysis 

- The app is geo-restricted to Brazilian entities
- A CPF is required 
- Section 2.8 of the [Terms](https://bipa.app/termos-de-uso.pdf) - right to refuse registration to users 
   - Section 2.10 - power to delete user account. 
   - Section 3.1 - opening a user account means opening an account with their partner, Bankly. 
   - Section 5.1.2 - withdrawal of crypto-assets
- We were not able to register, but with the facts from the description and terms, we establish: 
1. The app should have a Bitcoin wallet that can send/receive 
2. There was no mention of private keys
3. This is an app that complies with the regulations of the Central Bank of Brazil, with anti-terrorism, KYC, anti money laundering laws and has the power to bar the user from accessing the account for grounds stated in the terms. 

Therefore, we conclude that this is a **custodial** provider.

{% include featureEvidence.html feature="ln" quote="LIGHTING SUPPORT - Transfer and Receive Bitcoin using the Lightning Network and pay 0 fee." source="Store" %}

{% include featureEvidence.html feature="fingerprint" quote="All sensitive information and transactions are protected by Face ID or Touch ID." source="Store" %}

---

## iPhone

{% include copyFromAndroid.html %}

{% include featureEvidence.html feature="ln" quote="Transfira seu Bitcoin para qualquer carteira — sem taxas, on-chain ou pela Lightning Network." source="Store" %}

{% include featureEvidence.html feature="buyWithCC" quote="COMPRE A PARTIR DE R$1: Deposite via Pix e compre Bitcoin e USDT de forma acessível, sem burocracia." source="Store" comment="The app allows purchasing Bitcoin via Pix (Brazilian instant payment), which functions as a direct buy mechanism within the app." %}
