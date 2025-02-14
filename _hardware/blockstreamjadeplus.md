---
title: Jade Plus
appId: blockstreamjadeplus
authors:
- danny
released: '2025-01-03'
discontinued: 
updated: 
version: 
binaries: 
dimensions:
- 65
- 30
- 12
weight: 30
provider: Blockstream Corporation Inc.
providerWebsite: https://blockstream.com/
website: https://blockstream.com/jade/jade-plus/
shop: https://store.blockstream.com/products/jade-plus
country: US
price: 149USD
repository: https://github.com/Blockstream/jade
issue: 
icon: blockstreamjadeplus.png
bugbounty: 
meta: ok
verdict: wip
appHashes: 
date: '2025-01-04'
signer: 
reviewArchive: 
twitter: Blockstream
social:
- https://www.linkedin.com/company/blockstream
- https://www.facebook.com/Blockstream
- https://t.me/blockstream
- https://www.youtube.com/channel/UCZNt3fZazX9cwWcC9vjDJ4Q
features: 

---

## Can the private keys be created offline? - ✔️

Yes. The device can generate keys offline and supports dice-created seed phrases as evidenced by the firmware changelog and capabilities inherited from the original Jade.

## Are the private keys shared? - ✔️

No. The device uses the same secure architecture as the original Jade, with private keys being generated and stored securely on the device's hardware.

## Does the device display the receive address for confirmation? - ✔️

Yes. The firmware includes address verification capabilities and the device has a 66% larger screen than the original Jade specifically to improve the display of addresses and transaction details.

## Does the interface have a display screen and buttons which allows the user to confirm transaction details? - ✔️

Yes. The Jade Plus features a significantly larger display (66% larger than the original Jade) and two responsive navigation buttons specifically designed for transaction verification and user interaction. The firmware includes comprehensive transaction detail display and confirmation capabilities.

## Is it reproducible? - ✔️

The Jade Plus uses the same open-source firmware as the original {% include walletLink.html wallet='hardware/blockstreamjade' verdict='true' %}.  

The source code is available in the Blockstream/jade repository, and includes specific build configurations for the Jade Plus (referenced as v2s3 in the configs).

Reproducibility is a **work-in-progress**.

### Further notes

The Jade Plus appears to be using the same firmware codebase as the original Jade, but with different hardware based on the ESP32-S3 microcontroller (as opposed to the original ESP32 used in the first Jade).

The repository contains configuration files specifically for Jade Plus, as seen in the configs and production directories with files containing "v2s3" (likely indicating Version 2 with ESP32-S3).
  - Main config file: [sdkconfig_jade_v2s3.defaults](https://github.com/Blockstream/jade/blob/master/configs/sdkconfig_jade_v2s3.defaults)
  - Production config: [sdkconfig_jade_v2s3_prod.defaults](https://github.com/Blockstream/jade/blob/master/production/sdkconfig_jade_v2s3_prod.defaults)

The firmware identifies itself as "Jade Plus" in the USB device descriptor string, as seen in the [configuration file](https://github.com/Blockstream/jade/blob/master/configs/sdkconfig_jade_v2s3.defaults#L84).

Recent updates in the [changelog](https://github.com/Blockstream/jade/blob/master/CHANGELOG.md) show specific improvements for ESP32-S3 devices, including:
- Improved BLE pairing/bonding
- Better error handling for USB storage
- Fixed button repeat speed
- Improved firmware upgrade and PSBT signing capabilities

### Connectivity and Air-gapped Operation

The device offers multiple connectivity options:
- USB-C: For direct connections
- Bluetooth: For wireless convenience
- Camera: For air-gapped operations including device unlock and transaction signing via QR codes
- External Storage: For air-gapped firmware upgrades and transaction signing

A notable accessory is the JadeLink, a low-profile USB-C storage drive designed specifically for the Jade Plus to facilitate air-gapped operations. It's available as part of a bundle with the Jade Plus for $169 USD.
