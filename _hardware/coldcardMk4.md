---
title: Coldcard Mk4
appId: coldcardMk4
bitcoinOrgId: coldcard
authors:
- danny
- leo
- mohammad
- keraliss
released: 2022-05-01
discontinued: 
updated: 2026-07-31
version: 5.6.0
binaries: https://coldcard.com/downloads/
dimensions:
- 86
- 50
- 7.5
weight: 30
provider: Coinkite
providerWebsite: 
website: https://coinkite.com/
shop: https://store.coinkite.com/store/mk4
country: CA
price: 158USD
repository: https://github.com/Coldcard/firmware
icon: coldcardMk4.png
bugbounty: 
meta: ok
verdict: sourceavailable
date: 2025-09-26
signer: 
twitter: COLDCARDwallet
social:
- https://t.me/coldcard
builds: 
features:
- multiSig
- secEl
- nfc

---

<div class="alertBox"><div>
⚠️ Warning (2026-08-02): Seeds generated on this device with firmware before 5.6.0 (Edge 6.6.0X) have as little as ~72 bits of entropy instead of the intended 128 and may be predictable. Coinkite advises updating the firmware and generating a new seed. Seeds created with 50 or more independent dice rolls are not affected. See <a href="https://blog.coinkite.com/coldcard-mk3-seed-generation-warning/">Coinkite's security advisory</a> and the <a href="https://coldcard.com/docs/upgrade/">official firmware update instructions</a>.
</div> </div>

{% include featureEvidence.html feature="multiSig" source="Review" quote="More multisig wallets possible" %}
{% include featureEvidence.html feature="secEl" source="Review" quote="Even more security, Dual SE (Secure Elements)" %}
{% include featureEvidence.html feature="nfc" source="Review" quote="NFC Tap for all data types, PSBT, Address, etc..." %}

## Product Description 

The ColdCard Mark 4 is CoinKite's latest iteration of the ColdCard series. At the time of this writing, the Mark 4 is still in pre-order. The current product in the series is the {% include walletLink.html wallet='hardware/coldcardMk3' verdict='true' %}. 

Claimed features of the Coldcard Mark 4:

> - USB-C Connector
> - Unlimited Memory, no Bitcoin Transaction size restrictions
> - NFC Tap for all data types, PSBT, Address, etc...
> - Slide Cover
> - Even more security, Dual SE (Secure Elements)
> - Extensive duress PIN optionality
> - Multi-vendor SE
> - USB Virtual Disk mode
> - New 2x secure elements design (multi vendor)
> - New plastic
> - Faster Processor

Specs:

> - Speed: 120 Mhz main CPU (was 80Mhz)
> - Memmory: 840kb + 8M RAM (was only 360kb) - This is where we process transactions.
> - Flash memory: for firmware doubled! (now ~1.5M, was ~700M)
> - Settings memory: now 512kb (was 4kb)
> - PSRAM used instead of flash to hold PSBT and Transaction (faster workspace)
> - Replaceable OLED display (same size, resolution but better supplier)
> - Hardware SHA256 & AES engine (faster encryption/decription)
> - Multi-vendor dual Secure Element [SE] new design (Microchip 608A + )
> - New USB LED flashes when USB is active
> - USB-C connector
> - NFC V capability and exposed trace for permanent disable

Functions: 

> - Unlimited transaction size
> - More multisig wallets possible
> - Firmware upgrade more secure, faster: 15 seconds using USB vs. 2 minutes
> - Nearly same great price when you add inflation!
> - Boots much faster
> - New "trick pins" allow for endless duress labyrinth. Instant wipe or brick or wipe and continue into duress, etc...
> - Sliding case cover protects screen when COLDCARD is hidden and not in use
> - NFC communications integrated
> - USB disk emulation for simple use w/ web browsers and other PSBT sources
> - Bootrom contains anti-chip shouter/glitching protections which reduce timing certainty
> - Countdown to login feature improved: fast wipe
External settings chip removed. Setting now internal to MCU (faster, more space for settings)
> - Kill-key feature: press key N while phishing words shown -> fast wipe+stop (not silent)
> - Debug serial port moved to pins, rather than being virtual over USB
