---
title: Justin Moon BitBoy DIY Hardware Wallet
appId: justinmoon.bitboy.diy
meta: defunct
verdict: nobtc

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

