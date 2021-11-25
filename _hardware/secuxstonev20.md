---
title: "SecuX STONE V20"
appId: secuxstonev20
authors:
- kiwilamb
- danny
released: 
discontinued: # date
updated:
version:
dimensions: [98, 98, 15]
weight: 
website: https://shop.secuxtech.com/products/v20-hardware-wallet-for-computer-mobile-user/
shop: https://shop.secuxtech.com/products/v20-hardware-wallet-for-computer-mobile-user/
company: SecuX Technology Inc.
companywebsite: https://secuxtech.com
country: TW
price: 139USD
repository: https://github.com/secuxtech/SecuXMCU
issue:
icon: secuxstonev20.png
bugbounty:
verdict: wip
date: 2021-07-07
signer:
reviewArchive:


providerTwitter: SecuXwallet
providerLinkedIn: secuxtech
providerFacebook: secuxtech
providerReddit: 
---


## Private keys can be created offline and are not shared

The [product page](https://shop.secuxtech.com/products/v20-hardware-wallet-for-computer-mobile-user/) states that SecuX can generate recovery words from 12 to 24 word sets:

> SecuX wallets generate your unique 24 recovery words and support BIP-32, -39, and -44 standard 12, 18 and 24 recovery word sets. It also provides a 25-word passphrase for additional security.

It also claims to keep the key offline.

> SecuX wallets keep your data offline and keep you off the radar. Your private key remains within the Secure Element chip and never leaves the device.

[From the FAQ:](https://secuxtech.com/faq/)

> SecuX wallets are hardware wallets equipped with an Infineon SLE solid Flash CC EAL5+ Secure Element chip, which is used to securely store your unique PIN and Private Key. It enables zero transaction leakage and your transactions are verified without the private key ever leaving the device.

## Device displays receive address for confirmation

[On transactions:](https://secuxtech.com/faq/)

> It is completely safe to make transactions via Bluetooth connection due to the security chip that we have in all of our hardware wallets. During connection, your private key for transaction signatures remains protected inside the security chip which is never accessed during this process and will not be susceptible to any attacks from outside the wallet. All SecuX wallets will also require a One Time Password (OTP) when connecting via Bluetooth to ensure security. Bluetooth 5 also has AES encryption that further encrypts sensitive data while transmitting. 

> The large display that SecuX wallet offers also comes into play where you are able to verify all the details easily during a transaction.


## Reproducibility

The [Quick Start Guide](https://secuxtech.com/secuxtech-download/Payment-EvKit/EvKit-Quick-Start-Guide.pdf) links to a github account ["secuxtech."](https://github.com/secuxtech). One repository is labelled "SecuX device firmware."

This product is for verification.
