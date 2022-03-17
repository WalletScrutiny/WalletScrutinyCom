---
title: "Prokey Optimum"
appId: prokeyoptimum
authors:
- kiwilamb
- danny
- leo
released: 2020-01-01
discontinued: 
updated: 
version: 
binaries: 
dimensions: [41, 50, 9.4]
weight: 16.7
provider: "Prokey"
providerWebsite: https://prokey.io/
website: https://prokey.io/prokey-optimum
shop: https://prokey.io/prokey-optimum
country: MY
price: 59USD
repository: https://github.com/prokey-io/prokey-optimum-firmware
issue: https://github.com/prokey-io/prokey-optimum-firmware/issues/28
icon: prokeyoptimum.png
bugbounty: 
meta: ok
verdict: nonverifiable
date: 2022-03-15
signer: 
reviewArchive: 
twitter: tryProkey
social: 
- https://www.linkedin.com/company/prokey-technologies
- https://www.facebook.com/prokey.io
- https://www.instagram.com/prokey.io
- https://www.youtube.com/channel/UCz24yLqt0DCXYYD2qLmTEkQ
---

The product page's description reads as below:

> The Prokey Optimum is a secure, easy-to-use cryptocurrency hardware wallet that protects your crypto assets from online and offline attacks, while also supporting a wide range of cryptocurrencies without installing any application, letting you enjoy an all-in-one web-based wallet.

## Interface

This hardware wallet features a screen display and 4 buttons to navigate the interface. You can connect this device using a USB cable.


## Private keys can be created offline - ❓

To set up the Prokey Device, it must first be connected to a laptop/computer. The user must go to the web interface and install the firmware to start running the wallet. Once this is installed, you can create a wallet.

From the guide, ["Restore your wallet from backup"](https://prokey.io/restore-wallet)

>  Your private key is your own and due to security reasons, the whole process of restoring private keys should only be done on the device and offline.

## Private keys are not shared - ✔️

[An official blog post](https://prokey.io/blog/official-launching-of-the-prokey-optimum) concerning this product's release has some information on how private keys are kept secure. 

> The only possible way for someone to "hack" into the physical device that you have is to physically take it from you but often, you will not lose access to your funds and keys. This is because whoever took your device will still need access to your recovery seed and passphrase; both you would have stored offline and not on a server or on a hard drive.
>
> The Prokey Optimum does exactly this. It stores the keys that grant you access to your funds physically in a protected area of a microcontroller. This eliminates the ability to transfer the keys out of the device in plaintext. The keys will never be exposed to anything that can compromise software, inclusive of hacking, malwares, and malfunctions.

## Device displays receive address for confirmation - ✔️

The Help Center's guide on sending and receiving states that the user can confirm the receive address via the Prokey device's display.

> Confirm the Transaction on Your Prokey
>
> Right after pressing Send, a confirmation popup will appear. Check again the amounts and the recipient address of the transaction. If all is in order, choose confirm. If something is off with the amount or the address shown, there is a possibility that your computer is infected. Rest assured, your coins are still safe in your Prokey, though we strongly advice you to contact support.
>
> The total amount of the transaction, including the fee will be displayed on your Prokey after you confirm the address and amount of coin to be sent. Check them again one last time before holding down the OK key to sign and send the transaction.


## Code and Reproducibility

In the official GitHub account, we find a repository named "[prokey-optimum-firmware.](https://github.com/prokey-io/prokey-optimum-firmware)" The repository has had a recent release on October 4.

Sadly the device has a fundamental flaw when it comes to verifiability: It does
not show which binary the user is about to update, at least judging by
[this video](https://www.youtube.com/watch?v=pHWKXho0nLM). Without that, the
firmware is **not verifiable**.