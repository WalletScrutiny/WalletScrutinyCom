---
title: SCTECHONE Touch xWallet
appId: sctechone.touchxwallet
authors:
- danny
released: '2018-05-28'
discontinued: 2022-04-10
updated: 
version: 
binaries: 
dimensions:
- 86
- 54
- 3
weight: 
provider: SCTECHONE CO., LTD
providerWebsite: https://web.archive.org/web/20200127161045/http://www.sctechone.com/
website: 
shop: 
country: KR
price: 
repository: 
issue: 
icon: sctechone.touchxwallet.png
bugbounty: 
meta: defunct
verdict: plainkey
appHashes: 
date: '2022-05-19'
signer: 
reviewArchive: 
twitter: 
social:
- https://www.youtube.com/channel/UCsbq19j1XK-qQmF5jTa5FOA
- https://www.instagram.com/touchxwallet/?hl=en
features: 

---

## Description 

The {{ page.title }} has a horizontal smart card form factor with biometric capabilities and an e-ink display. The fingerprint scanner becomes a control interface after fingerprint initialization. It can pair with a mobile app. 

The device's homepage is no longer online. We suspect that the product has been discontinued.

From another [website](https://www.fingerprints.com/2018/05/28/biometrics-by-fingerprints-in-new-cryptocurrency-wallet-from-sctechone/): 

> In the Touch xWallet, transactions are made safely with digital signatures between the card and mobile app via Bluetooth (BLE) when the correct fingerprint is in place. Its user can easily check info on the integrated display on the card, using the unique feature FPC MoveTouch® to scroll on the fingerprint sensor to select what is shown and what actions to make.

## User Manual

This is a copy of the [user manual](https://data2.manualslib.com/pdf7/149/14866/1486503-sctechone/sctfido02.pdf?5904009233330226c2ed9f431497a290). 

> Power sensor
- On finger sensor bezel, the power sensor allows to turn the device On/Off with finger touch (for more than 1 second).
>
> Finger sensor
- With registered fingerprint, verifies finger authentication and unlockes the TouchWallet
- With registered fingerprint, behaves as a navigational pad.
> 
> Display
- Using E-ink, displays menu and battery change
>
> Change Port 
- With built-in Micro-USB charge, charges using a smartphone charger 

### Private keys can be created offline - ✔️

### Private keys are not shared - ❓

The user manual does not describe how the private keys are secured. We do know that the device can be paired with a mobile app using Bluetooth. We could not find the app anymore.

### Device displays receive address for confirmation - ✔️

### Interface - ✔️

### Code and Reproducibility - ❌

## Analysis 

Since the device is no longer available in the market, we find it moot and academic to spend further time on it. Its website is offline and we could no longer find the device in Amazon.com. It pairs with a mobile app so there is a possibility for leaking private key information. Finally, we could also not find links to its source code.

