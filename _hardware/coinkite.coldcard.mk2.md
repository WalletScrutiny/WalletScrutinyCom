---
title: Coinkite Coldcard Mk 2
appId: coinkite.coldcard.mk2
authors:
- danny
- mohammad
- leo
released: 2019-04-06
discontinued: 
updated: 2023-06-26
version: v4.1.9
binaries: https://coldcard.com/downloads/
dimensions: 
weight: 
provider: Coinkite
providerWebsite: https://coinkite.com/
website: https://coldcard.com/
shop: 
country: CA
price: 119.97USD
repository: https://github.com/Coldcard/firmware
issue: 
icon: coinkite.coldcard.mk2.png
bugbounty: https://coinkite.com/responsible-disclosure
meta: discontinued
verdict: sourceavailable
appHashes: 
date: 2023-10-08
signer: 
twitter: COLDCARDwallet
social:
- https://t.me/coldcard
features: 

---

**Update 2023-10-08**: v4.1.9 is also reproducible

**Update 2023-06-22**: Since the ColdCard Mk2's firmware is the same as the ColdCard Mk3, v.4.1.8, the Mk2 will inherit the same verdict as {% include walletLink.html wallet='hardware/coldcardMk3' verdict='true' %}. 

**Update 2022-10-25**: The [ColdCard website](https://coldcard.com/downloads/) states that the latest
firmware update (4.1.6) for the MK3 is the same as the MK2. Pending verification
for v4.1.6, we'll mark this review as a work-in-progress.

If you are a user of the Mk2, please check the
{% include walletLink.html wallet='hardware/coldcardMk3' verdict='true' %} for
your binary updates' reproducibility. As this product still is being used by
many, we might update the review in tandem with the Mk3 despite being out of
production.

### Old Review

## Background 

The {{ page.title }} has been obsoleted by the manufacturer and is no longer available commercially. 

Ledger [disclosed](https://blog.ledger.com/coldcard-pin-code/) that the Mk2 may be susceptible to a Laser Fault Injection attack. 

> The security scheme of the Coldcard Mk2 wallet is well designed and relies mainly on the ATECC508A secure memory, which is a smart design decision. The equipment required to perform the physical attack of the ATECC508A is expensive: about $200k, which limits the potential attackers.

Above they briefly state how the attack is performed: 

> We physically injected a fault during the execution of the secure memory to bypass the access conditions verification of a targeted data slot. This is an invasive attack which requires physical access to the secure memory die:


## Product Description

### Firmware Version 2.0.2

> - BIP-39 Passphrase support: enter up to 100 characters to create new wallets from your existing seed words. Each is a completely independent wallet to Electrum and PSBT files, so please make note of the extended master fingerprint (eight hex digits).
- Support for Mark2 hardware, with membrane keypad replacing touch interface.
- Adds activity light during MicroSD card read/write (Mk2 only)
- New command: "Lock down seed" which converts BIP-39 seed words and passphrase into the master xprv and saves that as new wallet secret.  Locks in the passphrase, deletes seed words.
- New bootrom, version 1.2.1 with Mk2 hardware support and improved one-wire bus MitM defences.
- Bugfix: extra keypress occurs during certain interactions involving key repeat.
- (in 2.0.1) bugfix: underscore/space indicator shown on Settings > Idle Timeout menu
- (in 2.0.2) Page up/down on long text displays with 7/9 keys
- (in 2.0.2) Public summary file now includes extended master key fingerprint near top of file.
- (in 2.0.2) Bugfix: signing larger transactions could fail due to lack of memory

## Analysis 

As mentioned above, the {{ page.title }} has been obsoleted by the manufacturer.
