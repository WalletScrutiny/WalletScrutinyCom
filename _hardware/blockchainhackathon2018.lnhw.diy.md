---
title: Blockchain Hackathon 2018 Lightning Network DIY Hardware Wallet
appId: blockchainhackathon2018.lnhw.diy
authors:
- danny
released: 2018-06-30
discontinued: 
updated: 2018-08-28
version: 
binaries: 
dimensions:
- 51
- 23
- 8
weight: 
provider: Blockchain Hackathon 2018
providerWebsite: 
website: https://web.archive.org/web/20180819110143/https://blockchain-hackathon.com/
shop: 
country: PT
price: 
repository: https://github.com/hkjn/lnhw
issue: 
icon: blockchainhackathon2018.lnhw.diy.png
bugbounty: 
meta: defunct
verdict: diy
appHashes: 
date: 2022-05-20
signer: 
twitter: chainsmiths
social: 
features: 

---

## Background 

The Blockchain Hackathon 2018 was an event held in Lisbon, Portugal. Participants formed teams to build a product related to blockchain. The first prize was 10,000 EUR. The team that won created this device. 

From the [GitHub repository:](https://github.com/hkjn/lnhw)

> This is a early prototype demonstrating how a LN hardware wallet might be constructed. We hope to continue developing the project into a toolkit to make it easier for anyone to build their own hardware wallet. We would not recommend anyone try to build a wallet or run the UI based on the current code, especially for real funds. Watch this space for updates.

The winning team was comprised of: 

- Stepan Snigirev
- Gustavo Silva
- Lairs Henrik Johnstone
- Justin Moon
- Stephanie Stroka
- Akhilesh Arora
- Michael Folkson
- Sebastian Kung 
- Jonathan Cross 
- Sebastian van Staa
- Nelson 

## Description 

[Slide Presentation](https://github.com/hkjn/lnhw/blob/master/chainhack-slides.pdf) of the Device

> The conceptual layers were:
> 
- ui layer: what's shown directly to the user on the laptop, as well as the logic talking to lightningd
- client layer: patched c-lightning, running on linux desktop (possibly mobile later)
- hardware layer: code running on Arduino devices to provide a reasonably secure wallet
>
> The prototype we pitched and demoed used a Linux / MacOS laptop with bitcoind and our patched lightningd running, as well as a Python web backend to communicate with lightningd, and to serve requests from the React frontend code.
>
> ### client notes
>
> We have a fork of c-lightning at hkjn/lightning, where we added patches to allow the private key material to stay on the hardware wallet and not be exposed to the client device (Linux laptop). At least that was the ideal, which turned out not to be fully feasible within the roughly two days for the Hackathon..

## Analysis 

Since the hackathon, the project has not received any additional updates. This renders the device **defunct**. We do not believe this specific project became commercially available. However, the instructions for building the device are there which makes it a **do-it-yourself project**.
