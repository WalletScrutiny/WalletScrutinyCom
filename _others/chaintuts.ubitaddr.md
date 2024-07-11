---
title: Chaintuts ubitaddr
appId: chaintuts.ubitaddr
authors:
- danny
icon: chaintuts.ubitaddr.png
date: 2022-05-19
released: 2019-08-12
updated: 2020-05-01
website: https://chaintuts.com/
repository: https://github.com/chaintuts/ubitaddr
twitter: chaintuts
social:
- https://www.facebook.com/chaintuts
- https://www.linkedin.com/in/jmcintyre-net/
- https://www.youtube.com/c/chaintuts
- https://www.reddit.com/user/pgh_ski
provider: Josh McIntyre
providerWebsite: https://jmcintyre.net/
country: US
meta: obsolete
verdict: diy

---

## Background 

> uBitAddr is an offline Bitcoin address generator for microcontroller platforms

This is a do-it-yourself project by [Josh McIntyre](https://github.com/joshmcintyre/ubitaddr) (Chaintuts).

## Video 

<iframe width="560" height="315" src="https://www.youtube.com/embed/BHsBATHy6Vk?start=1082" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

## Device Description 

The device uses: 

- Adafruit M4 platforms
- Grand Centeral M4, ItsyBitsy M4
- Runs on Atmel SAMD51, 256kb+ flash and 195kb+ RAM 

The device generates a private key and public key.

> - Generate a random private key and associated address for Bitcoin, Bitcoin Cash, Litecoin, Ethereum, and DigiByte
- Key formats include WIF (BTC, BCH, LTC, DGB) and HEX (ETH)
- Address formats include Legacy Base58 (BTC, LTC, DGB), CashAddr (BCH), and HEX (ETH)
- Display the address and private key on a character LCD screen, rotating every 30 seconds
- Print the address and private key via a thermal receipt printer

## Analysis 

The {{ page.title }} is a **do-it-yourself** private and public key generator. The code has not been updated for more than two years.


