---
title: OneKey Neo
appId: onekey.neo
authors:
- danny
released: 2026-11-09
discontinued: 
updated: 
version: 1.0.3
binaries: https://data.onekey.so/config.json
dimensions:
- 84.9
- 53.2
- 6.1
weight: 48
provider: Bixin
providerWebsite: https://onekey.so/
website: https://onekey.so/products/onekey-neo/
shop: https://onekey.so/products/buy-onekey-neo/
country: HK
price: 179USD
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

OneKey Neo is a touchscreen hardware wallet that OneKey [launched on 2026-11-09](https://onekey.so/blog/updates/onekey-neo-launch/) for $179. It is a cheaper sibling of the {% include walletLink.html wallet='hardware/onekey.pro2' verdict='true' %}, with the same screen and the same operating system, safeOS 2, but two secure elements instead of four and no camera. It works with the {% include walletLink.html wallet='android/so.onekey.app.wallet' verdict='true' %} and, for Bitcoin multisig, with Sparrow.

- 3.54-inch color AMOLED touchscreen, 1024 × 604 pixels, up to 800 nits.
- Two EAL6+ secure elements; OneKey says keys are created, stored and used only inside them.
- Connects over Bluetooth, USB-C and NFC. No camera, so no QR-code signing.
- Backup as a 12- or 24-word recovery phrase, or as 20-word SLIP-39 shares.
- Optional SeedCard ($39) stores an encrypted copy of the recovery phrase over NFC.
- 700 mAh battery with wireless and USB-C charging; IP56 dust and splash resistance.
- Also works as a FIDO2 passkey for logins to sites like Google and GitHub.
- Size 84.9 × 53.2 × 6.1 mm, weight 48 g, in four colors.
- Shipping firmware is version 1.0.3, listed in OneKey's [firmware feed](https://data.onekey.so/config.json).

All specifications are from the [product page](https://onekey.so/products/onekey-neo/) and the [shop page](https://onekey.so/products/buy-onekey-neo/).

## Analysis and Verdict

We go through the hardware wallet questions of our methodology in order and stop at the first one the device fails.

**Is this product the original?** Yes. It is sold by OneKey on its own website and announced on its own blog.

**Was it released?** Yes. OneKey's [launch post](https://onekey.so/blog/updates/onekey-neo-launch/) says "OneKey Neo is available today", and the [shop page](https://onekey.so/products/buy-onekey-neo/) sells it for $179.

**Is it a wallet, and does it hold bitcoin?** Yes. It stores the keys for your coins and signs transactions on the device. The [product page](https://onekey.so/products/onekey-neo/) names Sparrow on Bitcoin among the multisig tools it works with.

**Does it come with keys already set up?** No. OneKey says keys are "independently generated" inside the secure elements, and the box includes a recovery sheet for writing down your own backup.

**Does it hide the keys from other devices?** OneKey says so: "Throughout generation, storage, and signing, private keys never leave the secure element." The SeedCard backup is encrypted and protected by a PIN.

**Can you check what you sign on the device?** Yes. The 3.54-inch touchscreen shows "amounts, complete recipient addresses, and approval scopes" before you sign ([launch post](https://onekey.so/blog/updates/onekey-neo-launch/)).

**Is the source code public?** No, and this is where the analysis stops.

- OneKey claims that "the source code for both safeOS 2 and OneKey App is completely open source on GitHub", but links only to its [GitHub account](https://github.com/OneKeyHQ), not to a repository.
- OneKey's [firmware feed](https://data.onekey.so/config.json) lists Neo firmware 1.0.3, built from code version `261f11a74247`.
- That version is in none of OneKey's 70 public GitHub repositories. The [firmware-pro](https://github.com/OneKeyHQ/firmware-pro) repository holds only the older OneKey Pro firmware, version 4.x. Its "neo" branch adds support for the NEO coin, not this device.
- OneKey's own [hardware SDK](https://github.com/OneKeyHQ/hardware-js-sdk/blob/onekey/.gitmodules) points to a `firmware-pro2` repository for safeOS 2. That repository is [not public](https://github.com/OneKeyHQ/firmware-pro2).
- A user [asked OneKey on GitHub](https://github.com/OneKeyHQ/firmware-pro/issues/431) on 2026-10-16 where the safeOS 2 source is. The issue is still open, with no reply from OneKey.

**The OneKey Neo gets the verdict {% include verdictBadge.html verdict="nosource" type='short' %}.** OneKey calls safeOS 2 open source, but the firmware the Neo runs was built from code that is in none of OneKey's public repositories.
