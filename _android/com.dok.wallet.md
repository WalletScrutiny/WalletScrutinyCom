---
wsId: DokWallet
title: Dok Wallet
altTitle: 
authors:
- danny
users: 5000
appId: com.dok.wallet
alternativeStores: 
appCountry: il
released: 2020-09-28
updated: 2026-04-06
version: '3.14'
reviews: 15
website: https://dokwallet.com/
repository: 
icon: com.dok.wallet.png
bugbounty: 
meta: ok
verdict: nosource
appHashes: 
date: 2024-07-24
signer: 
twitter: 
social: 
redirect_from: 
developerName: Dok wallet
builds: 
features:
- buyWithCC
- foss
- hd
- multiAccount
- tradeAlts

---

## Update 2024-07-24

We find no evidence that it has changed its policy concerning its source's availability.

## App Description 2023-10-06

> - RESTORE any existing ETH wallet
> - Easily MANAGE all your crypto assets
> - PAY IN CRYPTO simply by scanning a QR-code
> - STORE, RECEIVE, and EXCHANGE a wide variety of cryptocurrencies, such as Bitcoin (BTC), Ethereum (ETH), Bitcoin Cash (BCH), Litecoin (LTD), as well as all other ERC20 tokens.

This app claims to be a non-custodial app that provides users with private keys.

> It is your sole responsibility to keep your 12-word seed phrase in a safe place where you can access it in the future.

## [Terms](https://dokwallet.com/terms.html)

> Moreover4u2 enables You to create one or more digital multi-signature, non-custodial, cryptocurrency wallets for certain supported cryptocurrencies and digital assets (the “Wallet”) that lets You store, send, request and receive supported cryptocurrencies and digital assets. All transactions requested and/or made through the Wallet are irreversible

## Google Play Critical reviews

> [Praveen Panna](https://play.google.com/store/apps/details?id=com.dok.wallet&reviewId=gp%3AAOqpTOFkw6nvFkYV9vsQcoF9sG9bcd9EXYG1S7vZwF34CxBIBuOApFxTZLVL1Q4zMp-HQ7HuEQ7F42CGruq1g0g)<br>
  ★☆☆☆☆ September 7, 2021 <br>
       cant withdraw my assets occurring error please resolve this problem

> [Gregory Johnson](https://play.google.com/store/apps/details?id=com.dok.wallet&reviewId=gp%3AAOqpTOHtnorwBtnmT1hoqjUHdFpEwIMHnGqOJ1vHbYynbiIr1kExzPAu-lvnsEJTTYJeVDm40GOLG9CzolLaAig)<br>
  ★☆☆☆☆ October 20, 2020 <br>
       Can't send Bitcoin out of wallet? App keeps crashing when I try to do so

## Termination Clause 

Section 8 of its Terms and Conditions state that:

> Moreover4u2 may terminate these Terms or suspend Your access to the Services at any time, including, without limitation, in the event of Your alleged or actual misuse of the Services or breach of these Terms.

## App

We downloaded the app and registered. We were then given the choices to "Create a Wallet" or "Import". Choosing "Create a Wallet" displays a 12-word seed phrase. 

We were able to import the wallet using the mnemonics.

Note: When installed on an Android Emulator, its tab name is 'PumaPay' which is the name of another wallet:

{% include walletLink.html wallet='android/com.pumapay.pumawallet' %}

This could hint at the app being a copy of a competitor's product, which would at best be a licensed copy and at worst a fake wallet by hackers too lazy to code their own product.

## Verdict

DokWallet **does not refer to the project as an open-source project** in its website or in any of its documentation. We also [could not find any relevant or related code](https://github.com/search?p=1&q=com.dok.wallet&type=Code) with the appID 'com.dok.wallet' on Github.

{% include featureEvidence.html feature="hd" quote="Most modern Bitcoin wallets, like Dok Wallet, use Hierarchical Deterministic (HD) technology. This means they automatically generate a new receiving address for each incoming transaction." source="Website" %}

{% include featureEvidence.html feature="multiAccount" quote="Can I create multiple wallets on a single device? Certainly, to create an additional wallet, please follow these steps: 1. Navigate to the &quot;Wallets&quot; option located in the menu bar. 2. Click on the plus sign icon. 3. Proceed to create a new wallet using the provided options." source="Website" %}

{% include featureEvidence.html feature="buyWithCC" quote="To purchase cryptocurrencies using a credit card, click the &quot;Buy Crypto&quot; in the main menu or drawer. Select Credit Card , choose your desired asset, enter the amount in EUR or USD , and then click the &quot;Check Best Price&quot; button." source="Website" %}

{% include featureEvidence.html feature="tradeAlts" quote="BUY CRYPTO SWAP CRYPTO" source="Website" %}

{% include featureEvidence.html feature="foss" quote="Dokwallet is a non-custodial, open-source, and secure wallet. Our code is fully transparent and available for review: Mobile App: https://github.com/KM-opensource-crypto-wallet/mobile_app Web App: https://github.com/KM-opensource-crypto-wallet/web_wallet" source="Website" %}