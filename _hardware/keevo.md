---
title: "Keevo Model 1"
appId: keevo
authors:
- danny
- kiwilamb
released: 2020-09-31 # Q3 2020 according to provider
discontinued: # date
updated:
version:
dimensions: 
weight: 
website: https://www.keevowallet.com/products/keevo-model-1
shop: https://www.keevowallet.com/products/keevo-model-1
company: BitKey Technogies
companywebsite: https://www.keevowallet.com
country: US
price: 299USD
repository: 
issue:
icon: keevo.png
bugbounty:
meta: ok
verdict: nosource
date: 2021-12-10
signer:
reviewArchive:


providerTwitter: keevowallet
providerLinkedIn: 
providerFacebook: keevowallet
providerReddit: 
---


One of Keevo's main advertised features is:

> Secure recovery without seed phrase

Instead, you are offered with the [Carbon Key - a separate device that can be plugged on the hardware wallet](https://www.keevowallet.com/pages/faqs)

> It is a piece of hardware separate from your Keevo device that is a secondary encrypted memory device. No keys are stored on the Carbon Key, just encrypted hashes of 3 key shares which require the users password and fingerprint to decrypt.

However, you can still generate a seed phrase.

> Though we aren’t a fan of seed phrases, we actually do have a seed phrase on the device, and we let you access it by authenticating your identity on your Keevo with your password and fingerprint. It's protected on your secure MCU and still requires 3 out of 4 factors to access it.
>
> You can then enter this seed phrase into any other wallet and restore your private master keys like you would with any other seed phrase.

## Interface

The device has a 2.8” color touchscreen and can be connected to a computer or laptop via USB-C. It also features a biometric sensor. 


## Private keys can be created offline - ❌

([Video detailing the process of initializing a wallet](https://www.youtube.com/watch?v=_FHw-MduTJc))

It's mandatory to connect with an external device before you can initialize a wallet. 

Then you are allowed to encrypt your Carbon Key.

However, the [FAQs](https://www.keevowallet.com/pages/faqs) claim you can generate a seed phrase. 

> Does Keevo offer the option to generate a seed phrase?
>
> Though we aren’t a fan of seed phrases, we actually do have a seed phrase on the device, and we let you access it by authenticating your identity on your Keevo with your password and fingerprint. It's protected on your secure MCU and still requires 3 out of 4 factors to access it.
>
> You can then enter this seed phrase into any other wallet and restore your private master keys like you would with any other seed phrase.

## Private keys are not shared - ✔️

From the [Keevo Whitepaper](https://cdn.shopify.com/s/files/1/0081/4448/6451/files/keevo_whitepaper.pdf?6971):

> If the Keevo Service tried to recreate the user’s Master Key 0 by somehow using the Keevo Carbon Key that we have in our vault storage, we couldn’t because we wouldn’t have 2 of the user’s other Factors (the Keevo HW Wallet Device, the user’s PIN or the user’s biometric keys) to decrypt the signatures for those factors

## Device displays receive address for confirmation - ✔️

([Video demonstrating a BTC transaction on Keevo](https://youtu.be/1Ch2IQ4D_K0?t=34))

As shown in this video, the Keevo device will display the receive address for confirmation.

It then asks the user to verify his fingerprint by placing a finger on the reader.

## Reproducibility 

In a tweet from [September 3, 2019](https://twitter.com/keevowallet/status/1168687398978375680), a user asked if the firmware would be publicly available. Keevo replied it would be "open source after release." To date, there is no link to any repository on the website and seemingly no mention of publicly available source code. We [asked Keevo on Twitter](https://twitter.com/BitcoinWalletz/status/1465874380802510850) concerning this which simply resulted in them offering the same promise to open source sometime in the future. 

At the moment, this product is **not verifiable.**