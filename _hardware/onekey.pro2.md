---
title: OneKey Pro 2
appId: onekey.pro2
authors:
- danny
released: 2026-10-08
discontinued: 
updated: 
version: 1.0.3
binaries: https://data.onekey.so/config.json
dimensions:
- 84.9
- 53.2
- 6.2
weight: 51
provider: Bixin
providerWebsite: https://onekey.so/
website: https://onekey.so/products/onekey-pro-2/
shop: https://onekey.so/products/buy-onekey-pro-2/
country: HK
price: 299USD
repository: 
bugbounty: https://github.com/OneKeyHQ/app-monorepo/blob/onekey/docs/BUG_RULES.md
meta: ok
verdict: nosource
date: 2026-11-10
signer: 
twitter: OneKeyHQ
social:
- https://www.reddit.com/r/OneKeyHQ
- https://www.youtube.com/@onekeyhq
builds: 
features: 

---

## Device Description

OneKey Pro 2 is a touchscreen hardware wallet that OneKey [launched on 2026-10-08](https://onekey.so/blog/updates/onekey-pro-2-launch/) for $299. It is OneKey's flagship and the first device to run safeOS 2, the operating system later shared with the cheaper {% include walletLink.html wallet='hardware/onekey.neo' verdict='true' %}. It works with the {% include walletLink.html wallet='android/so.onekey.app.wallet' verdict='true' %} and, for Bitcoin multisig, with Sparrow.

- 3.54-inch color AMOLED touchscreen, 1024 × 604 pixels, up to 800 nits.
- Four EAL6+ secure elements; OneKey says private keys never leave them.
- Connects over Bluetooth, USB-C and NFC, and signs offline by scanning QR codes with its camera.
- Fingerprint sensor in the power button unlocks the device without typing the PIN.
- Backup as a 12- or 24-word recovery phrase, or as 20-word SLIP-39 shares.
- A SeedCard, which stores an encrypted recovery phrase backup over NFC, comes in the box.
- 700 mAh battery with wireless and USB-C charging; IP56 dust and splash resistance.
- Also works as a FIDO2 passkey for logins to sites like Google.
- Size 84.9 × 53.2 × 6.2 mm, weight 51 g, in three colors.
- Shipping firmware is version 1.0.3, listed in OneKey's [firmware feed](https://data.onekey.so/config.json).

All specifications are from the [product page](https://onekey.so/products/onekey-pro-2/) and the [launch post](https://onekey.so/blog/updates/onekey-pro-2-launch/). The launch post gives the weight as 53 g; we use the 51 g from the product page's specification table.

## Analysis and Verdict

We go through the hardware wallet questions of our methodology in order and stop at the first one the device fails.

**Is this product the original?** Yes. It is sold by OneKey on its own website and announced on its own blog.

**Was it released?** Yes. OneKey's [launch post](https://onekey.so/blog/updates/onekey-pro-2-launch/) says "These products are available starting today", and the [shop page](https://onekey.so/products/buy-onekey-pro-2/) sells it.

**Is it a wallet, and does it hold bitcoin?** Yes. It stores the keys for your coins and signs transactions on the device. The [product page](https://onekey.so/products/onekey-pro-2/) names Sparrow on Bitcoin among the multisig tools it works with.

**Does it come with keys already set up?** No. OneKey says "Private keys are generated inside the secure chip" ([launch post](https://onekey.so/blog/updates/onekey-pro-2-launch/)), and you write down your own recovery phrase during setup.

**Does it hide the keys from other devices?** OneKey says so: "transactions are signed there too, and private keys never leave the chip." The camera lets you sign without any cable or radio link to a phone or computer.

**Can you check what you sign on the device?** Yes. OneKey says every transaction is checked on the display, "amount and recipient address included, before it is signed" ([launch post](https://onekey.so/blog/updates/onekey-pro-2-launch/)).

**Is the source code public?** No, and this is where the analysis stops.

- OneKey claims that "the source code for both safeOS 2 and the OneKey App is publicly available on GitHub", but links only to its [GitHub account](https://github.com/OneKeyHQ), not to a repository.
- OneKey's [firmware feed](https://data.onekey.so/config.json) lists Pro 2 firmware 1.0.3, built from code version `261f11a74247`. The Neo's firmware is built from the same version.
- That version is in none of OneKey's 70 public GitHub repositories. The [firmware-pro](https://github.com/OneKeyHQ/firmware-pro) repository holds only the firmware of the older {% include walletLink.html wallet='hardware/onekey.pro' verdict='true' %}, version 4.x.
- OneKey's own [hardware SDK](https://github.com/OneKeyHQ/hardware-js-sdk/blob/onekey/.gitmodules) points to a `firmware-pro2` repository for safeOS 2. That repository is [not public](https://github.com/OneKeyHQ/firmware-pro2).
- A user [asked OneKey on GitHub](https://github.com/OneKeyHQ/firmware-pro/issues/431) on 2026-10-16 where the Pro 2 source is. The issue is still open, and OneKey has not replied.

**The OneKey Pro 2 gets the verdict {% include verdictBadge.html verdict="nosource" type='short' %}.** OneKey calls safeOS 2 open source, but the firmware the Pro 2 runs was built from code that is in none of OneKey's public repositories.
