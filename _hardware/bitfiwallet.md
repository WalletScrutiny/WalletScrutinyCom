---
title: Bitfi.2 Wallet
appId: bitfiwallet
authors:
- kiwilamb
- danny
released: 2019-03-01
discontinued: 
updated: 
version: 
binaries: 
dimensions:
- 115
- 67
- 8
weight: 
provider: Bitfi, Inc
providerWebsite: https://bitfi.com
website: https://bitfi.com/
shop: https://bitfi.com/order
country: 
price: 199USD
repository: https://github.com/Bitfi/BitfiWallet
issue: 
icon: bitfiwallet.png
bugbounty: 
meta: ok
verdict: wip
date: 2021-12-10
signer: 
reviewArchive: 
twitter: thebitfi
social:
- https://www.linkedin.com/company/bitfi
- https://www.facebook.com/TheBitfi

---

<div class="alertBox"><div>
In 2018, there have been incidents where hackers have found several exploits allowing them to obtain funds from the wallets.

Link to third-party <a href="https://techcrunch.com/2018/08/14/unhackable-bitfi-crypto-wallet-has-been-hacked/">TechCrunch</a> and <a href="https://securesense.ca/unhackable-wallet-hacked/">SecureSense</a> articles.
</div> </div>

Bitfi claims to offer an alternative to private keys. From the homepage:

> World's only wallet that doesn't have private keys making it impossible to seize, lose or steal. Bitfi is pure consciousness.

Users are meant to set a "security phrase" for the wallets instead.

> VERY IMPORTANT: your salt & phrase is the wallet and it is your responsibility to know this. If you forget or lose your salt and/or phrase, there is no way to recover it and there is nothing we can do to assist - Bitfi does not have access to any wallet. The Bitfi device that you use is a private key generator that is used to calculate your private keys from user input (salt & phrase).

## Interface

This device has a 3.95" Touch Screen and resembles a small smartphone.

## Private keys can be created offline

Here is [Bitfi's claim](https://bitfi.com/bitfi-wallet#:~:text=Bitfi%20Wallet&text=The%20device%20does%20not%20store,the%20machine%20can%20be%20hacked.) about private keys on its wallet:

> The device does not store and has no way to store private keys, therefore an online attack is not possible.

## Private keys are not shared 

The [user information article](https://www.bitfi.com/profile/usernote) has more information on the private keys and security.

> Your device does not transmit either your salt, phrase, or private key either to Bitfi or any other third party.
>
> First, please note that Bitfi is completely isolated from the computer environment or from any other device and has only one means of communication via WiFi. It is important to understand that the device has no need to transmit your private key because the blockchain never needs your private key, it just needs the signed approval with that key. As a result, WiFi is an extremely secure method to submit approvals to blockchain. Although WiFi networks are inherently unsafe this has no bearing on your security when using Bitfi.

In another section:

> Your coins are only accessible with private keys which don’t exist on any part of the Bitfi infrastructure. Only you have access to your private keys.


## Device displays receive address for confirmation

On a [Youtube video](https://youtu.be/mw_OfbSPtbs?t=929) demonstrating this product, the device displays the receive addresses for confirmation.

## Reproducibility

The linked Github account has [one relevant repository](https://github.com/Bitfi/BitfiWallet) with a url to [bitfi.com/firmware](https://bitfi.com/firmware).

This app is for verification.