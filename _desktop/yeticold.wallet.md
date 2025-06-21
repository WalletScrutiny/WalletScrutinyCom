---
title: Yeti Cold Wallet
appId: yeticold.wallet
authors:
- danny
released: 2019-10-04
discontinued: 
updated: 2025-03-20
version: 
binaries: 
provider: JWWeatherman
providerWebsite: 
website: https://yeticold.com
repository: https://github.com/JWWeatherman/yeticold
issue: 
icon: yeticold.wallet.png
bugbounty: 
meta: ok
verdict: sourceavailable
date: 2025-06-03
twitter: YetiWallet
social: 
features: 

---

## Description

It is self-described as a "self-custodial, source-available Bitcoin cold storage solution". So it's more of a methodology with its own scripts.

Yeti is a Bitcoin-only cold storage solution that prioritizes security through a 3-of-7 multisig approach. The software creates private keys in an offline fashion, ensuring they never exist on internet-connected devices except through controlled USB transfers. 

While users need to clone the repository and run the scripts themselves, the **source code is fully available** on GitHub and can be audited. This transparency allows users to verify the code's security before trusting it with their Bitcoin. The project emphasizes minimal dependencies beyond Bitcoin Core and focuses on counterfeit prevention through full node verification. However, it has no binaries to verify.
