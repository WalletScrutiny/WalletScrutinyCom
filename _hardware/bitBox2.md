---
title: BitBox02
appId: bitBox2
authors:
- leo
- Joko Ono
- Mohammad Rafigh
- danny
- keraliss
released: 2019-09-25
discontinued: 
updated: 2026-01-21
version: 9.25.0
binaries: https://github.com/BitBoxSwiss/bitbox02-firmware/releases
dimensions:
- 55
- 25
- 9.6
weight: 12
provider: 
providerWebsite: 
website: https://shiftcrypto.ch/
shop: https://shiftcrypto.shop/en/products/bitbox02-bitcoin-only-4/
country: CH
price: 149EUR
repository: https://github.com/BitBoxSwiss/bitbox02-firmware
issue: 
icon: bitBox2.png
bugbounty: 
meta: ok
verdict: sourceavailable
appHashes:
- 36895857c346c1fbd0d206853b7031e985c1a959e9f7f9396a7ae94dfffa9679
date: 2025-07-18
signer: 
twitter: ShiftCryptoHQ
social:
- https://www.linkedin.com/company/shift-crypto
- https://www.facebook.com/Shiftcrypto
- https://www.reddit.com/r/BitBoxWallet
builds:
- arch: arm
  types:
  - multi
  - btc-only
features:
- foss
- hd
- multiSig
- secEl

---

## Device Description

The BitBox02 is a hardware wallet developed by Swiss company Shift Crypto for securely storing and managing cryptocurrencies. It stores private keys offline and uses a minimalist, touch-sensitive design for device interaction. The BitBoxApp companion software enables users to send, receive, and manage coins across Bitcoin, Ethereum, Litecoin, Cardano, and more than 1,500 other tokens. The device offers microSD card backup and an optional Bitcoin-only firmware variant.

All firmware and software are open-source, allowing public review and transparency. The BitBox02 is manufactured in Switzerland and includes features like native desktop app support, U2F authentication, and multisig compatibility for advanced users seeking greater control and privacy in their crypto storage.

{% include featureEvidence.html feature="hd" quote="Import 12, 18 or 24 word BIP39 mnemonics" source="GitHub README" %}

{% include featureEvidence.html feature="secEl" quote="the secure element (ATECC608B) via I2C" source="GitHub README" %}

{% include featureEvidence.html feature="multiSig" quote="Register multisig account with device, automatically verify for secure send/receive" source="Website" %}

{% include featureEvidence.html feature="foss" quote="Both the BitBoxApp and firmware are fully open source" source="Website" %}
