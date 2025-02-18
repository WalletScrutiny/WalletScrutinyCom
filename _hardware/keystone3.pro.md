---
title: Keystone3 Pro
appId: keystone3.pro
authors:
- danny
- keraliss
released: 2024-04-02
discontinued: 
updated: 2024-12-13
version: 1.8.2
binaries: https://keyst.one/firmware
dimensions:
- 62
- 100
- 12
weight: 103
provider: Yanssie HK Limited
providerWebsite: https://keyst.one/
website: https://keyst.one/
shop: https://keyst.one/shop/products/keystone-3pro
country: HK
price: 129USD
repository: https://github.com/KeystoneHQ/keystone3-firmware
issue: 
icon: keystone3.pro.png
bugbounty: 
meta: ok
verdict: reproducible
appHashes:
- 5609915455a3f867fca8bdb026b596a70be0cb1f5678a5aeab5ab8218075fd22
date: 2024-12-31
signer: 6853ffd1706faed1468e677621b2ef1ccf053dff4f9b22e7ba5b12a978e1eb37
reviewArchive:
- date: 2024-12-23
  version: 1.8.0
  appHashes:
  - a6a252c3b82435ba989a30429edfb86453e992b5566bca7ee36e6c0480ea753d
  gitRevision: d556b513f2c26dc38f5a8b4ff573bea8b1619edc
  verdict: reproducible
- date: 2024-12-17
  version: 1.7.16
  appHashes:
  - c24cc4b1cf388672416b6e820382bc5048759f62357aff30546cbd5ec52d116d
  gitRevision: 1d915d864d956ae13a1ea1939a7121444ceee3b2
  verdict: reproducible
- date: 2024-12-10
  version: 1.7.12
  appHashes:
  - 30150196c0ea1e6dd258a96a395054fb17a844554f140a2cab3ced124c8b84a7
  gitRevision: ba0aa32f1d9448f95829d629cdc2b12354f1d9ba
  verdict: reproducible
- date: 2024-11-20
  version: 1.7.10
  appHashes:
  - 93f3b45eee2403be6f5a1aaeccbaa863dc7df24b666f250b5147b5c54ef27546
  gitRevision: 5d7b9b51299533649649997ba132ef2bd73f49f5
  verdict: reproducible
- date: 2024-10-31
  version: 1.7.8
  appHashes:
  - d969529b94c562432df896b6eefcc8605f736081b38646cbeca237304033b674
  gitRevision: 00765d31f5e9f4037f2f27b8a7b40b1017896e74
  verdict: reproducible
- date: 2024-10-01
  version: 1.7.0
  appHashes:
  - 8f6e9ed77bf1fa65b6ee7abe2f2791232ee197f3bf4d1c82c535c42f84c4a392
  gitRevision: fd7561fdc67aa36b9cfa50b818e8279fbafd07f0
  verdict: reproducible
- date: 2024-08-19
  version: 1.6.0
  appHashes:
  - 66c336583365ac855823a86ae1069f60ff567acab8d4df6cfc825eeacf7a66d1
  gitRevision: 8644d08aa08a2187b92322fcd6fa5184ebeba288
  verdict: reproducible
- date: 2024-08-14
  version: 1.5.8
  appHashes:
  - d2d73488930e4e91787d3d7010f6dfc22268ce406e1848fd96e02eaf4737bfe9
  gitRevision: fa57632b4e7ceb3aafffca647ebd23e2627751ff
  verdict: reproducible
- date: 2024-06-03
  version: 1.4.8
  appHashes:
  - fbf1cf15c5ba13a91a6b27f73a21ae69d8b60b5ff34f6d32dbd55e8ff5f27025
  gitRevision: f7e12618fa33223fde14fce8c27c4a98833bb15c
  verdict: reproducible
- date: 2024-05-08
  version: 1.3.6
  appHashes:
  - b85edf5bd058028e708437c125ad3d67ab6da520b402d9aec59b47705f3a5509
  gitRevision: 421e87907f78d34a2a99967ef12d2423311f5530
  verdict: reproducible
twitter: KeystoneForBTC
social:
- https://www.youtube.com/channel/UCaReIdawwYPPcyWGoNunF7g
- https://discord.com/invite/gpfaESrxu2
- https://t.me/KeystoneWallet
- https://www.reddit.com/r/KeystoneWallet
features:
- taproot

---

Other Features:
- {% include walletLink.html wallet='android/io.bluewallet.bluewallet' verdict='true' %}, Sparrow, {% include walletLink.html wallet='android/io.nunchuk.android' verdict='true' %}support
- Taproot support through Sparrow
- XPUB QR code Display
- Bitcoin Testnet support
- Passphrase support
- Shamir Backup support
- 3 Secure Elements
- Rust Based OS
- Self-destruct mode
- Dice Entropy
- 4-inch (480x480) touchscreen
- 3 seed phrases
- Future multisig support
- Device verification
- Fingerprint verification
- Dice entropy

# Updated Verification for 1.8.2 2024-12-31

Run the script:

`$ ./scripts/test/hardware/keystone3pro.sh 1.8.2`

