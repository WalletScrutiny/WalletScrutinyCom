---
title: "Husky HDW20"
appId: huskyhdw20
authors:
- danny
released: 2021-02-23
discontinued: # date
updated: 
version: 1.0.4
dimensions: [100, 70, 25]
weight: 200
website: https://www.huskywallet.com/
shop: https://www.huskywallet.com/shop/
company: Embedded Agency LLC
companywebsite: https://embedded.agency/
country: CA
price: 129USD
repository:
issue:
icon: huskyhdw20.png
bugbounty:
meta: ok
verdict: nosource
date: 2022-02-18
signer:
reviewArchive:

providerTwitter: 
providerLinkedIn: 
providerFacebook: Husky-HDW20-112466137545897
providerReddit: 
---


The device can connect to the Internet via Wi-Fi. It also comes with a companion app:

- {% include walletLink.html wallet='android/com.husky.hdw20' verdict='true' %}

## Advertised features

> - 2 Core, 240 MHz Microcontrollers
> - 2.8 LED Display
> - Capacitative Touch Screen
> - Long Range Wi-Fi connection
> - Connects with Phone or PC
> - Over-the-air firmware updates
> - Updates sent straight to device
> - A long-range Wi-Fi connection allows sending Bitcoins from any device at your home network.

## Verdict 

The device [can connect to the Internet](https://www.huskywallet.com/articles/how-to-install-software/) via Wi-Fi. The firmware is also updated via the Wi-Fi connection "straight to the device". Needless to say, while internet connection adds convenience, it also increases the attack surface.

We could not find documentation on how this specific device generates the private keys. There is a [mention about private key generation](https://www.huskywallet.com/articles/set-single-address/) on their website but it is more of a general article rather than a user's guide.

In the front page of the Husky Wallet's website, it states:

> A private key stored at the dedicated chip makes bitcoin transaction signing not accessible for software and hardware hackers.

There is no direct specification whether this private key was generated offline or pre-generated right after manufacture and before it is shipped to the user. Giving them the benefit of the doubt, after all "New Wallets" [can be created](https://www.huskywallet.com/articles/how-to-test-your-wallet/), which leads us the question if the firmware's source code is available. Sadly there is no mention of source code anywhere.

Without the source code being available, this product is **not verifiable**.

