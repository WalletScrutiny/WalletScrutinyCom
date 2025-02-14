---
title: Coinfinity CardWallet
appId: coinfinitycardwallet
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
- 86
- 1
weight: 
provider: Coinfinity
providerWebsite: https://coinfinity.co
website: https://www.cardwallet.com/en/home/
shop: https://www.cardwallet.com/en/product/card-wallet-bitcoin/
country: AT
price: 39.9EUR
repository: 
issue: 
icon: coinfinitycardwallet.png
bugbounty: 
meta: ok
verdict: prefilled
date: '2024-08-07'
signer: 
reviewArchive:
- date: '2023-03-07'
  version: 
  appHash: 
  gitRevision: 50a8d4aa7af67f4c5e6cd0e619f9a41e053c0cf0
  verdict: sealed-plainkey
- date: '2022-03-23'
  version: 
  appHash: 
  gitRevision: 8762a3742
  verdict: prefilled
twitter: CardwalletCom
social:
- https://www.linkedin.com/company/coinfinity
- https://www.facebook.com/cardwalletcoinfinity
features: 

---

**Updated Review 2024-08-07**

Verdict changed to **prefilled** to account for manufacturer imprinting the private key on the card prior to user-acquisition.

**Prior Review 2023-03-07**

[From the details listed on the Shop page:](https://www.cardwallet.com/en/product/card-wallet-bitcoin/)

> The Card Wallet is the ideal solution for storing Bitcoin in the long term, offline and secure. It is not pre-loaded with Bitcoin. The images shown here are symbolic, the actual product may differ slightly in design.

Technical specifications:

> The card wallet has the format of a standard debit card of 85mm x 54mm. The card is made of polycarbonate, a laser imprints private key and bitcoin address onto it. The private key is already sealed in a tamper-proof way during the production process.

Private keys are prefilled. This is also mentioned in the [FAQs:](https://www.cardwallet.com/en/faq/)

**Is the private key saved?**
> The private key printed on the back of the card exists exclusively on the respective Card Wallet, there is no copy of the private key. The generated key never leaves the production machine, and can not be viewed by employees at any time. All data carriers of the machine are deleted at the end of a production process, using secure procedures.

Additionally, there is the problem of the card getting stolen or lost.

From Card Wallet's [How To](https://www.cardwallet.com/en/how-to/)

> The important thing is that no-one other than you has access to the Card Wallet, because whoever possesses the private key under the security seal can retrieve all the Bitcoin on the address. Please note that in case of loss or theft of the Card Wallet all Bitcoin on it will be irretrievably lost. Safe storage is therefore absolutely necessary.

Here is information on the Card Wallet's seal (from the same page as above):

> The security seal on the back of the card is equipped with holographic security features. By varying the angle of view, the locks open and close, while at the same time the words "CHAINLOCK PRIVATE KEY" appears over the entire seal (in older versions "ORIGINAL" respectively). If the text "SEAL BROKEN" is visible, please contact our support immediately.

Verdict: Keys may be leaked if the seal is removed.