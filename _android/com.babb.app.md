---
wsId: babbApp
title: BABB
altTitle: 
authors:
- danny
users: 50000
appId: com.babb.app
appCountry: 
released: 2020-02-27
updated: 2024-12-12
version: 2.5.8
stars: 3.7
ratings: 
reviews: 48
website: https://getbabb.com/
repository: 
issue: 
icon: com.babb.app.png
bugbounty: 
meta: ok
verdict: custodial
appHashes: 
date: 2023-07-10
signer: 
twitter: getbabb
social:
- https://www.linkedin.com/company/babb
- https://www.facebook.com/getbabb
- https://www.youtube.com/channel/UCQtkZd7sfzbEugz7VdFhv4Q
- https://discord.com/invite/39rQp2g6JA
- https://babb.medium.com
- https://t.me/getbabb_official
redirect_from: 
developerName: BABB
features: 

---

## App Description from Google Play

> Babb offers the ability to transfer same-currency funds instantly in and across countries at zero cost, made possible through the use of blockchain and cryptocurrencies.
>
> - Manage your money, crypto & stable coins, all in one place.
> - Store, Convert, Send BAX, BTC and ETH
> - Instant P2P in-app Transfers

## Analysis

- After registration and verification we found a BTC wallet, but in order to access deposit or withdraw features, we would have to pass KYC.
- The same is true with other user options on the app.
- There is no provision of mnemonic keys when we first initialized the app.
- There is also no option to backup the private keys in the security settings.
- Most of the app's features are not-functional without KYC-verification.
- In the [Terms](https://getbabb.com/terms-and-conditions/), Section 3.1 mentions that 'BABB' will manage a cryptographic private and public key pair **on behalf of the user**.
- This is made slightly more confusing by other succeeding sections and sub-sections where it says the responsibility of storing the keys is placed on the user and that the private keys are reportedly on the device.
- However, we place doubt on these claims as that option they are referring to simply cannot be found.
- Add to that the fact that most features are not available without passing through KYC-verification.
- Finally, that the app is [not source-available](https://github.com/search?q=com.babb.app&type=code)
- For these reasons, we classify this app as **custodial.**
