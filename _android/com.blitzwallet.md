---
wsId: 
title: Blitz Wallet
altTitle: 
authors:
- danny
users: 1000
appId: com.blitzwallet
alternativeStores: 
appCountry: 
released: 2025-09-29
updated: 2026-05-01
version: 0.7.9
reviews: 
website: https://blitzwalletapp.com/
repository: https://github.com/BlitzWallet/BlitzWallet
icon: com.blitzwallet.png
bugbounty: 
meta: ok
verdict: sourceavailable
date: 2025-11-03
signer: 
twitter: blitzwalletapp
social:
- https://www.youtube.com/@BlitzWalletApp
redirect_from: 
developerName: Blitz Wallet
builds: 
features:
- camera
- fingerprint
- foss
- liquid
- ln
- multiAccount

---

## App Description

**Blitz Wallet** is an open-source Bitcoin and Lightning wallet. The app's logo has a certain familiarity.

It supports on-chain Bitcoin and Lightning transactions.
  

## Analysis

We installed the app and created a BTC wallet with send/receive functions. We found its repository and confirm that it is **source-available**.

{% include featureEvidence.html feature="ln" quote="Blitz Wallet is a React Native application that allows users to interact with the Bitcoin Lighting Network in a self-custodial way." source="GitHub README" %}

{% include featureEvidence.html feature="liquid" quote="Using a Liquid QR Code" source="GitHub README" %}

{% include featureEvidence.html feature="fingerprint" quote="Opt-in Biometric login" source="GitHub README" %}

{% include featureEvidence.html feature="foss" quote="Blitz is released under the terms of the Apache 2.0 license. See LICENSE for more information." source="License" %}

{% include featureEvidence.html feature="multiAccount" quote="Ability to create sub-accounts within wallet" source="GitHub README" %}

{% include featureEvidence.html feature="camera" quote="From camera roll" source="GitHub README" %}