---
title: Foundation Passport Prime
appId: passportprime
authors:
- danny
released: 2026-03-16
discontinued: 
updated: 2026-08-07
version: 1.3.1
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
date: 2026-08-11
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
Git LFS object. For v1.2.1 we confirmed the two are identical in content and SHA-256; we have not
repeated that check for every release. GitHub Release downloads also include a `manifest.json`
with signed and unsigned SHA-256 fields (verified for v1.2.1).

That is how firmware reaches a device — it is not the subject of the automated verification.
`release.tar` is a delta-update archive; what we verify are the individual firmware components
it and the release branch deliver, as set out below.

## Verification Scope

The source of truth for this device is
[Foundation-Devices/KeyOS](https://github.com/Foundation-Devices/KeyOS), with published release
artifacts in
[Foundation-Devices/KeyOS-Releases](https://github.com/Foundation-Devices/KeyOS-Releases).
KeyOS is the source side of this verification and is not treated as a separate wallet entry.

Automated verification covers the individual firmware components Foundation publishes for a
release — 119 of them in each of the three releases we have verified. Those members are
extracted from a firmware image built from source and compared one by one against Foundation's
published copies. The update package a device actually downloads (`release.tar`, also published
in the release branch as `KeyOS-vX.Y.Z-to-vA.B.C-Update.tar`) updates selected installed
components through delta actions; components it does not touch remain as they are or are
delivered separately. Verifying that package end to end is a separate step, demonstrated once by
hand but not yet part of the automated run.

WalletScrutiny has completed reproducibility verifications for
[**v1.2.1**](https://walletscrutiny.com/hardware/passportprime/#verificationId=5a0e5169c32c3f25907cbac4993edb1bf32c47d38f5a99a0efed8490eb351ad4),
[**v1.3.0**](https://walletscrutiny.com/hardware/passportprime/#verificationId=3f80eb574955249ebd51785ae7cc8c55096fd113e92e0a1f655854c514e8d960)
and
[**v1.3.1**](https://walletscrutiny.com/hardware/passportprime/#verificationId=c8cd1ac80f028f25fecd6ce58a1e6da31f3263ef494f67feb3b2635dba00bf0e),
each scoped to the components described below.

## Notes on Firmware Verification

Foundation publishes the source for KeyOS and documents how to rebuild it, so this device can be
checked rather than taken on trust. Reproducibility results are easy to over-read, though, so the
sections below set out in ordinary language exactly what the check covers, what it does not, and
where the remaining gaps are.

### What we are testing

We rebuild the firmware ourselves from Foundation's published source, then compare what we
produced against what Foundation published.

All three releases produced the same 119 of 119 result, but the safeguards around that result
grew stricter over time. The v1.2.1 run made the component comparisons themselves. v1.3.0 added
reverse inventory closure, which detected in-scope release files absent from the build and
required every release path to be classified. v1.3.1 added cryptographic authentication of
Foundation's signatures, resolved the release files to a single commit, and made an unrecognized
path stop the run outright. What follows describes the check as it stands today, noting the
release each safeguard arrived in; the linked reports record exactly which controls applied to
each run.

**The build.** Foundation ships a build definition in which the declared toolchain and
dependencies are pinned to fixed versions. We run their build commands using only their public
source, inside a container whose base image is — from v1.3.1 — pinned by content hash. Where
those pins hold, the rebuilt payloads should match the released ones.

**The comparison.** The firmware is not one file. It is a small operating system assembled from
many parts, and we check **119** of them individually:

- **11 compiled payloads** — the core system image, the recovery image, and nine application
  binaries, all rebuilt from source. KeyOS keeps applications as separate signed programs rather
  than one blob, so the Bitcoin wallet and the Seed Vault — the code that handles keys and
  transactions — are each checked in their own right.
- **108 source-derived files** — the permission manifests that assign each application its
  capabilities, plus fonts, icons and screen assets. These are generated or copied from source
  during the build rather than compiled, and are compared whole-file.

That same 11 + 108 split has held for every release we have verified — 119 of 119 matched, none
mismatched and none missing, in
[v1.2.1](https://walletscrutiny.com/hardware/passportprime/#verificationId=5a0e5169c32c3f25907cbac4993edb1bf32c47d38f5a99a0efed8490eb351ad4),
[v1.3.0](https://walletscrutiny.com/hardware/passportprime/#verificationId=3f80eb574955249ebd51785ae7cc8c55096fd113e92e0a1f655854c514e8d960)
and
[v1.3.1](https://walletscrutiny.com/hardware/passportprime/#verificationId=c8cd1ac80f028f25fecd6ce58a1e6da31f3263ef494f67feb3b2635dba00bf0e)
alike. A future release may ship a different number: the count is read from the build, not
assumed.

The permission manifests are security-relevant because they assign application capabilities. A
swapped manifest can grant an otherwise unchanged application new powers, and a check that looked
only at compiled code would not see it.

**Signatures.** Foundation wraps each signed component in a 2,048-byte signing envelope.
Beginning with v1.3.1, we verify that envelope cryptographically for every signed component,
using Foundation's own `cosign2` tool, and require two *different* signing keys, both listed in
the `KNOWN_SIGNERS` table published in the KeyOS source. Only after that check passes do we strip
the envelope and compare the payload underneath. In the earlier runs the envelope was stripped
without authenticating it, so those comparisons rest on the payload match alone. Our rebuild
cannot reproduce that envelope in any case: we do not hold the private
keys corresponding to the production signatures, and the signed metadata it carries — including
build date — may differ.
(The OTA update package carries a single signature rather than two; the two-key requirement
applies to the signed compiled components.)

**Nothing unaccounted for.** We take the complete file listing of the release and classify every
path in it. Each in-scope component must have a counterpart in our rebuild. Composite and update
artifacts are recorded as deliberately out of scope. From v1.3.0 the listing is also read in the
opposite direction, so that a file Foundation published but we never examined is caught rather
than passed over. In that run, an unrecognized release path triggered a human review before
publication. From v1.3.1, it stops the run automatically — if Foundation ships something new, we
would rather produce no verdict than a verdict that quietly skipped it.

**Pinning.** From v1.3.1, the release files we compare against, and the listing we check them for
completeness against, are both resolved once to a single commit before the build begins, so
nothing can change underneath a run that takes one to two hours. The earlier runs read those
files from a branch that could in principle have moved mid-run.

**The bootloader remains outside the verdict.** It is the small program that starts everything
else. The hash the device shows for it is deliberately normalized: before KeyOS starts, the
bootloader replaces its secret entropy value with the same public default an ordinary rebuild
uses. A hash displayed on a device and the hash of a matching plaintext bootloader image are
therefore directly comparable — the mechanism is sound, and the device is not withholding
anything here.

What is missing is a matching pair to compare. Foundation publishes a plaintext bootloader image
for v1.0.0, but no public KeyOS source for v1.0.0 exists. For v1.2.0 through v1.3.1 the source is
public, but the release repository publishes only encrypted bootloader files. No published
version currently supplies both public source and a public plaintext comparand. WalletScrutiny
therefore cannot complete the comparison from published materials alone.

In July 2026 Foundation
[posted a photograph of a production device](https://github.com/Foundation-Devices/KeyOS/issues/6#issuecomment-4960322079)
showing bootloader 0.2.1, build date 11 March 2026, and its normalized hash. That date precedes
the oldest public KeyOS commit, from 12 March 2026, so the unit was running a factory bootloader
whose source was never published. Our earlier rebuild of the v1.2.1 bootloader was therefore not
a matching comparand, and the difference between the two hashes is not evidence that the shipped
bootloader was built inconsistently.

Foundation's build already prints the normalized plaintext hash it produces. Publishing that hash
for each publicly sourced bootloader build would provide an authoritative comparand for owners
running the same build. Until WalletScrutiny can connect a publicly sourced build to a matching
production-device hash, the bootloader stays outside the verdict.

**What the signature check does and does not prove.** The trusted keys we check against are
published in Foundation's own source code. So a passing check confirms the released files are
validly signed under the keys KeyOS itself declares — it does not independently establish that
those keys belong to Foundation. That would require obtaining them from a source Foundation does
not control.

**Not covered by the automated verification:** the bootloader; the update package described
below; Foundation's `Factory.img` (its contents were compared by hand for v1.2.1, but the
automated run does not treat that image as an artifact or give it a verdict of its own); the
pre-packaged bundles on the GitHub releases page; and the Bluetooth and secure-element firmware.
Those last two are separate components built for separate targets. The Bluetooth firmware has
published source of its own in
[prime-ble-firmware](https://github.com/Foundation-Devices/prime-ble-firmware), so it could be
brought into scope later; the ATECC608c is a Microchip secure element whose internal firmware
Foundation does not publish and did not write. Neither was tested here.

### What actually gets on your device

There is a gap between what the automated check covers and what you install, and it is worth
stating precisely.

What your Passport Prime downloads is `release.tar`: a signed **delta-update archive**. Rather
than a complete replacement for every file, it contains an action manifest plus a set of patches —
instructions of the form *"take the file you already have, change these bytes, and you will have
the new one"* — which the device uses to reconstruct the target files.

The automated verification covers the **components**, each matching its counterpart in the
release files used as comparands for that run. It does not yet cover the **archive** those
components are delivered in.

Its contents can be checked by applying each patch and reconciling the before-and-after
inventories. Each patch begins with a 216-byte
header recording the old and new versions, their sizes and their SHA-256 hashes, followed by
bzip2-compressed qbsdiff patch data. The old hash confirms you are starting from the right file
*before* patching; the new hash confirms the output is correct *after*. A complete check would
also verify the archive's outer signature before trusting anything inside it, and reconcile the
full before-and-after inventories so that every file of the new version is accounted for as
patched, left unchanged, delivered separately, or explicitly out of scope. An action manifest is
not expected to list every file — the v1.2.1 one listed 11 — so completeness has to be judged
against the inventories, not the manifest alone.

We have done this once by hand, for the v1.2.0 to v1.2.1 update: all 11 patches, applied to
Foundation's official v1.2.0 files, produced Foundation's official v1.2.1 files byte for byte.
This was a one-off manual experiment rather than part of the automated verifier, and its
transcript has not been published, so it supports the endpoints of those patches rather than
standing as evidence a reader can re-check. It is **not** a complete source-to-device chain,
because the v1.2.0 files it started from were Foundation's published copies rather than a build we
had verified ourselves. Establishing an independently verified starting point is a major
remaining gap, though not the only one: a finished check would also verify the archive's outer
signature under an independently authenticated key, confirm the action manifest is complete, and
run automatically for every release. That is why this step is described as demonstrated rather
than finished.

**So, in short:** a passing result here means the in-scope components of that firmware release
matched the release files used as comparands for that run — payloads compared after
signature-envelope removal for compiled payloads, whole-file for manifests and assets. It does
not mean the delta-update archive your device downloads has been checked end to end, and it does
not cover the bootloader or the separate Bluetooth and secure-element firmware.

This device is **source-available**.
