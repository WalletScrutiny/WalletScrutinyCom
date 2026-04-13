---
title: Specter Desktop Wallet
appId: specter
authors:
- danny
released: 2020-06-30
discontinued: 
updated: 2026-04-09
version: 2.1.7
binaries: 
provider: Crypto Advance GmbH
providerWebsite: 
website: https://specter.solutions
repository: https://github.com/cryptoadvance/specter-desktop
icon: specter.png
bugbounty: 
meta: ok
verdict: sourceavailable
date: 2024-04-25
twitter: SpecterWallet
social: 
builds: 
features:
- companion
- hd
- coinCtrl
- TOR
- airGapped
- camera
- customNode
- multiSig
- ownFullNode

---

{% include featureEvidence.html feature="companion" source="[README](https://github.com/cryptoadvance/specter-desktop#readme)" quote="make a convenient and user-friendly User Interface around Bitcoin Core with a focus on multisignature setup with airgapped signing devices" %}
{% include featureEvidence.html feature="hd" source="[README](https://github.com/cryptoadvance/specter-desktop#readme)" quote="We also support using the Bitcoin Core as a hot wallet, by importing or generating a random BIP39 mnemonic" %}
{% include featureEvidence.html feature="coinCtrl" source="[README](https://github.com/cryptoadvance/specter-desktop#readme)" quote="Transactions & UTXOs" %}

## App Description

Specter Desktop Wallet is a Bitcoin-only, open-source desktop wallet developed by Crypto Advance GmbH, a company based in Munich, Germany, founded in 2019 by Stepan Snigirev and Moritz Weitersheim.

The wallet focuses on self-custody, supporting multi-signature configurations and hardware wallet integration, catering to security-conscious users and advanced setups.

App initialization begins with allowing the user to choose to connect between an Electrum server or Bitcoin Core. Once connected, the user is asked to [connect a signing device](https://specter.solutions/docs/desktop/DeviceCreationGuide/) (hardware wallet). Only then will the user be able to create a wallet. The seed phrases come from the hardware device.

This app should be **for verification.**

{% include featureEvidence.html feature="ownFullNode" quote="Connect Specter to Bitcoin Core" source="GitHub README" %}

{% include featureEvidence.html feature="customNode" quote="Select how to connect to Bitcoin network Electrum server or... ...via Bitcoin Core node." source="GitHub README" %}

{% include featureEvidence.html feature="multiSig" quote="The goal of this project is to make a convenient and user-friendly User Interface around Bitcoin Core with a focus on multisignature setup with airgapped signing devices (aka hardware wallets)." source="GitHub README" %}

{% include featureEvidence.html feature="TOR" quote="You can also run it using Tor, provide SSL certificates to run over https." source="GitHub README" %}

{% include featureEvidence.html feature="camera" quote="Https is especially important because browsers don't allow the website to access the camera without secure connection, and we need camera access to scan QR codes." source="GitHub README" %}

{% include featureEvidence.html feature="airGapped" quote="The goal of this project is to make a convenient and user-friendly User Interface around Bitcoin Core with a focus on multisignature setup with airgapped signing devices (aka hardware wallets)." source="GitHub README" %}