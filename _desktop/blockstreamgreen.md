---
title: Blockstream Green
appId: blockstreamgreen
authors:
- danny
released: 2020-05-21
discontinued: 
updated: 2026-03-04
version: 3.1.0
binaries: 
provider: Blockstream
providerWebsite: https://blockstream.com/
website: https://blockstream.com/green/
repository: https://github.com/Blockstream/green_qt
icon: blockstreamgreen.png
bugbounty: 
meta: ok
verdict: sourceavailable
date: 2025-08-06
twitter: Blockstream
social: 
builds: 
features:
- foss
- liquid
- ln
- multiSig

---

## App Description

Blockstream App is a desktop application for managing Bitcoin wallets on Windows, macOS, and Linux, designed to give users direct control over their keys and transactions.

It supports Bitcoin as its primary network, with optional functionality for Liquid and Lightning depending on account configuration and user choice.

The app includes features such as multisignature wallets, hardware wallet integration (including Blockstream Jade), transaction history and coin management, and built-in tools for receiving, sending, and monitoring balances.

## Analysis

The app is **source-available**

{% include featureEvidence.html feature="foss" quote="Blockstream is released under the terms of the GNU General Public License. See LICENSE for more information or see https://opensource.org/licenses/GPL-3.0" source="GitHub README" %}

{% include featureEvidence.html feature="multiSig" quote="It supports Bitcoin as its primary network, with optional functionality for Liquid and Lightning depending on account configuration and user choice. The app includes features such as multisignature wallets, hardware wallet integration (including Blockstream Jade), transaction history and coin management, and built-in tools for receiving, sending, and monitoring balances." source="App Description" %}

{% include featureEvidence.html feature="liquid" quote="It supports Bitcoin as its primary network, with optional functionality for Liquid and Lightning depending on account configuration and user choice." source="App Description" %}

{% include featureEvidence.html feature="ln" quote="It supports Bitcoin as its primary network, with optional functionality for Liquid and Lightning depending on account configuration and user choice." source="App Description" %}