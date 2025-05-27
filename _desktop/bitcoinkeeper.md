---
title: Bitcoin Keeper Desktop
appId: bitcoinkeeper
authors:
- danny
released: 2024-02-17
discontinued: 
updated: 2025-03-13
version: 0.2.1
binaries: https://github.com/bithyve/keeper-desktop/releases/
provider: BitHyve Limited
providerWebsite: https://bithyve.com/
website: https://bitcoinkeeper.app/
repository: https://github.com/bithyve/keeper-desktop
issue: 
icon: bitcoinkeeper.jpg
bugbounty: 
meta: ok
verdict: nowallet
date: 2025-04-14
twitter: bitcoinKeeper_
social:
- https://www.youtube.com/channel/UCMqDNxbz16w8pxpmsa6s8GQ
- https://www.linkedin.com/company/bithyve
- https://t.me/bitcoinkeeper
features: 

---

## Related to

- {% include walletLink.html wallet='android/io.hexawallet.bitcoinkeeper' verdict='true' %}
- {% include walletLink.html wallet='iphone/io.hexawallet.keeper' verdict='true' %}

## App Description

> Keeper is a secure bitcoin key management app

It integrates with the following hardware devices: Bitbox02, ColdCard, Jade, Ledger, and Trezor hardware wallets. Windows, Linux and macOS are supported. Keeper incorporates the functions of what it calls, "Special Keys" such as a Server, Inheritance and Emergency keys. These have special functions depending on the use case required. 

Once the desktop application is initialized, this message appears: 

> - You can add devices, register vaults and sign transactions using Keeper's desktop app. 
> - Open the Keeper mobile app to select your desired action, then scan the QR code to continue
>
> Note: This QR will give your mobile app the key to establish a secure E2E encrypted connection with the desktop app.

A QR code is present for the mobile app to scan.

We scanned the QR code using the mobile app, but it errored out: 

> "Please export the xpub from the instructed section of the hardware wallet"

We cannot find a way to export the xpub from the desktop app.

Digging around for more information, we do not see the desktop app as performing the functions of a wallet in a sense that it can generate or store private keys. It acts more like a coordinator between various devices in a multi-signature setup. Strictly speaking, from our standpoint, it is not a wallet in and of itself. As its description states - it serves as the companion to the mobile app and thus, **not a wallet**. 