---
title: Foundation Passport Prime
appId: passportprime
bitcoinOrgId: passport
authors:
- danny
released: 2026-03-16
discontinued: 
updated: 2026-07-17
version: 1.3.0
binaries: https://github.com/Foundation-Devices/KeyOS-Releases/releases
dimensions:
- 56
- 110
- 11
weight: 93
provider: 
providerWebsite: 
website: https://foundation.xyz/
shop: https://foundation.xyz/buy-passport-prime/
country: US
price: 349USD
repository: https://github.com/Foundation-Devices/KeyOS
icon: passportprime.png
bugbounty: https://foundation.xyz/security/
meta: ok
verdict: sourceavailable
date: 2026-05-08
signer: 
twitter: FOUNDATIONdvcs
social:
- https://www.linkedin.com/company/foundationdevices
- https://t.me/foundationdevices
- https://www.reddit.com/r/FoundationDevices/
builds: 
features:
- hd
- camera
- nfc
- secEl
- multiSig
- foss
- customNode

---

## Background

{{ page.title }} is the third generation of the Foundation Passport line, succeeding the
{% include walletLink.html wallet='hardware/passportb2' verdict='true' %}.

It is a distinct product from its predecessors: new hardware, new OS, Bluetooth connectivity,
an NFC-card backup system, and an open app platform. It should not be treated as a firmware
update to the Passport Gen 2.

## Operating System

Passport Prime runs **KeyOS**, a Rust microkernel operating system built on
[Xous](https://github.com/betrusted-io/xous-core) — an open-source microkernel originally
developed by bunnie and xobs for the Precursor/Betrusted project. Apps run sandboxed and
communicate by message passing. Each app receives a hardened child seed derived from the master
seed; no app has direct access to the master key.

Foundation requires that all apps distributed through the KeyOS app catalog be open source
and reproducible. Developers may also distribute apps directly to users outside the catalog.

## Product Description

> - Display: 3.5" color IPS touchscreen with Gorilla Glass
> - Battery: 1100 mAh Li-ion (non-removable)
> - Dimensions: 55.5 × 104.8 × 11 mm, 93 g
> - Chassis: Anodized aluminum
> - Security Processor: Microchip SAMA5D2
> - Secure Element: Microchip 608c
> - Connectivity: QuantumLink Bluetooth, NFC, USB-C (charging and data), QR camera
> - Storage: 50 GB encrypted file storage
> - Manufacturing: Assembled in the USA
> - Price: $349

Beyond Bitcoin, Passport Prime supports 2FA/TOTP codes, FIDO2 security keys, multiple
cryptocurrency seeds, BIP-39 passphrases, and encrypted file storage — all managed through
KeyOS.

## Bitcoin Wallet

Passport Prime generates a master key on the device during setup; users can back it up as
BIP-39 seed words ([Foundation FAQ](https://docs.foundation.xyz/faq/home/)).

The wallet supports standard Bitcoin self-custody via PSBTs. Compatible software wallets
include Sparrow, BlueWallet, Nunchuk, Casa, and Theya, among others supporting PSBTs via QR
codes ([Foundation CEO announcement, March 2026](https://x.com/FOUNDATIONdvcs/status/2033634843993526413)). Multisig is supported.

The device communicates with the {% include walletLink.html wallet='android/com.foundationdevices.envoy' verdict='true' %} companion app over
**QuantumLink** — a Bluetooth protocol in which messages are encrypted before reaching the
Bluetooth chip, which is isolated on a dedicated hardware component.

## Backup

**Magic Backup** (recommended) splits the master key into three parts using **2-of-3 Shamir
Secret Sharing** — any two are sufficient for recovery:

- Parts 1 & 2: written to two of the three NFC KeyCards included with the device
- Part 3: stored on the user's phone via Envoy, then synced to iCloud Keychain (iOS) or
  Android Auto-Backup (Android)

In addition, encrypted wallet metadata and settings are continuously synced to Foundation's
servers, identified only by a SHA-256 hash of the master key. Foundation states it cannot
access this data — only the holder of the master key can decrypt it
([Foundation backup docs](https://docs.foundation.xyz/backups/prime/)).

Foundation states it never stores or has access to any part of the private key. Users who
prefer not to use cloud storage can opt for **Manual Backup** instead, using all three KeyCards
or a standard BIP-39 seed word export.

{% include featureEvidence.html feature="hd" quote="BIP39 compliant seed word representation of the Prime Master Key." source="[Foundation backup docs](https://docs.foundation.xyz/backups/prime/)" %}

{% include featureEvidence.html feature="foss" quote="KeyOS is completely open source." source="[Building KeyOS (Foundation blog, Dec 2024)](https://foundation.xyz/2024/12/building-keyos/)" %}

{% include featureEvidence.html feature="secEl" quote="Microchip 608c secure element" source="[Passport Prime product page](https://foundation.xyz/passport-prime)" %}

{% include featureEvidence.html feature="camera" quote="Omnivision camera for QR scanning" source="[Passport Prime product page](https://foundation.xyz/passport-prime)" %}

{% include featureEvidence.html feature="nfc" quote="Dedicated Bluetooth and NFC connectivity chips" source="[Passport Prime product page](https://foundation.xyz/passport-prime)" %}

{% include featureEvidence.html feature="multiSig" quote="Bitcoin multisig." source="[Passport Prime product page](https://foundation.xyz/passport-prime)" %}

{% include featureEvidence.html feature="customNode" quote="Can I connect Envoy to my own Bitcoin node? Yes, Envoy connects using the Electrum server protocol." source="[Foundation FAQ](https://docs.foundation.xyz/faq/home/)" %}

## Reproducibility

Firmware is distributed via
[KeyOS-Releases](https://github.com/Foundation-Devices/KeyOS-Releases/releases), built from
[KeyOS](https://github.com/Foundation-Devices/KeyOS). The GitHub Release asset is named
`release.tar`. The same binary also exists in the release repo branch under the descriptive
name `KeyOS-vX.Y.Z-to-vA.B.C-Update.tar` (e.g. `KeyOS-v1.2.0-to-v1.2.1-Update.tar`) as a
Git LFS object — both are identical in content and SHA-256. GitHub Release downloads also
include a `manifest.json` with signed and unsigned SHA-256 fields (verified for v1.2.1).

## Verification Scope

The subject of verification for this entry is the Passport Prime firmware update binary —
for example `release.tar` for v1.2.1 — built from the
[Foundation-Devices/KeyOS](https://github.com/Foundation-Devices/KeyOS) source repository,
with release metadata in
[Foundation-Devices/KeyOS-Releases](https://github.com/Foundation-Devices/KeyOS-Releases).
KeyOS is the source side of this verification and is not treated as a separate wallet entry.
The verification question is: can the firmware update installed on Passport Prime be reproduced
from the published source? No completed reproducibility verification has been performed yet.

This device is **source-available**.
