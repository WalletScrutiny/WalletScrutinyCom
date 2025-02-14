---
title: SafePal X1
appId: safepalx1
authors:
- danny
released: 
discontinued: 
updated: 
version: 
binaries: 
dimensions:
- 86
- 54
- 6
weight: 
provider: SafePal
providerWebsite: https://www.safepal.io
website: https://shop.safepal.io/products/safepal-hardware-wallet-s1-bitcoin-wallet
shop: https://shop.safepal.io/products/safepal-hardware-wallet-s1-bitcoin-wallet
country: CH
price: 69.99USD
repository: https://github.com/SafePalWallet/safepal-x1
issue: https://github.com/SafePalWallet/safepal-x1/issues/1
icon: safepalx1.png
bugbounty: 
meta: ok
verdict: nosource
appHashes: 
date: '2024-12-08'
signer: 
reviewArchive: 
twitter: iSafePal
social:
- https://www.youtube.com/channel/UCfqztNiZWV62Eu9kiqKf6WQ
- https://t.me/SafePal_official
- https://www.instagram.com/isafepal/
- https://www.linkedin.com/company/14504410/admin/
- https://www.facebook.com/iSafePal
features: 

---

**Update 2024-12-08:** While a code repository does show recent activity, issues do not get addressed by the provider, including no build instructions or confirmation that this repository is indeed what they claim to be the source of the hardware wallet's firmware.

## Update

- Some people have commented on the issue we created. Despite claims made by the company in [blog posts](https://blog.safepal.com/safepal-x1-open-source-wallet-suite/), it has not fully made the firmware source-available.
- Furthermore, its [X1 Firmware Upgrade History](https://safepalsupport.zendesk.com/hc/en-us/articles/18732453314715-X1-Firmware-Upgrade-History) shows activity reaching up to version 1.0.6 which was released on March 21, 2024. These firmware upgrades are not reflected in the repository.
- The lack of correspondence, updates in the repository as well as other details (such as release tags, etc), lead us to give an alternative verdict. 
- The firmware is **not source-available**.

## Previous Review 2024-01-08

- SafePal X1 takes on a design more similar to a calculator; an interface that includes a screen and buttons. This allows users to view transaction details on the wallet.
- It uses the Secure Chip EAL5+ and can connect to external devices either through USB or Bluetooth.
- Its companion app is {% include walletLink.html wallet='android/io.safepal.wallet' verdict='true' %} for android and {% include walletLink.html wallet='iphone/walletapp.safepal.io' verdict='true' %} for iPhone along with a few extensions for browser use [here.](https://www.safepal.com/extension) 

Although we found a repository named "safepal-x1" we didn't find a complete README, build instructions, or even confirmation that this is in fact the official safepal-x1 firmware. Until further updates, this product is also **non-verifiable.**

We sent them a friendly note on their GitHub [issues page](https://github.com/SafePalWallet/safepal-x1/issues/1).