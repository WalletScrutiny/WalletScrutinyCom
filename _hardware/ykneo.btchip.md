---
title: YubiKey Neo BTChip
appId: ykneo.btchip
authors:
- danny
released: 2013-11-20
discontinued: 
updated: 2014-11-26
version: 
binaries: 
dimensions: 
weight: 
provider: BTChip
providerWebsite: 
website: 
shop: 
country: FR
price: 
repository: https://github.com/mably/btchipJC
issue: 
icon: ykneo.btchip.png
bugbounty: 
meta: defunct
verdict: diy
date: 2022-05-20
signer: 
reviewArchive: 
twitter: 
social:
- https://github.com/mably

---

## Background 

This information was copied from [BTChip's GitHub repository:](https://github.com/mably/btchipJC)

> ## BTChip Java Card Bitcoin Hardware Wallet
>
> The following project is a proof-of-concept implementation of a Bitcoin Hardware Wallet tested on a real-world Java Card platform (JCOP 2.4.2 R3, found in the Yubikey Neo) with no strings attached (no vendor NDA necessary as only standard Java Card features are used), protected against malware using a second factor validation of the transactions based on the isolation of the contact and contactless communication interfaces.
>
> The provided implementation is not designed for production use - play with it at your own risks, we are not responsible if you lose epic amounts of coins, crash your Java Card, trigger a banking revolution or worse. It is mostly intended to draft new BTChip features and hopefully bring more secure bitcoin solutions to the market.
>
> ## Use cases
> 
> To use this wallet, you need a computer and an NFC enabled phone supporting NFC Forum Type 4 tags (preferably natively or through a third-party application).
>
> When creating a transaction from your computer:
>
- Plug your wallet into the computer
- Enter your application PIN to unlock the wallet
- Send the transaction to the wallet, it will be validated on the contact interface, and a virtual NFC Forum Type 4 tag will be created listing the transaction details, and a random transaction PIN.  The tag content cannot be read from the contact interface.
- Tap the wallet on your NFC phone to check the transaction details and see your transaction PIN
- Finally plug your wallet into the computer again, enter the transaction PIN and finalize the transaction
>
When creating a transaction from your smartphone:

## Analysis 

The {{ page.title }} has not seen further activity since 2014. A level of technical expertise is needed in order to install this on a Yubico YubiKey Neo HSM device. Thus, it can be considered as a **defunct do-it-yourself project**.
