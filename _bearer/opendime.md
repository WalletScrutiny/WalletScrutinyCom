---
title: Opendime
appId: opendime
authors:
- kiwilamb
- felipe
- leo
- danny
released: 2016-04-01
discontinued: 
updated: 
version: 
binaries: 
dimensions: 
weight: 
provider: 
providerWebsite: 
website: https://opendime.com/
shop: https://store.coinkite.com/store/opendime
country: CA
price: 49USD (3 pack)
repository: 
issue: 
icon: opendime.png
bugbounty: 
meta: ok
verdict: sealed-plainkey
date: 2022-10-31
signer: 
reviewArchive:
- date: 2021-07-11
  version: ''
  appHash: 
  gitRevision: 
  verdict: noita
twitter: COLDCARDwallet
social:
- https://github.com/opendime

---

## Updated Verdict 

1. The user plugs the device via USB and generates entropy by saving a random file on the device.
2. To have access to the private key, the user must poke a hole through a seal on the device.
3. The device's private keys are then displayed via a text file, where it can be imported to another wallet.

## Verdict

To spend the funds, the private keys need to get exposed to potentially insecure
systems. A virus on that system could empty the wallet the second the device
gets plugged into the USB port.
