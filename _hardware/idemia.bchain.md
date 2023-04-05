---
title: IDEMIA B.Chain
appId: idemia.bchain
authors:
- danny
released: 2018-06-15
discontinued: 
updated: 
version: 
binaries: 
dimensions: 
weight: 
provider: IDEMIA
providerWebsite: https://www.idemia.com/
website: https://www.idemia.com/card-based-crypto-hardware-wallet
shop: https://www.idemia.com/contact/?product=10013
country: FR
price: 
repository: 
issue: 
icon: idemia.bchain.png
bugbounty: 
meta: ok
verdict: plainkey
date: 2023-02-09
signer: 
reviewArchive: 
twitter: idemiagroup
social:
- https://www.linkedin.com/company/idemiagroup/
features: 

---

## Product Description 

> - Load the keys: B.CHAIN manages a hierarchical deterministic (HD) wallet which needs to be initialized by loading the seed generated within the wallet provider mobile app using the BIP39 standard.
> - Enroll fingerprints: The user will then need to enroll two fingers in their card, or create their card PIN code via the mobile app interface. The biometric data never leaves the card, be it during the enrollment or later when the user signs a transaction.
> - Add new cryptos: At any time, the mobile app can be used to add new cryptos (e.g., BTC, ETH, etc.) to the HD wallet. The user can also add new accounts for each new crypto to enable maximum flexibility. B.CHAIN supports a number of cryptocurrencies including Bitcoin, Ether, ERC-20 tokens, Litecoin, Ripple and Bitcoin Cash.
> - Sign transactions: Transactions are driven by the mobile app. Users enter all data using the app interface, and when a crypto transfer is ready, users simply tap their B.CHAIN card on the back of their phone to generate a signature. They then authenticate the signature using their fingerprint on their card, or by entering the card PIN code in their mobile app.
> - Restore a lost (or stolen) wallet: In case the B.CHAIN card gets lost or stolen, the user stays safe. Without proper authentication, the crypto wallet remains locked and the user can restore all their cryptos and accounts in a new card using their BIP39-compliant passphrase and the B.CHAIN quick restore mechanism.
> - Once protected within the secure element of the B.CHAIN crypto hardware wallet, the private keys always remain under the full control of the user. Every crypto transfer will require the B.CHAIN holder to authenticate with the fingerprint sensor embedded in the biometric card body or with a PIN code.

From their [website.](https://www.idemia.com/card-based-crypto-hardware-wallet)

## Analysis 

Their marketing point of *"No tiny display. No tiny buttons. With B.CHAIN, crypto wallet providers can make a non-custodial wallet accessible to the greatest number of people."* is also one of its weak security points. 

The key to the verdict is in this statement as it may have the possibility of sharing the private key with the mobile app: 

> - Sign transactions: Transactions are driven by the mobile app. Users enter all data using the app interface, and when a crypto transfer is ready, users simply tap their B.CHAIN card on the back of their phone to generate a signature. They then authenticate the signature using their fingerprint on their card, or by entering the card PIN code in their mobile app.