---
title: Keypair Keywallet Touch Reader
appId: keypair.keywallet.touch.reader
authors:
- danny
released: 
discontinued: 
updated: 
version: 
binaries: 
dimensions:
- 75
- 75
- 13
weight: 53
provider: Keypair
providerWebsite: https://keypair.co.kr/
website: https://keywallet.co.kr/
shop: 
country: KR
price: 
repository: 
issue: 
icon: keypair.keywallet.touch.reader.png
bugbounty: 
meta: ok
verdict: nowallet
date: 2022-05-19
signer: 
reviewArchive: 
twitter: keywallet
social:
- https://www.facebook.com/KeyWallet-115870833116672/
- https://medium.com/@keywallet/

---

## Background 

This NFC card reader is used together with the {% include walletLink.html wallet='hardware/keywallettouch' verdict='true' %}. It can be used with a PC or with an iPhone. Some Android models have NFC capability. 

## Product Description

The NFC reader is powered through a USB port and connects through Bluetooth. It can be seen on this video:

<iframe width="560" height="315" src="https://www.youtube.com/embed/UWW0nPimz4k" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

In the video, once the device is paired with the phone, wallet operations can be performed. {% include walletLink.html wallet='android/kr.co.keypair.keywalletTouch' verdict='true' %}

## Analysis 

The NFC reader is an intermediary device that allows mobile devices with no NFC capability to interface with the {% include walletLink.html wallet='hardware/keywallettouch' %}. It **does not perform the functions of a bitcoin wallet**. 


