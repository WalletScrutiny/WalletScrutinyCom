---
title: MDAO KeyWallet
appId: ttmcard
authors:
- danny
released: 
discontinued: 2026-10-30
updated: 
version: 
binaries: 
dimensions: 
weight: 
provider: MARS DAO
providerWebsite: https://daomars.com/
website: https://web.archive.org/web/20260118050545/https://ttmwallet.io/
shop: https://web.archive.org/web/20251205021823/https://ttmwallet.io/order.html
country: 
price: 70USD
repository: 
icon: ttmcard.webp
bugbounty: 
meta: discontinued
verdict: noita
date: 2026-10-30
signer: 
twitter: 0xMarsDAO
social:
- https://www.youtube.com/@MarsDAO
- https://reddit.com/user/MarsDao_blog/
- https://medium.com/mars-dao
- https://github.com/orgs/MARS-DAO/repositories
builds: 
features:
- nfc
- secEl

---

**Update 2026-10-30:** The KeyWallet site and its order page no longer load; the last [archived copy](https://web.archive.org/web/20260118050545/https://ttmwallet.io/) from January 2026 still offered the card for 70 USDT. MARS DAO's [website](https://daomars.com/) no longer mentions the card, so we list it as discontinued. The companion app is still in the store, so existing cards should keep working.

## Product Description 

A card that stores your private key and connects to your phone via NFC. It also claims to use an "Embedded EAL6+ SecureCore microchip by Samsung."

The companion app has been reviewed and can be found here: {% include walletLink.html wallet='android/com.ttmbank.wallet.app' verdict='true' %}

> The embedded chip creates and holds your unique and uncopyable key within the card, making it the most secure way to store your crypto.


## Analysis 

The device itself is an NFC card that relies on the companion app to make transactions. It contains the keys to sign transactions but has no interface to verify what is being signed.

{% include featureEvidence.html feature="nfc" quote="A card that stores your private key and connects to your phone via NFC." source="Existing WalletScrutiny review" %}

{% include featureEvidence.html feature="secEl" quote="Embedded EAL6+ SecureCore microchip by Samsung." source="Existing WalletScrutiny review" %}
