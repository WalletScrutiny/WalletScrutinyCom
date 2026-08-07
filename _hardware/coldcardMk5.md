---
title: Coldcard Mk5
appId: coldcardMk5
authors:
  - danny
released: 2026-03-10
discontinued:
updated: 2026-07-31
version: 5.6.0
binaries: https://coldcard.com/downloads/mk
dimensions:
  - 86
  - 50
  - 9
weight: 55
provider: Coinkite, Inc.
providerWebsite: https://coinkite.com
website: https://coldcard.com/mk5
shop: https://store.coinkite.com/store/category/mk5
country: CA
price: 189USD
repository: https://github.com/Coldcard/firmware
icon: coldcardMk5.png
bugbounty: https://coldcard.com/resources/security/report-a-security-issue
meta: ok
verdict: sourceavailable
date: 2026-08-07
signer:
twitter: COLDCARDwallet
social:
  - https://t.me/coldcard
  - https://www.linkedin.com/company/coinkite
  - https://www.facebook.com/CoinKite
builds:
features:
  - hd
  - multiSig
  - nfc
  - secEl
---

<div class="alertBox"><div>
⚠️ Warning (2026-08-02): Seeds generated on this device with firmware before 5.6.0 (Edge 6.6.0X) have as little as ~72 bits of entropy instead of the intended 128 and may be predictable. Updating the firmware does not repair a seed that was already created — Coinkite advises updating, generating a new seed on the fixed firmware, and moving any funds to it. Seeds are not affected by this issue alone only if at least 50 fair, independent, private dice rolls were added when the seed was created, those rolls were never recorded or otherwise exposed, and the seed words used are the ones shown after adding them. You must roll physical dice yourself and enter each result — the device does not generate the rolls for you. See <a href="https://blog.coinkite.com/coldcard-mk3-seed-generation-warning/">Coinkite's security advisory</a> and the <a href="https://coldcard.com/docs/upgrade/">official firmware update instructions</a>.
</div> </div>

## Product Description

The Coldcard Mk5 is Coinkite's compact, Bitcoin-only signing device and the successor to the
{% include walletLink.html wallet='hardware/coldcardMk4' verdict='true' %}. It was introduced on
March 10, 2026. The Mk5 is primarily a physical and usability redesign: Coinkite states that it
runs exactly the same firmware image as the Mk4 and that both devices will receive the same
firmware updates.

Compared with the Mk4, the Mk5 has a larger 1.54-inch display protected by Gorilla Glass, a
redesigned tactile numeric keypad, a bottom-mounted USB-C connector, improved NFC performance,
and a tougher case. It has no internal battery and must be continuously powered over USB-C.

Official specifications:

> - Size with cover: 87 x 52 x 10.3 mm
> - Size without cover: 86 x 50 x 9 mm
> - Weight: approximately 55 g
> - Power: 65 mA at 5 V over USB-C
> - Connectors: USB-C and one MicroSD slot
> - 1.54-inch monochrome display protected by Gorilla Glass
> - Optional NFC-V communication
> - Protective sliding cover

The Mk5 does not have Wi-Fi, Bluetooth, a battery, or a camera. It can display QR codes but
cannot scan them. For air-gapped use it can be powered from an AC adapter or battery pack and
exchange PSBT files using MicroSD. NFC and USB data are optional interfaces.

## Security Model

The Mk5 retains the Mk4 security architecture. It uses secure elements from two manufacturers,
Microchip's ATECC608 family and Maxim's DS28C36B, together with the main microcontroller to
protect the wallet secret. Firmware is checked during startup and the device uses green
"Genuine" and red "Caution" LEDs to report the result. Its clear case and numbered,
tamper-evident shipping bag are intended to make physical changes easier to notice.

The PIN is entered in two parts. After the prefix, the device displays two device-specific
anti-phishing words that the user should recognize before entering the suffix. The secure
element permanently disables the device after 13 failed PIN attempts. Optional Trick PINs can
open a duress wallet, impose delays, wipe the seed, or brick the device.

The firmware supports BIP-39 seed words and passphrases, encrypted MicroSD backups, temporary
seeds, Seed Vault, Seed XOR, BIP-85-derived entropy, single-signature and multisignature
wallets, PSBT signing, spending policies, and WIF Store. Compatible coordinator software
includes Sparrow, Nunchuk, Bitcoin Core, Electrum, BlueWallet, Specter Desktop, Wasabi, and
other listed coordinators. Coinkite says other wallets following the BIP-174/PSBT standards
should also be compatible.

{% include featureEvidence.html feature="hd" source="[Mk5 product page](https://coldcard.com/mk5)" quote="the 24-word seed phrase for your BIP39 wallet" %}

{% include featureEvidence.html feature="multiSig" source="[Mk5 compared to Mk4](https://coldcard.com/docs/coldcard-mk5/)" quote="Expanded multisig capabilities: handle bigger, more complex transactions." %}

{% include featureEvidence.html feature="nfc" source="[Mk5 compared to Mk4](https://coldcard.com/docs/coldcard-mk5/)" quote="NFC-V compatible: tap to transmit all data types, including PSBTs, addresses, and XPUBs." %}

{% include featureEvidence.html feature="secEl" source="[Mk5 product page](https://coldcard.com/mk5)" quote="COLDCARD uses two Secure Elements, from different vendors, to protect your Bitcoin." %}

## Firmware and Reproducibility

Coinkite distributes the same signed, timestamped `*-mk-coldcard.dfu` artifact for Mk4 and Mk5.
Its official header declares `hw_compat: 0x28`, meaning Mk4+Mk5, and the public repository uses
`MK-Makefile` to build the shared firmware. The local reproducibility reports found the
firmware payload byte-identical outside the 128-byte header excluded by Coinkite's comparison
method; that header was inspected separately, not reproduced. Consequently, a reproducibility
result for a shared Mk firmware artifact applies to both physical products; a separate Mk5
build is not required.

The first official shared Mk4/Mk5 release was version 5.5.0. Older `mk4-coldcard.dfu` files in
the 5.4.x series were released for Mk4 only and do not apply to Mk5. Standard versions 5.5.0
and 5.5.1 and Edge version 6.5.0X were affected by the seed-generation vulnerability described
above. Standard 5.6.0 and Edge 6.6.0X correct new seed generation.

The firmware source is publicly available and Coinkite provides a reproducible-build procedure.
However, the repository applies the Commons Clause, which removes permission to sell products
or services whose value substantially derives from the software. It is therefore classified
here as **source available**, rather than free and open-source software.
