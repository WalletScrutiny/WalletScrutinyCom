---
title: "SecuX STONE V20"
appId: secuxstonev20
authors:
- kiwilamb
- danny
- leo
released: 
discontinued: 
updated: 
version: 
binaries: 
dimensions: [98, 98, 15]
weight: 120
provider: "SecuX Technology Inc."
providerWebsite: https://secuxtech.com
website: https://shop.secuxtech.com/products/v20-hardware-wallet-for-computer-mobile-user/
shop: https://shop.secuxtech.com/products/v20-hardware-wallet-for-computer-mobile-user/
country: TW
price: 139USD
repository: https://github.com/secuxtech/SecuXMCU
issue: https://gitlab.com/walletscrutiny/walletScrutinyCom/-/issues/379
icon: secuxstonev20.png
bugbounty: 
meta: ok
verdict: nosource
date: 2021-12-03
signer: 
reviewArchive: 
twitter: SecuXwallet
social: 
  - https://www.linkedin.com/company/secuxtech
  - https://www.facebook.com/secuxtech
---

## Private keys can be created offline and are not sharedser

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


## Source Code and Reproducibility

The
[Quick Start Guide](https://secuxtech.com/secuxtech-download/Payment-EvKit/EvKit-Quick-Start-Guide.pdf)
links to a GitHub account ["secuxtech."](https://github.com/secuxtech) and there
is a
[repository labeled "SecuX device firmware."](https://github.com/secuxtech/SecuXMCU)
so there is some public source code but ...

This device features a "secure element" which runs its own, proprietary firmware
that we could not find the source code for. In the
[Device Functions - About](https://secuxtech.com/howitworks/device-functions#about)
we can read:

> Firmware Version – current firmware versions of the Secure Element (SE) and
  the device MCU (micro controller unit) information which you may need for
  firmware upgrades and technical support.

Their GitHub only features a repository for the MCU part. If the SE firmware can
put the stored funds at risk, we would have to consider the device as a whole as
"closed source" but what is it that the SE is used for? Unfortunately we could
not find any information on this aspect anywhere on their website and have to
assume that by delegating the private key generation to the SE running
compromised firmware, the product could generate backups/keys known to the
provider.

Without further information this product is **not verifiable**.