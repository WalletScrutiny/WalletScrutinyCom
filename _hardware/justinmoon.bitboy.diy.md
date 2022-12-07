---
title: Justin Moon BitBoy DIY Hardware Wallet
appId: justinmoon.bitboy.diy
authors:
- danny
released: 2019-07-06
discontinued: 
updated: 2019-09-04
version: 
binaries: 
dimensions:
- 50
- 40
- 20
weight: 19.99
provider: Justin Moon
providerWebsite: https://diybitcoinhardware.com/
website: 
shop: 
country: US
price: 
repository: https://github.com/justinmoon/bitboy
issue: 
icon: justinmoon.bitboy.diy.png
bugbounty: 
meta: defunct
verdict: nobtc
date: 2022-05-26
signer: 
reviewArchive: 
twitter: _JustinMoon_
social: 

---

The {{ page.title }} is described as a *"A stateless, QR-airgapped hobbyist hardware wallet"*. It's built around a MakerFocus ESP32 Open Source Faces Pocket Computer. 

Its workflow is described as follows: 
>
> - Enter BIP39 seed on QWERTY keyboard
- (Optional) Export XPUB to desktop wallet with QR on device display
- Import unsigned PSBT with QR scanner
- After confirming outputs & fees, BitBoy will sign it
- Export signed PSBT with QR on device display 

Its firmware uses [Stepan Snigirev's Base MicroPython](https://github.com/stepansnigirev/esp32_upy_bitcoin). 

## Analysis 

The website diybitcoinhardware.com describes this project as a work in progress, but it **hasn't been updated since September 4, 2019**. Furthermore, the project states that its currently focused on Bitcoin's testnet - and not mainnet. The project therefore does not support BTC. 

