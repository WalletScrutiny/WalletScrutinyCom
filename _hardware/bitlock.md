---
title: Bitlock
appId: bitlock
authors:
- danny
released: 
discontinued: 
updated: 
version: 
binaries: 
dimensions: [60, 30, 6]
weight: 12
provider: Senselock Software Technology, Seculab-Europe and Delerex Pte. Ltd.
providerWebsite: 
website: https://bitlock.io
shop: 
country: SG
price: 79USD
repository: 
issue: 
icon: bitlock.png
bugbounty: 
meta: ok
verdict: vapor 
date: 2022-04-26
signer: 
reviewArchive: 
twitter: 
social:
---


## Background 

It was initially announced on July 11, 2018 through [BitcoinTalk](https://bitcointalk.org/index.php?topic=4641751.0). {{ page.title }}'s PDF specifications file can still be accessed via [archive.org](https://web.archive.org/web/20180822211510/https://bitlock.io/files/BitLock.pdf). The Bitlock was co-developed by Senselock Software Technology Co., Ltd, Seculab., LTD UAB Seculab-Europe, and Delerex Pte. Ltd. 

The website for [Bitlock is currently parked.](https://www.isitdownrightnow.com/bitlock.io.html)

Bitlock supports BTC, ETH, ERC20 tokens, ETC, Zcash, Namecoin, Litecoin, and Dogecoin. 

It was also announced that only 1000 units will be produced in 2018.

## Product Description 

> Crypto Firewall: predefined rules authorizing outgoing transactions.
>
> Two-factor authorization: convenient mobile application responsible for two-factor authorization based on biometrical identification.
>
> Under pressure mode: different access passwords give access to different wallets. Reset password cleans BitLock content.
>
> Full backup: backup BitLock content to encrypted file container and transfer it to another key if something goes wrong.

> Bitlock Software 
>
> BitLock firmware - open-source, audited, upgradable firmware.
>
> BitLock daemon - local server interacting with BitLock dongle.
>
> BitLock wallet - Chrome plugin interacting with blockchains and BitLock
daemon. BitLock wallet is responsible for fetching balances, creating
transactions, pushing outgoing transactions to blockchains

> Bitlock Hardware 
>
> ARM SC300 32-bit processor built on EAL5+ certified smart-card
technology;
> - 50MIPS computations speed;
- ARM Thumb instruction set;
- Up to 512K of read-only memory space;
- Data input and output;
- Card OS and file system;
- General encryption and decryption algorithm;

## Analysis 

Quoted from [BitcoinTalk:](https://bitcointalk.org/index.php?topic=4641751.msg41980381#msg41980381) 

> Unlike those devices (Ledger and Trezor) BitLock doesn't have a screen and buttons, and the authentication is performed on mobile phone. If you know, both are vulnerable because of insecure chip used for interacting with the screen, when Trezor doesn't have secured kernel at all. In Bitlock all software works within the kernel of smart-card. 

**All transactions are [confirmed via the mobile phone](https://bitcointalk.org/index.php?topic=4641751.msg42104784#msg42104784)**

> All transactions are confirmed on mobile that authorises data from BitLock received through secured by asymmetric RSA2048 algorithm channel.

Several years have passed and we do not see vestiges of the Bitlock device. From the description, however, we can glean that the device can be plugged into the USB port of a computer or through an adaptor on an Android mobile phone. 

We can also glean that the device has no interface.  

Transactions are confirmed via their own software. 

With these, **Bitlock most likely never went into production**.
