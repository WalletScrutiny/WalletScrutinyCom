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
verdict: prefilled  # wip noita nowallet nobtc obfuscated custodial nosource nonverifiable reproducible bounty defunct plainkey
date: 2022-01-26
signer:
reviewArchive:


providerTwitter: 
providerLinkedIn: 
providerFacebook: Husky-HDW20-112466137545897
providerReddit: 
---


The device can connect to the Internet and is assigned its own IP address. It also comes with a companion app:

- {% include walletLink.html wallet='android/com.husky.hdw20' verdict='true' %}

## Advertised features

- 2 Core, 240 MHz Microcontrollers
- 2.8 LED Display
- Capacitative Touch Screen
- Long Range Wi-Fi connection
- Connects with Phone or PC
- Over-the-air firmware updates
- Updates sent straight to device
- A long-range Wi-Fi connection allows sending Bitcoins from any device at your home network.

## Verdict 

The device [can connect to the Internet](https://www.huskywallet.com/articles/how-to-install-software/) via Wi-Fi. The firmware is also updated via the Wi-Fi connection and "straight to the device". Up to what extent these updates can pose as security risks is beyond us. Needless to say, this opens up the device to online threats.

We could not find documentation on how this specific device generates the private keys. There is a [mention about private key generation](https://www.huskywallet.com/articles/set-single-address/) on their website but it is more of a general article rather than a user's guide. But one thing is for sure, if the wallet is connected via Wi-Fi and is assigned its own IP address, it is most definitely online. 

In the front page of the Husky Wallet's website, it states:

> A private key stored at the dedicated chip makes bitcoin transaction signing not accessible for software and hardware hackers.

There is no direct specification whether this private key was generated offline or pre-generated right after manufacture and before it is shipped to the user. We're inclined to reach out to Husky but they do not have a twitter account. However, we will send them an email.

Until further information is made available we would have to assume that the keys are stored on the device.

