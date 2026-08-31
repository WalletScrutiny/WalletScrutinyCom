---
title: Frostsnap Frontier
appId: frostsnap
authors:
- danny
released: 
discontinued: 
updated: 2026-08-25
version: 0.4.0
binaries: https://github.com/frostsnap/frostsnap/releases
dimensions:
- 34
- 42
- 9
weight: 60
provider: Frostsnap
providerWebsite: https://frostsnap.com
website: https://frostsnap.com
shop: https://frostsnap.com/buy/
country: AU
price: 200000sats
repository: https://github.com/frostsnap/frostsnap
icon: frostsnap.png
bugbounty: https://github.com/frostsnap/frostsnap/blob/master/SECURITY.md
meta: ok
verdict: sourceavailable
date: 2026-08-27
signer: 
twitter: FrostsnapTech
social: 
builds: 
features:
- foss
- taproot
- customNode

---

## Update 2026-08-27

The device is now **shipping**, and the project has moved on from the pre-release state we last
recorded. Frostsnap [released v0.4.0](https://github.com/frostsnap/frostsnap/releases/tag/v0.4.0)
on 2026-08-25 and announced it publicly:

<blockquote class="twitter-tweet" data-media-max-width="560"><p lang="en" dir="ltr">Frostsnap v0.4.0 is out ❄<br><br>It fixes two security issues. We know of no user funds lost to either, and each has a published report. Update your app and device firmware.<br><br>Also: firmware downgrade protection and dozens more fixes.</p>&mdash; Frostsnap ❄ (@FrostsnapTech) <a href="https://twitter.com/FrostsnapTech/status/2092814297726644626?ref_src=twsrc%5Etfw">August 27, 2026</a></blockquote> <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>

We have therefore replaced the `unreleased` verdict with **`sourceavailable`**.

### Why `sourceavailable`

The firmware source is public. The ESP32-C3 firmware lives in
[`device/`](https://github.com/frostsnap/frostsnap/tree/v0.4.0/device) of the same repository as
the app, the whole repository is [MIT licensed](https://github.com/frostsnap/frostsnap/blob/v0.4.0/LICENSE),
and the release ships a `firmware.bin` alongside a detached PGP signature and a signed `CHECKSUMS`
file. Building the firmware is documented in
[`device/README.md`](https://github.com/frostsnap/frostsnap/blob/v0.4.0/device/README.md)
(`just build-firmware`, `just flash`).

This verdict says only that the source is published. **We have not run a build verification.**
Frostsnap publishes a firmware digest in the release notes and describes it as a deterministic
build — there is a [`device/deterministic-build.sh`](https://github.com/frostsnap/frostsnap/blob/v0.4.0/device/deterministic-build.sh)
script and a `deterministic-build.yml` GitHub workflow in the tree — so this is a good candidate
for a reproducibility test. Until we have actually run one, no claim is made either way.

### Version number

We now take the version from the release tag and from
[`device/firmware_version.rs`](https://github.com/frostsnap/frostsnap/blob/v0.4.0/device/firmware_version.rs),
which reads `(0, 4, 0)`. Our earlier `0.1.0` came from `device/Cargo.toml`, which still declares
`version = "0.1.0"` at this tag and is no longer a reliable source for the firmware version.

### The two security fixes in v0.4.0

Both were disclosed by the provider with a user bulletin and a technical report:

- [Unverified output owner](https://frostsnap.com/security/updates/2026-08-unverified-output-owner/) —
  a signing request could mark an output as belonging to the user's own wallet, and the device
  neither checked that claim nor showed the output on its confirmation screen. Frostsnap states
  this was reachable only by software talking to the device in place of the Frostsnap app.
- [Change addresses beyond the recovery range](https://frostsnap.com/security/updates/2026-08-change-address-range/) —
  change could land past the range a wallet recovery scans, so a restored wallet might not find
  every coin. Frostsnap states the coins remain safe on-chain and that v0.4.0 detects and
  recovers them.

We have not independently verified either report. We note them because publishing a written report
for each, rather than a silent fix, is the behaviour we want to see from a provider.

Frostsnap also publishes a [security policy](https://github.com/frostsnap/frostsnap/blob/v0.4.0/SECURITY.md)
that defines the security model it wants tested and pays a **1,000,000 satoshi** bounty for an
attack that genuinely breaks that model.

### Device and features

The shipping product is the **Frostsnap Frontier**: an ESP32-C3 RISC-V device with a 1.69" IPS
touchscreen and dual USB-C ports for daisy-chaining, sold at 200,000 sats per device, HQ in
Australia and assembled in Malaysia.

It is **bitcoin only**. Signing is FROST threshold signing (Schnorr/Taproot) rather than script
multisig: a `2-of-3` needs any two devices, but the wallet appears on-chain as a single Taproot
key. We do not tag it `multiSig` because that feature's current definition and drawbacks describe
on-chain multisig. Frostsnap has the threshold-security benefit, but its fees, privacy properties
and on-chain footprint are those of a single-key wallet.

`customNode` is tagged because the app lets the user set their own primary and backup Electrum
servers ([`frostsnapp/lib/electrum_server_settings.dart`](https://github.com/frostsnap/frostsnap/blob/v0.4.0/frostsnapp/lib/electrum_server_settings.dart)).

We deliberately do **not** tag:

- `secEl` — the device has no secure element. Frostsnap's own product page says device secrets are
  encrypted with a key held by the *phone's* secure element.
- `airGapped` — devices talk to the phone or laptop over USB.
- `camera`, `nfc` — the Frontier has neither.
- `selfBuild` — firmware can be built and flashed by the user, but the Frontier is purpose-built
  hardware, not a device assembled from off-the-shelf parts.
- `hd` — its keys are derived hierarchically, but recovery uses physical FROST share backups rather
  than the BIP39 mnemonic required by our current feature definition.

The four checks below are source-code observations for v0.4.0, not hands-on tests or a security
audit. Because we have not reproduced `firmware.bin`, they also do not establish that the shipped
binary contains the code described here.

## Can the private keys be created offline? - ✔️

The device side of key generation has no network path in v0.4.0.

Secret material is generated on-device from the ESP32-C3's true hardware RNG — `Trng::new(&mut
peripherals.RNG, &mut peripherals.ADC1)`. The implementation feeds 1,024 bytes of TRNG output into
one SHA-256 digest in sixteen 64-byte updates, then uses the 32-byte digest to seed a ChaCha20 RNG
before anything uses it
([`device/src/peripherals.rs:154-208`](https://github.com/frostsnap/frostsnap/blob/v0.4.0/device/src/peripherals.rs#L154-L208)).

The ESP32-C3 has WiFi and Bluetooth silicon, but **the firmware links no radio stack at all**.
[`device/Cargo.toml:26`](https://github.com/frostsnap/frostsnap/blob/v0.4.0/device/Cargo.toml#L26)
pulls `esp-hal` with only the `esp32c3` and `digest` features, and there is no `esp-wifi` or
Bluetooth crate anywhere in the workspace `Cargo.lock`. Communication with the coordinator is over
the device's wired USB Serial JTAG and UART paths.

One important qualification: **no single Frostsnap device ever generates the wallet key.** Key
generation is a certified distributed key generation — each device generates only its own
polynomial contribution locally
([`frostsnap_core/src/device/keygen.rs:128-140`](https://github.com/frostsnap/frostsnap/blob/v0.4.0/frostsnap_core/src/device/keygen.rs#L128-L140))
and the wallet key is the aggregate. The coordinator app also contributes its own randomly generated
input to the certified keygen, and the project's README states plainly that devices "are not trusted
to generate keys on their own."
The complete wallet private key is therefore never materialized on any one device during keygen.
That is the design, not a shortcoming — but it does mean a device on its own cannot produce a wallet,
and a keygen needs the coordinator present on the wire.

We have not tested whether the coordinator app itself demands an internet connection during
keygen. That is an app-side question we would need to run to answer.

## Are the private keys shared? - ✔️

No complete wallet private key or final plaintext device share is sent to the coordinator. Each
device holds only its own FROST secret share, stored encrypted
([`EncryptedSecretShare::encrypt`](https://github.com/frostsnap/frostsnap/blob/v0.4.0/frostsnap_core/src/device/keygen.rs#L325)),
while the coordinator aggregates encrypted contributions. The distributed key generation does not
materialize a complete wallet private key for the coordinator to receive.

Two honest qualifications:

- During key generation, share contributions *are* transmitted between participants — that is what
  a distributed key generation does. In the exact `schnorr_fun` 0.13.0 dependency locked by this
  release, `certpedpop` layers on `encpedpop`: contributions are masked with a pad derived from
  ephemeral Diffie-Hellman with each receiver's public key. The coordinator aggregates the
  ciphertexts and each receiver decrypts its aggregate locally.
- The user's backup is the share itself, encoded as 25 BIP39 words
  ([`frost_backup/README.md`](https://github.com/frostsnap/frostsnap/blob/v0.4.0/frost_backup/README.md)).
  Crucially, those words are displayed on and typed back in through the **device's own screen and
  on-device keyboard** ([`frostsnap_widgets/src/backup/`](https://github.com/frostsnap/frostsnap/tree/v0.4.0/frostsnap_widgets/src/backup)),
  not through the phone. In the v0.4.0 flow, neither the words nor the share pass through the
  coordinator to be written down or entered; it receives only share-image and status metadata.

A related property worth noting: devices delete the `rootkey` shortly after keygen and store no
public keys at all. An attacker who finds a single device learns only a share image — how many keys
it participated in and the threshold — not the wallet's xpub or its transaction history
([`docs/key-derivation-design.md`](https://github.com/frostsnap/frostsnap/blob/v0.4.0/docs/key-derivation-design.md)).

## Does the device display the receive address for confirmation? - ✔️

Yes, and the device derives the address itself rather than displaying one the phone hands it.

There is a dedicated `VerifyAddress` task. The coordinator sends only a `master_appkey` and a
`derivation_index`; the device then checks it actually holds that key, builds the BIP32 path,
computes the script pubkey and derives the address from it before showing it
([`frostsnap_core/src/device.rs:383-417`](https://github.com/frostsnap/frostsnap/blob/v0.4.0/frostsnap_core/src/device.rs#L383-L417)).
In this verification flow, the address string never travels from the app to the device, so a
compromised app cannot make the device vouch for an address it did not derive.

The address is rendered in a 6×3 grid of 4-character chunks with random chunks highlighted
([`frostsnap_widgets/src/address_display.rs`](https://github.com/frostsnap/frostsnap/blob/v0.4.0/frostsnap_widgets/src/address_display.rs)),
which pushes the user to actually read the address rather than glance at its first and last few
characters.

## Does the interface have a display screen and buttons which allow the user to confirm transaction details? - ✔️

Yes, though the input is a touchscreen rather than buttons. The Frontier has a 1.69" IPS display
(240x280) with capacitive touch, and two USB-C ports for daisy-chaining devices together.

The on-device signing prompt is a sequence of pages covering the amount, the recipient address, the
network fee and fee rate, and a high-fee warning
([`frostsnap_widgets/src/sign_prompt.rs`](https://github.com/frostsnap/frostsnap/blob/v0.4.0/frostsnap_widgets/src/sign_prompt.rs)).
Confirmation is a deliberate hold gesture
([`hold_to_confirm.rs`](https://github.com/frostsnap/frostsnap/blob/v0.4.0/frostsnap_widgets/src/hold_to_confirm.rs)),
not a single tap.

Two details worth recording. An output whose script has no address form gets its own
`UnrecognizedScriptPage` rather than being rendered as hex — the source comment explains that hex
"would borrow credibility it has not earned." And one of the two security issues fixed in v0.4.0
was precisely a gap in this screen: outputs claimed to be the user's own were being left off the
confirmation display and the claim was never checked. PR #546 in this release makes the device
disclose self-spend outputs explicitly.

## Update 2025-10-06

They are claiming that pre-orders are about to close. We are giving them a benefit of the doubt and retaining the unreleased verdict.

<blockquote class="twitter-tweet" data-media-max-width="560"><p lang="en" dir="ltr">Preorders closing soon for the legendary early adopter batch of Frostsnap Frontiers. Final stages of manufacturing underway 🎉 <a href="https://t.co/IIJtScb71j">pic.twitter.com/IIJtScb71j</a></p>&mdash; Frostsnap ❄ (@FrostsnapTech) <a href="https://twitter.com/FrostsnapTech/status/1970332579367879155?ref_src=twsrc%5Etfw">September 23, 2025</a></blockquote> <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>

## Update 2024-10-21

Development is still ongoing with the [latest commit](https://github.com/frostsnap/frostsnap/commit/bf98cfda9b21a005802b36b4467eace5598155ec) made on October 9, 2024. 

We [posted](https://x.com/dannybuntu/status/1848285304152789134) on X.com to ask when they would be releasing their device.

We derived the version number from the project's [cargo.toml](https://github.com/frostsnap/frostsnap/blob/master/device/Cargo.toml) file.

## Product Description 2024-01-05

> Connect one or more Frostsnap devices to your phone and easily create a Bitcoin wallet in our app.
>
> If you create a `2-of-3`, any two devices are required to access your wallet.
>
> You can geographically separate your Frostsnap devices or share them amongst individuals you trust.
>
> With Frostsnap, the strong security you need is now accessible.

## Analysis

The firmware source for the shipping device is public and MIT licensed, so anyone can inspect it
and further build verification is possible. We have not yet attempted a reproducible build of
`firmware.bin`.
