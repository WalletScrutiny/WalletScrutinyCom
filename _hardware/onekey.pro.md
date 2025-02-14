---
title: OneKey - Pro
appId: onekey.pro
authors:
- danny
released: '2024-03-05'
discontinued: 
updated: '2025-01-06'
version: '4.11.0'
binaries: 
dimensions:
- 90
- 54
- 7.6
weight: 65
provider: Bixin
providerWebsite: https://onekey.so/
website: https://shop.onekey.so/
shop: https://shop.onekey.so/products/onekey-pro
country: CN
price: 270USD
repository: https://github.com/OneKeyHQ/firmware-pro
issue: 
icon: onekey.pro.png
bugbounty: https://github.com/OneKeyHQ/app-monorepo/blob/onekey/docs/BUG_RULES.md
meta: ok
verdict: wip
appHashes: 
date: '2025-01-07'
signer: 
reviewArchive: 
twitter: OneKeyHQ
social:
- https://www.reddit.com/r/OneKeyHQ
- https://www.youtube.com/@onekeyhq
features: 

---

## [Product Documentation](https://help.onekey.so/hc/en-us/articles/9384870496143-Authenticate-OneKey-Pro)

<iframe width="560" height="315" src="https://www.youtube.com/embed/YoEni3zAqUo?si=t4Cftm00KnW7b8Za" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>

> - The OneKey App desktop client and browser extension only support connecting to the hardware wallet via USB cable. The mobile app only supports connecting via Bluetooth.
> - The OneKey Pro can be updated via USB cable or Bluetooth. If by BlueTooth, the OneKey app is used. If through USB, the OneKey Desktop or Web App is used.  

1. Can the private keys be created offline? - ✔️ Yes
- As demonstrated [in this video](https://www.youtube.com/shorts/VxunFeDL8nU).
- The device has Air-Gap mode which completely isolates it from networks
- The information explicitly states it provides "offline storage of private keys"

2. Are the private keys shared? - **?** 
- The device keeps private keys in the secure element (EAL6+ chips)
- There may be some question regarding this [statement](https://help.onekey.so/hc/en-us/articles/11187527886095-Back-up-your-OneKey-Pro-with-OneKey-Lite) which allows the device to also backup the private keys to the {% include walletLink.html wallet='hardware/onekey.lite' verdict='true' %}: 
> "The OneKey Pro will search for the OneKey Lite card and transfer the **encrypted** recovery phrase securely."
- Note that the OneKey Lite can also pair with the {% include walletLink.html wallet='android/so.onekey.app.wallet' verdict='true' %}

3. Does the device display the receive address for confirmation? - ✔️ Yes. 
- From the usage instructions: "select your receive account and copy the wallet address"
- Has a 3.5-inch color touchscreen display

4. Does the interface have a display screen and buttons which allows the user to confirm transaction details? - ✔️ Yes. 
- Has a 3.5-inch IPS color touchscreen
- Transaction signing process is explicitly described with user confirmation steps
- Device shows transaction details for signing via QR codes

5. Is it reproducible? - **?**

    For now, the device is **for verification**. 