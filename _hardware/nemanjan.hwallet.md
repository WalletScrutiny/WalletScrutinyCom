---
title: HWallet
appId: nemanjan.hwallet
authors:
- danny
released: 2018-11-12
discontinued: 
updated: 
version: 
binaries: 
dimensions: 
weight: 
provider: Nemanja Nikodijević
providerWebsite: 
website: 
shop: 
country: 
price: 
repository: https://gitlab.com/nemanjan/hwallet
issue: 
icon: nemanjan.hwallet.png
bugbounty: 
meta: obsolete
verdict: diy
date: 2022-04-11
signer: 
reviewArchive: 
twitter: 
social: 

---

## Background

Nemanja Nikodijević is a security researcher who has managed to create an Open Source hardware wallet called hwallet that uses [significantly less lines of code than ColdCard, Trezor, Ledger and KeepKey](https://youtu.be/0sgF5klTcD8?t=657).

He elaborates in this video:

In the below video Nemanja Nikodijević claims that his Open Source Hardware
Wallet is significantly less complex than the top competitors. By his count, the lines of code are:

* 2.5 million in {% include walletLink.html wallet='hardware/coldcardMk3' verdict='true' %}
* 346 thousand in {% include walletLink.html wallet='hardware/ledgerNanoS' verdict='true' %}
* 162 thousand in {% include walletLink.html wallet='hardware/trezorOne' verdict='true' %}
* 122 thousand in {% include walletLink.html wallet='hardware/keepKey' verdict='true' %}
* 4 thousand in his product

<iframe width="560" height="315" src="https://www.youtube.com/embed/0sgF5klTcD8" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

Huge part he blames on the lack of hardware acceleration - if the chip used can't do fancy cryptography natively, the software has to do it. While this is true, it doesn't mean that those features are not implemented somewhere. They are implemented in silicon. We won't go into details here but a more feature-rich chip might be more complex in other areas and from that increase the attack surface again.

The other part where his claims are flawed is that his product doesn't support all the features the other mentioned products do.

Lastly, as he counts license headers - that is code comments - as "lines of code", what else did he count? Empty lines? Code documentation, which only improves security as it helps with audits while not being executable and thus not increase the attack surface.

The hwallet is not commercially available and is a DIY bitcoin hardware wallet. He built the project in order to prove that there is a simpler and safer way to build bitcoin hardware wallets compared to current commercially available solutions.

## Wallet Description 

From his [repository](https://gitlab.com/nemanjan/hwallet), the required components are:

- FRDM-K82F or FRDM-KL82Z
- Pmod OLED 

## Analysis 

This is an Open Source **DIY** project.
