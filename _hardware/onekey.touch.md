---
title: OneKey Touch
appId: onekey.touch
authors:
- danny
- mohammad
released: 2022-03-08
discontinued: 
updated: 2023-06-21
version: 4.3.0
binaries: 
dimensions:
- 88
- 53
- 9.2
weight: 75
provider: OneKey
providerWebsite: 
website: https://onekey.so/
shop: https://onekey.so/products/onekey-touch-hardware-wallet/
country: SG
price: 249 USD
repository: https://github.com/OneKeyHQ/firmware
issue: https://github.com/OneKeyHQ/firmware/issues/404#issuecomment-1633287406
icon: onekey.touch.png
bugbounty: 
meta: ok
verdict: sourceavailable
appHashes:
- a4cdce143d400c185f24885c6848fdad398e34206850a3ea8bcc7e219b30e06f
date: 2023-07-13
signer: 
reviewArchive: 
twitter: OneKeyHQ
social:
- https://discord.com/invite/nwUJaTzjzv
features: 

---

Note from Provider:

> "...all (OneKey devices) need our APP to send data, process the received information inside the hardware, and then return it. This ensures that the private key in our hardware is safe.

Paired with: {% include walletLink.html wallet='android/so.onekey.app.wallet' verdict='true' %}

## [Operation Instructions](https://help.onekey.so/hc/en-us/articles/360002123856-OneKey-Hardware-Wallet-Quick-Start-Tutorial)

1. Can the private keys be created offline?

**Yes**. See [tutorial on seed generation](https://help.onekey.so/hc/en-us/articles/360004487195)

2. Are the private keys shared?

The hardware wallet is paired with the Android app prior to the generation of the private keys.

[Video reference ](https://youtu.be/9EMmZwCUxRA?t=290)

We'll go by the assumption that the hardware wallet does not share the private keys with the mobile app.

3. Does the device display the receive address for confirmation?

**Yes.**

[Video Reference](https://youtu.be/9EMmZwCUxRA?t=1249)

4. Does the interface have a display screen and buttons that allows the user to confirm transaction details?

**Yes** the device has a touchscreen interface.

5. Is it reproducible?

We followed the steps that provider sent to us and ran a script which is based on their
[Github actions](https://github.com/OneKeyHQ/firmware/blob/touch/.github/workflows/build-touch.yml).
Here is the result for v4.3.0:

```
$ sha256sum downloaded-firmware.bin touch.4.3.0-Stable-0713-48a9b59.bin

a4cdce143d400c185f24885c6848fdad398e34206850a3ea8bcc7e219b30e06f  downloaded-firmware.bin
0352878d0567e2cc0eb92031f21b45a43409c95988e8005a488b7ddf46600b9b  touch.4.3.0-Stable-0713-48a9b59.bin
```
The hashes were different, So we had a look at the diff of the hex formatted binaries:

```
$ xxd touch.4.3.0-Stable-0713-48a9b59.bin > touch.4.3.0-Stable-0713-48a9b59.hex
$ xxd downloaded-firmware.bin > downloaded-firmware.hex
$ diff touch.4.3.0-Stable-0713-48a9b59.hex downloaded-firmware.hex

...

# Too many lines of diff

```

There are a lot of diffs, more than what we could list here.
We reported this problem in
[an issue on Github](https://github.com/OneKeyHQ/firmware/issues/404#issuecomment-1633287406).
Sadly at the current state, This firmware is **not verifiable**.
