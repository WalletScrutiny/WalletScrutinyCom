---
title: CoinKite Coldcard Mk 1
appId: coinkite.coldcard.mk1
authors:
- danny
released: 2018-07-25
discontinued: 
updated: 2019-12-19
version: v3.0.6
binaries: 
dimensions: 
weight: 
provider: Coinkite
providerWebsite: https://coinkite.com/
website: https://coldcard.com/
shop: 
country: CA
price: 49.99USD
repository: https://github.com/Coldcard/firmware
issue: 
icon: coinkite.coldcard.mk1.png
bugbounty: https://coinkite.com/responsible-disclosure
meta: obsolete
verdict: wip
date: 2022-05-19
signer: 
reviewArchive: 
twitter: COLDCARDwallet
social:
- https://t.me/coldcard

---

## Update 2022-10-25

The ColdCard Mk1 is no longer being sold by the manufacturer. v3.0.6 is listed as the final release on the official website's [download page.](https://coldcard.com/downloads/) We'll be marking this as a work-in-progress as this is already obsolete.

## Background

Announced on [December 8, 2017](https://blog.coinkite.com/coldcard-annoucement/), the {{ page.title }} is the first iteration of Coinkite's series of devices. It is now obsoleted by the manufacturer and is no longer for sale. 

## Product Specifications

> - Can sign transactions and can be used offline
- BIP39 based: backup passphrase, sub-accounts, unlimited payment addresses
- No specialized hardware required
- Private key is secured in a dedicated security chip
- MicroSD card slot of backup and data storage
- Open source using Micropython
- Full-sized numeric keypad
- 128x64 OLED screen

### Firmware Updates

v1.0.2

> - Add support for SLIP-132
- yprv/zprv keys can now be imported
- public.txt file includes both SLIP-132 and BIP-32 values where needed (segwit cases)
- test cases added to match
- Can create Electrum skeleton wallet for Segwit Native and Segwit P2SH now.
- caveat: the plugin is not ready yet for P2SH/Segwit, but Segwit native is fine
- Improvements in 'public.txt' output:
- add SLIP-132 values where we can
- correct names when used for Litecoin
- Improvements to backup and restore
- can now restore cleartext backups (for devs only!)
- fix "Unable to open ... /sd/backup.7z" error

v1.1.0

> - Allow setting max network fee to a number of possible levels, or disable it (was previously fixed to 10%). Thanks to @crwatkins for this suggestion.
- Touch improvements: two new setting, which are between the old 'Least Sensitive' and 'Most Sensitive' settings. New menu text.
- Touch sensitivity preference is applied before login, so PIN entry is easier.
- Although we do not use the bech32_decode() function recently found to have an buffer overflow bug, we've included the fix into our fork of the affected library. This change, and the original bug, does not affect the Coldcard firmware in any way.
- Correctly include witness data in transactions when signing based on witness UTXO data (thanks to @SomberNight)
- Bugfix: Fix divide-by-zero if transaction sends zero amount out (only possible if network fee equals 100% of inputs).

## Analysis 

The product is no longer commercially available and is **obsoleted** by the manufacturer.