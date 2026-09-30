---
title: Cryobrick Compass
appId: cryobrick.compass
authors:
- danny
date: 2026-04-20
released: 2026-04-03
website: https://www.cryobrick.com
github: https://github.com/cryobrick/compass
provider: Cryobrick
providerWebsite: https://www.cryobrick.com
country: IN
meta: ok
verdict: diy
social: 

---

## Overview

Compass is a Bitcoin signing app for **KaiOS feature phones** (e.g. JioPhone) developed by the Cryobrick project. It is distributed as an OmniSD-compatible ZIP via OmniSD (an unofficial sideloading method requiring developer access) and is licensed under **GPL v3**.

The app presents itself externally as "Offline Maps & Bookmarks" for plausible deniability.

## Features (v0.1.1)

Supports standard Bitcoin primitives including BIP39 seed generation, address derivation, and PSBT signing (exact derivation paths and encryption scheme require code verification):

- BIP39 12-word mnemonic generation and restore
- SegWit address derivation (bc1… format)
- Address Explorer with QR code display
- Export extended public key (e.g. zpub) via QR code
- PSBT signing: import base64 or file → review inputs/outputs/fees → sign → output transaction hex for broadcast
- PIN protection and seed encryption
- Targets KaiOS 2.5 (Firefox 48 engine, 240×320px screen)

## Air-Gap Workflow

The intended workflow pairs Compass with a watch-only wallet on a connected device (e.g. Blue Wallet):

1. Export `zpub` from Compass → import into Blue Wallet as watch-only
2. Build a transaction in Blue Wallet → export as PSBT (base64 or file)
3. Load PSBT into Compass → review and sign → get final transaction hex
4. Broadcast the hex from Blue Wallet or any explorer

At time of writing, QR input via camera appears limited or absent (subject to change); PSBT input is via file (SD card) or paste.

## Source

The source code is [publicly available on GitHub](https://github.com/cryobrick/compass) under GPL v3. The app is built with esbuild-bundled JavaScript targeting ES2015, with library versions pinned for Firefox 48 compatibility.

## Analysis

This is a novel platform for a Bitcoin signing device — a mass-market KaiOS feature phone (~$15–20 USD) repurposed as an air-gapped key manager. The approach is similar in spirit to Krux (repurposed embedded hardware running open-source Bitcoin signing firmware).

Source is available and the license is GPL v3. A build script exists; reproducibility has not yet been verified.

This setup relies on general-purpose consumer hardware without a secure element, so key protection depends on physical control of the device and correct user practices.

The `developer.url` in the KaiOS manifest points to the personal GitHub of [aniketambore](https://github.com/aniketambore), suggesting a small team or individual-led project at this stage.

At this stage, this qualifies as a **diy** setup rather than a production-ready wallet.
