---
title: Spatium Keyless Cryptowallet
appId: spatium.wallet
authors:
- danny
released: 
discontinued: 
updated: 
version: 
binaries: 
dimensions: 
weight: 
provider: Spatium
providerWebsite: 
website: https://spatium.net/
shop: 
country: 
price: 
repository: 
issue: 
icon: spatium.wallet.png
bugbounty: 
meta: ok
verdict: noita
date: 2022-04-29
signer: 
reviewArchive: 
twitter: 
social: 

---

## Background

[Spatium](https://spatium.net/) advertises this product as a keyless wallet, claiming that their *"proprietary Multi-Party computation protocol eliminates the need for private keys, removes the single point of failure, separating control over the funds from the responsibility for security."* The private key is replaced with a set of secrets distributed between the gadgets or devices stored on behalf of chosen institutions or people.

{% include walletLink.html wallet='android/capital.spatium.wallet' verdict='true' %} is the companion app to this wallet on android.

[Here is a video](https://www.youtube.com/watch?v=KxoodUihso0) demonstrating a prototype. **Note that the device in the video is different from the device's picture on their website**. The wallet has a screen display as well as a "button" for confirming transactions.

[Spatium's Medium article](https://medium.com/spatium-blog/promising-devices-in-crypto-world-our-cold-wallet-will-cater-to-all-your-wishes-61a2a926247) features more information about the product:

- They use wireless (NFC and Bluetooth) technology to connect to external devices.
  > Instead of wires, we use NFC and Bluetooth technology to securely interact with your other devices without any of the hassle common to today’s cryptowallets. This ability to crypto not only securely but wirelessly has been a demand of hardware (cold) wallet users for years.
- Rather than having the user set a password, the product utilizes biometric sensors. The user is allowed to register five different fingers to unlock the device.
  > The biometric sensor on our cold wallet allows you to scan five different fingers for the most secure, finger-injury proof method of authorization (this addresses a common fear/question about something happening that would make one finger’s print ineligible — for our wallet, there are 4 more fingers to work with).
  >
  > The biometric authorization is quick too: instead of remembering a lengthy password, just press one of the five saved fingers against the reader on the wallet.

## Analysis

The article mentioned above also claims you [can "check their progress in Spatium's Github repository"](https://github.com/orgs/CaspianTechnologies/repositories). We checked the provided GitHub profile and found that none of the repositories have not seen recent updates, and we could not find any directly relating to Spatium's firmware.

Spatium's code is not available for review. We believe that the most telling verdict is the **lack of a screen** on the {{ page.title }}'s picture. Note that in the video described above, it has a display and buttons.