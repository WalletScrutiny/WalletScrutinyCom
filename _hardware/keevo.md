---
title: Keevo Model 1
appId: keevo
authors:
- danny
- kiwilamb
released: 2020-10-01
discontinued: 
updated: 
version: 
binaries: 
dimensions: 
- 95
- 58
- 11
weight: 120
provider: BitKey Technogies
providerWebsite: https://www.keevowallet.com
website: https://www.keevowallet.com/products/keevo-model-1
shop: https://www.keevowallet.com/products/keevo-model-1
country: US
price: 299USD
repository: 
issue: 
icon: keevo.png
bugbounty: 
meta: ok
verdict: nosource
date: 2023-04-04
signer: 
reviewArchive: 
twitter: keevowallet
social:
- https://www.facebook.com/keevowallet
features: 

---

## Updated Review 2023-04-04

Merging the review for the accessory of this device, the Carbon Key. 

Described by the manufacturer: 

> It is a piece of hardware separate from your Keevo device that is a secondary encrypted memory device. No keys are stored on the Carbon Key, just encrypted hashes of 3 key shares which require the users password and fingerprint to decrypt.

As a precautionary measure for the user, the Carbon Key can be sent to a custodial service, Iron Mountain. There, it will be kept in secure storage for a fee of $6 a month. 

> The Carbon Key is a separate backup device which has its own unique and randomly generated key along with a secure memory unit where Keevo also stores all of your other encrypted sub keys. All the electronic communication and information transferred between the Keevo Wallet and Keevo Carbon Key are transmitted through custom contacts and encrypted communication protocols.

More information [from the Keevo blog post](https://www.keevowallet.com/blogs/news/why-we-built-keevo-part-2-the-tech-behind-the-device):

### Recovery in case the Keevo Hardware Wallet is Lost

> If your device breaks or is lost, you can use your Carbon Key to restore your coins on another Keevo device. We offer a Keevo Care service for this exact purpose where you can purchase another Keevo at a discounted price.
>
> Your Carbon Key is a separate piece of hardware that backs up your encrypted password and fingerprint, along with a 4th unique key share! It can then be securely stored at one of Iron Mountain's vaults or you can choose your own location. 
>
> If you would like, you always have the option to use your seed phrase to restore as well.

But at the interim: 

- The Carbon Key on its own cannot sign transactions
- It still needs the other multi-factor components 

### The verdict remains the same.

## Previous Review 2021-12-10

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