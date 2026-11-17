---
title: Keypair Keywallet Touch Reader
appId: keypair.keywallet.touch.reader
meta: ok
verdict: nowallet
archivedFrom: _hardware/keypair.keywallet.touch.reader.md
archivedCommit: 19fba48344e0c9de12317c3e65d71cce47979c4a

---

## Background 

This NFC card reader is used together with the {% include walletLink.html wallet='hardware/keywallettouch' verdict='true' %}. It can be used with a PC or with an iPhone. Some Android models have NFC capability. 

## Product Description

The NFC reader is powered through a USB port and connects through Bluetooth. It can be seen on this video:

<iframe width="560" height="315" src="https://www.youtube.com/embed/UWW0nPimz4k" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

In the video, once the device is paired with the phone, wallet operations can be performed. {% include walletLink.html wallet='android/kr.co.keypair.keywalletTouch' verdict='true' %}

## Analysis 

The NFC reader is an intermediary device that allows mobile devices with no NFC capability to interface with the {% include walletLink.html wallet='hardware/keywallettouch' %}. It **does not perform the functions of a bitcoin wallet**.
