---
title: BitExchange HardID Hardware Wallet
appId: bitexchange.hardid
authors:
- danny
released: 2017-11-15
discontinued: 
updated: 2018-04-18
version: 
binaries: 
dimensions: 
weight: 
provider: >-
  Blockchain Labs / (Lightning ASIC Shenzhen Intelligent Company Limited) / Hong
  Kong BitExchange Co., Ltd.
providerWebsite: 
website: https://www.hardid.org/
shop: https://www.lightningasic.com/product/Bitcoinminer/45.html
country: CN
price: 149USD
repository: https://github.com/lightningasic/BitExchange-Hardware-Wallet
issue: 
icon: bitexchange.hardid.png
bugbounty: 
meta: defunct
verdict: plainkey
date: 2022-04-14
signer: 
reviewArchive: 
twitter: 
social:
- mailto:admin@lightningasic.com

---

## Background 

We searched for Blockchain Labs and there was one in the UK, one in Malaysia, one in MIT, and many others. BitExchange is a common name as well with a [defunct exchange found in archive.org](https://web.archive.org/web/20180918065154/http://www.bitexchange.com.hk/public/). Normal text results for "BitExchange HardID" did not yield a lot of information neither. Our breakthrough came when we searched for the logo to the related [GitHub page](https://github.com/lightningasic/BitExchange-Hardware-Wallet). The associated logo is linked to a Chinese company named LIGHTNINGASIC with a [page](https://www.lightningasic.com/product/Bitcoinminer/45.html) that featured the {{ page.title }}. It retailed for $149 USD. 

The discrepancy lies with the fact that the primary domain hardid.org did not link to purchase options which allowed users to buy the device. Lightningasic.com did. 

## Product Description 

The code is based off [**archived** Trezor firmware](https://github.com/lightningasic/BitExchange-Hardware-Wallet).

Product Features as described from [LIGHTNINGASIC](https://www.lightningasic.com/product/Bitcoinminer/45.html): 

> - Easy and security to store the bitcoin.
- Generate private key random , and signature independent.
- PIN code and seeds. Double security .
- Open source code.
- Sapphire Glass
- Touch screen
- Super slim: 3.8mm only
- CNC Aluminum case
- Custom laser printing on backside

From the [HardID.org documentation page](https://bitexchange-webwallet-doc.readthedocs.io/en/latest/BitExchange-HardID-Tools-Manual/BitExchange-HardID-Tools-Manual.html#recovery-wallet):

> Your bitcoin can be conveniently and safely managed through BitExchange HardID Hardware Wallet equipment. Private key’s generation, storage and signature calculation in BitExchange HardID Hardware Wallet can be finished. In the whole management process of bitcoin, private key is protected from the physical isolation, 
>
> HardID Hardware Wallet adopts OLED monochrome screen with 0.96 -inch and 128 * 64 resolution to display information, shell adopts stainless steel case with gorilla glass as protection screen, control button is touch button, update key,and it has these functions such as dust-proof and fall resistance.

## How it works 

As documented from the homepage and the [documentation page](https://bitexchange-webwallet-doc.readthedocs.io/en/latest/BitExchange-HardID-Tools-Manual/BitExchange-HardID-Tools-Manual.html#download-the-offline-toolbox):

> 1. Install Offline Tool & initialize device<br />
After buying the hardware wallet, you need to download our Offline Tool to initialize the device. When initializing the device we recommend you choose a 24 word seed and store it on paper in a safe place. It is very important that you don’t lose this 24 word secret, otherwise you will lose your cryptocurrencies.
<br />
![picture](https://bitexchange-webwallet-doc.readthedocs.io/en/latest/_images/eng2.png)  
<br /> 
> 2. Install Chrome extension<br />
Before you start using hardID, you also need to download our browser extension for Google Chrome. After installing this extension the browser will be able to communicate hardID.

## Analysis 

Firstly, the exchange is no longer in existence. The last capture for the domain bitexchange.com.hk on archive.org was in 2019. HardID.org is due to expire in 2022. 

As the "Buy" button yields "This product doesn't exist!", we assume it is **not for sale anymore**.

