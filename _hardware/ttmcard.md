---
title: MDAO KeyWallet
appId: ttmcard
authors:
- danny
released: 
discontinued: 
updated: 
version: 
binaries: 
dimensions: 
weight: 
provider: MARS DAO
providerWebsite: https://daomars.com/
website: https://ttmwallet.io/
shop: https://ttmwallet.io/order.html
country: 
price: 70USD
repository: 
issue: 
icon: ttmcard.png
bugbounty: 
meta: ok
verdict: noita
appHashes: 
date: 2024-01-08
signer: 
twitter: 0xMarsDAO
social:
- https://www.youtube.com/@MarsDAO
- https://reddit.com/user/MarsDao_blog/
- https://medium.com/mars-dao
- https://github.com/orgs/MARS-DAO/repositories
features: 

---

## Product Description 

A card that stores your private key and connects to your phone via NFC. It also claims to use an "Embedded EAL6+ SecureCore microchip by Samsung."

The companion app has been reviewed and can be found here: {% include walletLink.html wallet='android/com.ttmbank.wallet.app' verdict='true' %}

> The embedded chip creates and holds your unique and uncopyable key within the card, making it the most secure way to store your crypto.


## Analysis 

The device itself is an NFC card that relies on the companion app to make transactions. It contains the keys to sign transactions but has no interface to verify what is being signed.
