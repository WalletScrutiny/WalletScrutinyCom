---
wsId: kyccWallet
title: KYCC Wallet
altTitle: 
authors:
- danny
users: 10000
appId: com.mobile.kyc
appCountry: 
released: 2022-01-21
updated: 2022-10-28
version: 1.1.0
stars: 4.3
ratings: 
reviews: 1
website: https://kyccoin.io
repository: 
issue: 
icon: com.mobile.kyc.png
bugbounty: 
meta: obsolete
verdict: nosource
appHashes: 
date: 2024-10-19
signer: 
reviewArchive: 
twitter: kyc_coin
social:
- https://www.linkedin.com/company/kyccoin
- https://www.facebook.com/kyccoin
- https://www.instagram.com/kyc_coin
redirect_from: 
developerName: KYC&AML Ltd
features: 

---

## App Description from Google Play

> KYC Coin Wallet is a simple but convenient and feature-rich mobile crypto currency wallet without commissions. Each user can send funds to their contacts, add notes, buy and sell popular cryptocurrencies. With KYC Wallet, you can send cryptocurrencies to anyone from anywhere and in any direction.
>
> A high degree of protection allows KYC wallet users not to worry about the safety of funds and always have access to them.
>
> The initial list of currencies includes popular coins - BTC, ETH, BNB, TRX, Shiba, USDT, Doge, KYC Token, XRP, and a few others.

## Analysis 

- Registration is hindered by SMS-verification requirement. We tried several disposable numbers, and it always issued the same error:
  > [HTTP 400] Unable to create record: Permission to send an SMS has not been enabled for the region indicated by the 'To' number: 

- Its whitepaper states:
  > All KYCC network data is stored in a decentralized file network based on the model of an interplanetary file system. This ensures that platforms do not need to request access to AML and KYC data, as private keys are transmitted automatically. The security of the system is ensured by multiple nodes that are independent of the central server so that even a large number of nodes are compromised or shut down without affecting safety and functionality. Along with decentralization, a high degree of security is provided because files are encrypted using elliptic curve cryptography.

- This is a **master node staking app** and the project launched an IEO sometime in 2022. The [price](https://www.binance.com/en/price/kyccoin) of their coin has since gone down significantly. 
- The desktop app allows users to back up wallet.dat. 
- There are no claims regarding source-availability. 
- A search for the app ID on GitHub Code, shows ['0 results'](https://github.com/search?q=com.mobile.kyc&type=code) and 2 unrelated repositories.
- With the assumptions noted above, this app is **not source-available.**