---
title: p(x)Card
appId: pxcard
authors:
- danny
released: 
discontinued: 
updated: 
version: 
binaries: 
dimensions: 
weight: 
provider: FunctionX
providerWebsite: https://www.functionx.io/home
website: https://pxcard.io/
shop: 
country: 
price: 
repository: 
issue: 
icon: pxcard.png
bugbounty: 
meta: ok
verdict: noita
appHashes: 
date: '2024-10-22'
signer: 
reviewArchive: 
twitter: pxcard_official
social:
- https://www.youtube.com/channel/UCYsNryvy53XR1UYVKmyHR0g
features: 

---

<iframe width="560" height="315" src="https://www.youtube.com/embed/tlhId-1wjIQ?si=tOTnn5MWJzvMMX6q" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>

It is paired with the {% include walletLink.html wallet='android/com.pundix.functionx' verdict='true' %}.
It can also be used with {% include walletLink.html wallet='hardware/pundix.pos' verdict='true' %}

## Update 2024-10-22

After a year, the site now describes the product as being 'sold-out'. 
They've recently [added BTC support on Mar 15, 2024.](https://youtu.be/5knLnBCRsVM?si=0BAH6X1bJhl4I_Mf)

> p(x)Card is a self-custody hardware wallet that can securely create and store its own private keys. Users can use p(x)Card to authorize crypto payment via the p(x)Change app, the noncustodial point-of- sale platform or XPOS point-of-sale platform, without using their own internet-connected devices.

It features:

- Multiple blockchain support (including Bitcoin)
- NFT accessible

We also posted on [X.com](https://x.com/dannybuntu/status/1848570049944269247) to ask them, when they would be releasing the device again.

## Analysis

- The NFC card, does not have its own display and touchpad. It relies on the companion app in order to transact. 
> - They claim that the private key does not leave the card
> - A hardwallet card built upon Infineon technologies SECORA™ Blockchain security solution and Function X network infrastructure
> - p(x)Card securely stores both your digital assets and your private key. When authorizing the withdrawal, you use p(x)Card to sign transactions via NFC technology.
> - Made with top rated security
> - The hardware wallet card is equipped with Infineon's field-proven security chip featuring Integrity Guard security technology, supporting Global Platform Secure Channel Protocol 03 (SCP03) for secure authentication and encrypted communication.
> - Multi-chain & DePIN enabled and easy to use
> - p(x)Card supports multiple blockchain networks, including Function X, BNB Smart Chain, Ethereum, Polygon, and more. It is a self-custody hardware wallet card and stays offline like your cold storage wallet. No more complicated settings are required.

## Verdict

The lack of a screen or control mechanism on the actual device means that it engages in 'blind-signing.' This is because a compromised or malicious companion app could display misleading information, resulting in the device signing transactions without the user being able to verify the true details.

## Overview 2023-03-10

{{ page.title }} remains unreleased as off this date, but it recently held a [Presale Whitelisting Campaign](https://gleam.io/NuMHV/pxcard-presale-whitelisting-campaign-30-off-with-pundixfx) from Feb. 28, 2023 to Mar 06, 2023.

As of this review, it does not have an official store page yet.

{{ page.title }} does not have a screen or buttons for confirming transactions and it appears to be able to connect via NFC. 


