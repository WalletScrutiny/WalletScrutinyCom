---
title: AT.Wallet
appId: atwallet
authors:
- kiwilamb
- danny
released: 
discontinued: 
updated: 
version: 
binaries: 
dimensions:
- 54
- 85
- 2.2
weight: 
provider: AuthenTrend
providerWebsite: https://authentrend.com/
website: https://authentrend.com/at-wallet/
shop: https://www.amazon.com/dp/B084Q4FRPT
country: TW
price: 120USD
repository: 
issue: 
icon: atwallet.png
bugbounty: 
meta: ok
verdict: plainkey
appHashes: 
date: 2021-12-03
signer: 
reviewArchive: 
twitter: authentrend
social:
- https://www.linkedin.com/company/authentrend
- https://www.facebook.com/authentrend
features: 

---

{{ page.title }} describes itself as

> One of The World’s First Fingerprint Credit Card Sized Cold Wallet.

\([Video showcasing this wallet.](https://www.youtube.com/watch?v=zkd0i0SrWBI)\)


You can set up this wallet with bluetooth or USB.

Its companion app is {% include walletLink.html wallet='android/com.authentrend.atwallet' verdict='true' %}

## Private keys can be created offline and are not shared
 
In the [FAQ](https://authentrend.com/faq/), this wallet states that it stores private keys offline.

> If you keep your virtual assets on an exchange, you are entrusting your private keys to a third party and authorizing them as security. The cold wallet is unloaded so that hackers have a harder time accessing your stored coins for improved security. The private key is always offline and stores inside SE (Secure Element), all paths are encrypted.

Once paired to the mobile app, the user can create a new wallet. The user will be provided with the 12/24-word mnemonic in the app and is asked to write them down offline, in a safe place.

> For better security, you can assign “Passphrase” for those “Mnemonic words” for recovery, so that when you do “recover wallet base on Mnemonic words”, it requires you to type correct “Passphrase” to recover.

## Device displays receive address for confirmation

The user can verify and approve transactions on the device.

The card has a built-in fingerprint sensor to sign transactions:

> Patented Standalone Mode adds convenience for fingerprint verification and fast transaction signing.

Fingerprint verification is necessary [for sending assets](https://authentrend.com/download/AT.Wallet%20quick%20guide.pdf), but not for receiving.

[You can view the QR code on the card's screen to confirm a receiving address.](https://youtu.be/Y7YSQKK7eHo?t=31)

## Interface

{{ page.title }}, like it claims in the earlier description, is about the size of a credit card. It lists some of its security features on its [product page](https://authentrend.com/at-wallet/).

> - Designed with Infineon Secure Element (SLE97, EAL 5+SE), that generates private key inside SE for security transactions.
> - Matching-on-card fingerprint sensor, making fingerprint templates not disclose outside the card and only send out public key.

## Reproducibility

ATWallet has a Github profile, although there is **no mention of its product being open-source.** None of these repositories appear to be relevant in determining the reproducibility of the device's firmware. 

This product is thus **not verifiable.**