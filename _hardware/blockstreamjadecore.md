---
title: Jade Core
appId: blockstreamjadecore
authors:
- danny
released: 2026-04-28
discontinued: 
updated: 2026-08-21
version: 1.0.41
binaries: https://jadefw.blockstream.com/bin/jade2.0c/index.json
dimensions:
- 65
- 30
- 12
weight: 20
provider: Blockstream Corporation Inc.
providerWebsite: https://blockstream.com/
website: https://blockstream.com/jade/jade-core/
shop: https://store.blockstream.com/products/blockstream-jade-core
country: CA
price: 99USD
repository: https://github.com/Blockstream/Jade
icon: blockstreamjadecore.png
bugbounty: 
meta: ok
verdict: sourceavailable
date: 2026-08-31
signer: 
twitter: Blockstream
social:
- https://www.linkedin.com/company/blockstream
- https://www.facebook.com/Blockstream
- https://t.me/blockstream
- https://www.youtube.com/channel/UCZNt3fZazX9cwWcC9vjDJ4Q
builds:
- arch: esp32s3
  types: jadecore
features:
- foss
---

## Device Description

Jade Core is Blockstream's simplified hardware wallet, launched in April 2026 at $99 as an easier way into their Jade range. It is essentially a {% include walletLink.html wallet='hardware/blockstreamjadeplus' verdict='true' %} with the camera and the battery taken out, which is why it works a little differently — without a camera it cannot scan QR codes, so you connect it over USB-C or Bluetooth to a phone or computer instead. Like every Jade, it has no secure element chip; your PIN is protected by Blockstream's "blind oracle" server, which helps unlock your wallet without ever learning your keys or seeing your funds. It shares the Jade firmware codebase and Blockstream publishes the hardware designs too, though Core builds from its own `jade_v2c` target and ships its own release artifacts at `bin/jade2.0c`. It works with the Blockstream app on desktop, iOS and Android, and with third-party wallets including Sparrow, Nunchuk and BlueWallet.

## Analysis

### Can the private keys be created offline? - ✔️

Yes. Keys are generated on the device itself and never leave it. Blockstream states that "private keys remain isolated on-device, with signing performed entirely offline" ([press release](https://blockstream.com/press-releases/2026-04-28-blockstream-introduces-jade-core/)).

### Are the private keys shared? - ✔️

No, with one thing worth understanding. The keys are generated and stored on the device and are not transmitted anywhere.

Jade has no secure element. Instead your recovery phrase is protected by three things together — your PIN, a secret held on the device, and a secret held by Blockstream's PIN server, the "blind oracle" ([Blockstream help](https://help.blockstream.com/blockstream-jade/faqs/how-does-jade-protect-my-recovery-phrase-with-a-blind-oracle)). The server supplies decryption material over an encrypted channel when you enter your PIN. It never receives your recovery phrase, your keys or your balances, and it cannot unlock the device on its own. This is Jade's long-standing design, not something specific to Core, and you can run your own PIN server if you would rather not rely on Blockstream's.

### Does the device display the receive address for confirmation? - ✔️

Yes, and Jade's address-request protocol enforces it. Jade's own documentation states of the `get_receive_address` reply: "The reply is not sent until the user has explicitly confirmed the address on the hw" ([docs/index.rst at tag 1.0.41](https://github.com/Blockstream/Jade/blob/1.0.41/docs/index.rst#L1070)). So when companion software asks Jade for an address through that call, Jade withholds the reply until you confirm the address on the device.

### Does the interface have a display screen and buttons which allows the user to confirm transaction details? - ✔️

Yes. The published specification lists a display and physical buttons as the control method ([store page](https://store.blockstream.com/products/blockstream-jade-core)). You confirm what you are signing on the device itself rather than trusting the screen of the computer or phone it is plugged into.

### Is it reproducible? - ❓

**Not yet tested.** This is the honest answer and it is the reason this page carries no build verdict.

The ingredients are all public. Core builds from the shared Jade codebase using its own `jade_v2c` target, and Blockstream's own `REPRODUCIBLE.md` documents how to build it. Blockstream publishes the finished firmware at [`bin/jade2.0c/index.json`](https://jadefw.blockstream.com/bin/jade2.0c/index.json) along with the hashes.

What has not happened is anyone at WalletScrutiny building it and comparing the result. Our verification tooling currently covers classic Jade only and rejects the Jade Plus and Jade Core targets outright. Until that build is actually run, we make no claim either way.

For context on what such a test looks like when it is done, classic Jade 1.0.41 was verified reproducible across all four of its firmware builds — see {% include walletLink.html wallet='hardware/blockstreamjade' verdict='true' %}.

### Further notes

**What "Core" means.** The name is Blockstream's, and their repository defines it plainly: `jade_v2c: Jade Core, Jade Plus without camera and battery` ([README](https://github.com/Blockstream/Jade/blob/1.0.41/README.md#L51)). The device is built on the ESP32-S3 microcontroller, the same chip as Jade Plus, rather than the ESP32 used by the original Jade.

**No camera means no air-gapped QR signing workflow.** On Jade Plus the camera is what allows air-gapped operation — scanning QR codes so the device never touches a cable. Jade Core does not have one. Blockstream's published specification lists USB-C and Bluetooth as the connections. We have not established whether Core supports any air-gapped path of its own, so this page does not claim the `airGapped` feature.

**Core test-coverage note.** At tag 1.0.41, two checks in the project's own test suite are not enabled for this target: `test_jade.py` lines 4010 and 4113 each carry `TODO: enable for v2.0c`. That is the precise extent of the observation — it says two tests are not yet enabled for Core, and nothing about the state of the product overall.

{% include featureEvidence.html feature="foss" quote="Jade Core has both fully open-source software and hardware, allowing the community to review and contribute." source="Blockstream store page" comment="Firmware source is published at github.com/Blockstream/Jade, the same repository as the rest of the Jade line." %}
