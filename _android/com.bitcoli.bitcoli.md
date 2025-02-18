---
wsId: bitcoli
title: BitcoLi Lightning wallet
altTitle: 
authors:
- danny
users: 10000
appId: com.bitcoli.bitcoli
appCountry: 
released: 2023-01-13
updated: 2024-10-09
version: 1.2.1
stars: 4.6
ratings: 
reviews: 6
website: https://BitcoLi.com
repository: 
issue: 
icon: com.bitcoli.bitcoli.jpg
bugbounty: 
meta: ok
verdict: custodial
appHashes: 
date: 2024-02-28
signer: 
reviewArchive: 
twitter: 
social: 
redirect_from: 
developerName: BitcoLi
features: 

---

## App Description from Google Play 

> The main advantages of this wallet include:
> - custom Lightning address including user profile
> - You can receive and send payment through both Onchain and Lightning Network.
> - the issued invoice can be paid directly with a bitcoin NFC card!
> - ability to send and receive Lightning payments with milliSatoshi accuracy (0.001Sat)
> - very low fees
> - simplicity and clarity

## Analysis

- Users are given several login options:
  - No login (for testing)
  - Email
  - Username and password
- If the user chooses to have an account, it would look something like
`dannybuntu@bitcoli.com`
- Users are primarily given a lightning address, but an onchain address is also available.
- We did not find the private keys for the onchain wallet. Absent the private keys, this app is **custodial**.
