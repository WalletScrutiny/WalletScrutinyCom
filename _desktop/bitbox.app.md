---
title: Shift Crypto Bitbox App
appId: bitbox.app
authors:
- danny
released: 2017-11-29
discontinued: 
updated: 2025-03-18
version: 4.47.2
binaries: 
provider: Shift Crypto AG
providerWebsite: https://shiftcrypto.ch
website: https://bitbox.swiss/app/
repository: https://github.com/BitBoxSwiss/bitbox-wallet-app
issue: 
icon: bitbox.app.png
bugbounty: https://shiftcrypto.ch/bug-bounty-program
meta: ok
verdict: nowallet
date: 2025-04-25
reviewArchive: 
twitter: ShiftCryptoHQ
social: 
features: 

---

## Supported Devices

- {% include walletLink.html wallet='hardware/bitbox01' verdict='true' %}
- {% include walletLink.html wallet='hardware/bitBox2' verdict='true' %}

## App Description

The BitBoxApp is a desktop application developed by Shift Crypto to manage the BitBox02 hardware wallet. It has an Electrum backend. It can only work if there is a Bitbox device attached. Key storage and generation happens only on the device, making this a companion app as described.

Without the hardware device, this app could **not fully function as a wallet**. 