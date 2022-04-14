---
title: Chelpis Kelvin Wallet
appId: checlpis.kelvinwallet
authors:
- danny
released: 
discontinued: 
updated: 
version: 
binaries: 
dimensions: 
weight: 
provider: Chelpis Co., Ltd.
providerWebsite: https://www.chelpis.com/
website: https://www.kelvinwallet.com
shop: https://www.kelvinwallet.com/product-page
country: TW
price: 3000TWD
repository: 
issue: 
icon: chelpis.kelvinwallet.png
bugbounty: 
meta: ok
verdict: nosource
date: 2022-04-12
signer: 
reviewArchive: 
twitter: 
social: 
---

## Product Description 

From the {{ page.title }} [homepage](https://www.kelvinwallet.com/):

> - "First Quantum Proof crypto-wallet"
- Quantum-safe OS (Quantum-safe digital signature scheme)
- Large screen with 3 buttons 
- Security Chip for 30 years life
  - Private keys never leave the device and are protected by a CC EAL5+ secure element, locked by your PIN, with sophisticated countermeasures against various kinds of physical attacks.
>  
> All cryptocurrency transactions are isolated, displayed, confirmed, and signed on the hardware device. Cryptographic keys never leave the device and are protected by a CC EAL5+ secure element, locked by your PIN code, which provides strong countermeasures against attackers even with physical access to the device. 
>
> All versions of MCU firmware are cryptographically signed, and the secure boot mechanism prevents it from running at all if any bit of the code is manipulated by attackers. All your funds remain secure even if your PC/laptop gets infected with malware. Even if some attacker steals your cold wallet, the device won't function at all without the knowledge of your PIN.  

## Analysis 

Since Chelpis claims that it is "the best USB-Type C interface wallet" device, we assume that it connects to a computer via USB. 

We could not find documentation on how the {{ page.title }} is "Quantum Proof". Social media posts about the Chelpis were last seen in 2018-2019, but the product is still accessible via their homepage's shopping cart. We could not find hardware specification for the device. 

We were able to locate what we assume to be [Chelpis' repository](https://github.com/orgs/chelpis/repositories?type=all), **however we could not locate which specific repository contains the firmware.** 

No mention was made about whether the device provides mnemonic backups. 

We reached out to them via email since we could not verify if the Kelvin Wallet twitter account is actually theirs. We await their reply. At the interim, this project would do better to provide more transparency regarding their claims. 


