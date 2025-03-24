---
title: Arcbtc LNbits Hardware Wallet
appId: arcbtc.lnbits.hww
authors:
- danny
released: 2022-07-22
discontinued: 
updated: 2022-12-12
version: '0.2'
binaries: 
dimensions: 
weight: 
provider: ArcBTC
providerWebsite: https://lnbits.com/
website: 
shop: https://shop.lnbits.com/product/lnbits-bitcoin-hardware-wallet
country: UK
price: 20 GBP
repository: https://github.com/lnbits/hardware-wallet
issue: 
icon: arcbtc.lnbits.hww.png
bugbounty: 
meta: ok
verdict: diy
appHashes: 
date: 2023-02-14
signer: 
reviewArchive: 
twitter: arcbtc
social: 
features: 

---

## Product Description 

> This product includes the following items:
> 
> - LilyGo TTGO ESP32 microcontroller
> - USB C cable
> - A 3D printed case for the hardware wallet.

It is possible to flash the binaries from a browser [here](https://lnbits.github.io/hardware-wallet/installer/).

> This very cheap off the shelf hardware wallet is designed to work with Lilygos Tdisplay, but you can easily make work with any ESP32.
>
> Data is sent to/from the Hardware Wallet over webdev Serial, not the most secure data transmission method, but fine for handling small-medium sized amounts of funds. You can use LNbits OnchainWallet extension, or any other serial monitor.
> 
> ### Install instructions
> - Flash the hardware-wallet firmware directly from the browser using the installer
> - Build instructions
> - Buy a Lilygo Tdisplay (although with a little tinkering any ESP32 will do)
> - Install Arduino IDE 1.8.19
> - Install ESP32 boards, using boards manager
> - Download this repo
> - Copy these libraries into your Arduino install "libraries" folder
> - Open this wallet.ino file in the Arduino IDE
> - Select "TTGO-LoRa32-OLED-V1" from tools>board
> - Upload to device

From the [GitHub repo](https://github.com/lnbits/hardware-wallet)

## Analysis 

Although this kit is packaged as a device, it can still be classified as a **do-it-yourself** hardware wallet since the end user would have to perform some additional steps prior to making it work.