```
Firmware checksum sha256: 5609915455a3f867fca8bdb026b596a70be0cb1f5678a5aeab5ab8218075fd22 
You can check this value on your device.
------------------------
(SIGNED) Binary from Keystone Website:
4697250d2e7f9fff681aca98fb9fa62dcc00dd3fa786457e19ec1e01721c5aa1  keystone3.bin
------------------------
------------------------
Binary from build process:
5609915455a3f867fca8bdb026b596a70be0cb1f5678a5aeab5ab8218075fd22  ./build/mh1903.bin
------------------------
------------------------
Unsigned Binary from Keystone Website:
Firmware checksum sha256: 5609915455a3f867fca8bdb026b596a70be0cb1f5678a5aeab5ab8218075fd22 
You can check this value on your device.
------------------------
Unsigned .bin hash must be the same as mh1903.bin.
```

Version 1.8.2 of the {{ page.title}} hardware device is **reproducible**

{% include asciicast %}

<hr>

# Previous Verification for 1.7.12 2024-12-10

Run the script:

`$ ./scripts/test/hardware/keystone3pro.sh 1.7.12`

```
Firmware checksum sha256: 30150196c0ea1e6dd258a96a395054fb17a844554f140a2cab3ced124c8b84a7 
You can check this value on your device.
------------------------
(SIGNED) Binary from Keystone Website:
4acb98c0b3bac04bbe79ec68d2b6dc359925192a4d0c7647e0b79cbc649a5a7f  keystone3.bin
------------------------
------------------------
Binary from build process:
30150196c0ea1e6dd258a96a395054fb17a844554f140a2cab3ced124c8b84a7  ./build/mh1903.bin
------------------------
------------------------
Unsigned Binary from Keystone Website:
Firmware checksum sha256: 30150196c0ea1e6dd258a96a395054fb17a844554f140a2cab3ced124c8b84a7 
You can check this value on your device.
------------------------
Unsigned .bin hash must be the same as mh1903.bin.
```

Version 1.7.12 of the Keystone3 Pro hardware device is **reproducible** 

---

# Previous Analysis 2024-08-19

## Private keys can be created offline?

[**Yes**](https://blog.keyst.one/why-air-gap-hardware-wallets-offer-superior-security-over-usb-connected-hardware-wallets-8343fa76f7d4)

## Private keys are not shared? 

[**Yes**](https://blog.keyst.one/blind-signing-a-security-black-hole-for-the-ethereum-community-13f909b848b6)

Although the provider claims that the hardware wallet does not have its own wallet software [(Source)](https://keyst.one/btc-only), it claims to have anti-leak technology that prevents blind signatures.

It communicates to the bound app using QR codes. You can see this process in this [demonstration video](https://youtu.be/772O-NYmd1s?si=arDzCzjwAJYdXyyz&t=569) by a third-party.

## Device displays receive address for confirmation

**Yes**. This is displayed on the screen. When sending BTC from the linked wallet, users can select either **"Export Transaction"** or **"Import Signature"**. Then the sub-choices for Export Transaction are: **Export via QR**, or **Export via File**.

The hardware device then generates a QR code for the authorization. 

## Interface

**Yes**. There is a screen and the confirmation mechanism is via the touchscreen using a sliding bar and a pin code. The authorization is performed by using the wallet app to scan the QR code generated by the device.

## Reproducibility

This hardware wallet is [**for verification.**](https://gitlab.com/walletscrutiny/walletScrutinyCom/-/issues/524)

We were able to craft a script from their provided [build instructions](https://github.com/KeystoneHQ/keystone3-firmware/blob/master/docs/verify.md). 

## Results

```
Firmware checksum sha256: 66c336583365ac855823a86ae1069f60ff567acab8d4df6cfc825eeacf7a66d1
You can check this value on your device.
All builds complete.
------------------------
(SIGNED) Binary from Keystone Website :
6853ffd1706faed1468e677621b2ef1ccf053dff4f9b22e7ba5b12a978e1eb37  keystone3.bin
------------------------
------------------------
Binary from build process:
66c336583365ac855823a86ae1069f60ff567acab8d4df6cfc825eeacf7a66d1  ./build/mh1903.bin
------------------------
------------------------
Unsigned Binary from Keystone Website :
Firmware checksum sha256: 66c336583365ac855823a86ae1069f60ff567acab8d4df6cfc825eeacf7a66d1
You can check this value on your device.
------------------------
Unsigned .bin hash must be the same as mh1903.bin.
```

Following instructions from their documentation seems to indicate that the built file `mh1903.bin` has the same checksum as the downloaded binary. 

However, we decided to take a closer look at the process behind the firmware checker. 

We created an [issue](https://github.com/KeystoneHQ/keystone3-firmware/issues/967) in the repository of the provider.

They [promptly replied](https://github.com/KeystoneHQ/keystone3-firmware/issues/967#issuecomment-2085060319), and pointed out that:
> The keystone3-unsigned.bin is actually the compressed version of mh1903.bin with some headers, so what firmware-checker does is decompress the content then do a sha256 checksum.

Version 1.6.0 of Keystone 3 Pro is **reproducible**

