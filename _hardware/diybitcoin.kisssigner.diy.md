---
title: KISS Signer DIY
appId: diybitcoin.kisssigner.diy
authors:
- danny
released: 2026-07-12
discontinued: 
updated: 2026-09-26
version: 0.1.0-beta11
binaries: https://github.com/DIYbitcoin/kiss-signer/releases
dimensions: 
weight: 
provider: DIYbitcoin
providerWebsite: https://diybitcoin.github.io/kiss-signer/
website: https://diybitcoin.github.io/kiss-signer/
shop: 
country: 
price: 
repository: https://github.com/DIYbitcoin/kiss-signer
icon: diybitcoin.kisssigner.diy.webp
bugbounty: 
meta: ok
verdict: sourceavailable
date: 2026-10-05
signer: 
twitter: KISS_signer
social:
- https://t.me/KISS_signer
- https://x.com/DIYbitcoin
builds: 
features:
- foss
- selfBuild
- airGapped
- camera

---

## Project Description

KISS Signer is firmware for an airgapped, single-sig Bitcoin signing device that hides behind a fruit-slashing arcade game: the device boots into a playable game, and drawing the word "KISS" on the menu opens the signer. The idea is credited to {% include walletLink.html wallet='hardware/bowser' verdict='true' %}, the Tetris-masked DIY wallet.

From the project's README:

> An airgapped single-sig Bitcoin signer hidden behind a fruit slashing arcade game.
>
> Experimental beta firmware. Do not trust it with meaningful funds.

This is a **do-it-yourself project**. There is no assembled product and nothing to buy from the provider. The user buys one of three off-the-shelf ESP32-P4 development boards with a touch screen, camera and microSD slot, then flashes the firmware over USB. The README states "No soldering":

- Guition JC4880P443C, 4.3in, 800×480
- Waveshare ESP32-P4-WIFI6-Touch-LCD-3.5, 3.5in, 480×320
- Guition JC1060P470C, 7in, 1024×600

The firmware is written in C on ESP-IDF and vendors libwally-core, cUR, quirc and an SLH-DSA implementation, each under its own license (`THIRD_PARTY_NOTICES.md`). The project's own code is MIT licensed. Firmware images are published as GitHub releases together with `SHA256SUMS`, a PGP signature over it, and a browser-based install page. Development started in July 2026 and the latest release at the time of writing is 0.1.0-beta11 from 2026-09-26.

## Analysis

### Can the private keys be created offline? - ✔️

Yes. Seeds are generated on the device from the camera, the chip's hardware RNG and user input, or from dice rolls, coin flips or a blind word draw that the user can check independently. The device has no network path: the ESP32-P4 has no radio of its own, and the README says the boards' separate radio chip "is held in reset from the first instruction of every boot".

### Are the private keys shared? - ✔️

No, with one caveat worth knowing. PSBTs move by animated QR (BC-UR) or SD card only. The seed can live in flash, on an SD card sealed to the device, or in RAM only. The README is explicit that the flash option is "unencrypted in this beta", and the boards carry no secure element, so physical access to the device is the main threat to the keys.

### Does the device display the receive address for confirmation? - ✔️

Yes. The README's walkthrough shows a receive screen with the address and its QR code on the device.

### Does the interface have a display screen and buttons which allows the user to confirm transaction details? - ✔️

Yes. All three supported boards have a touch screen. The sign screen shows every output, the fee and the change, re-derived on the device, before a hold-to-sign gesture.

### Is it reproducible? - ❓

**Not yet tested by WalletScrutiny.** The project claims reproducible builds via Docker and a pinned ESP-IDF toolchain image, and its CI rebuilds every push on amd64 and arm64 and compares the results. Two things a verifier should know before trying:

- The published `.bin` files are ECDSA-signed on the maintainer's machine, and the project's own `reproducible-build.yml` states that signatures are not deterministic, so the SHA-256 in `SHA256SUMS` can not be reproduced byte for byte. The project's answer is a `KISS_UNSIGNED=1` build; a comparison has to strip the signature block from the published image and compare the unsigned application.
- ESP-IDF embeds a hash of the ELF, including debug sections, into the image, so the project reports a small expected difference between hosts of different architectures.

The project's CI checks that difference rather than just stating it: `tools/check_repro_match.py` compares the unsigned amd64 and arm64 builds of each board and fails on any byte outside the embedded ELF hash and the two checksum fields that depend on it (the image checksum byte and the trailing image SHA-256). It also compares the bootloader, partition table and OTA data byte for byte. The encrypted-release build is built on amd64 only and is not part of this comparison. This is the project comparing two of its own builds, not an independent verification.

Until someone outside the project has built and compared it, we make no claim either way.

### Further notes

- **Beta software.** The project itself says not to trust it with meaningful funds, and the roadmap states that nobody outside the project has reviewed the code.
- **Duress keys.** Drawing KISS alone opens decoy keys without a passphrase; the real keys sit behind a user-chosen swipe and the passphrase.
- **Firmware updates** from SD card are checked on the device against an ECDSA and a post-quantum SLH-DSA signature held in the running firmware. A self-builder therefore generates their own update-signing key (`docs/installer/SIGNING.md`); the build script refuses to produce an installable image without one, and its `KISS_UNSIGNED=1` mode yields a reproducibility-only image that a device will not accept as an update.

{% include featureEvidence.html feature="foss" quote="KISS Signer's own source and documentation are licensed under the MIT License (see LICENSE)." source="[THIRD_PARTY_NOTICES.md](https://github.com/DIYbitcoin/kiss-signer/blob/main/THIRD_PARTY_NOTICES.md)" comment="Firmware source is published at github.com/DIYbitcoin/kiss-signer. Vendored components keep their own OSI-approved licenses." %}

{% include featureEvidence.html feature="selfBuild" quote="Runs on three ESP32-P4 boards with a touch screen, camera and microSD slot. No soldering." source="[GitHub README](https://github.com/DIYbitcoin/kiss-signer#readme)" comment="Off-the-shelf development boards, a documented Docker build (tools/build_release.sh) and an esptool flashing recipe. No assembled product is sold." %}

{% include featureEvidence.html feature="airGapped" quote="Airgapped. PSBTs move by QR (BC-UR) or SD card. The radio chip is held in reset from the first instruction of every boot." source="[GitHub README](https://github.com/DIYbitcoin/kiss-signer#readme)" comment="The release build fails to link if any radio or networking symbol is present, per docs/security-plan.md." %}

{% include featureEvidence.html feature="camera" quote="New seeds mix four sources: the camera, the chip's hardware RNG, your taps and timing." source="[GitHub README](https://github.com/DIYbitcoin/kiss-signer#readme)" comment="The camera scans animated BC-UR QR codes for PSBTs and feeds seed entropy; all three supported boards ship with one." %}
