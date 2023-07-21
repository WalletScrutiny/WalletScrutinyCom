---
wsId: niceX
title: NiceX
altTitle: 
authors:
- danny
users: 10000
appId: com.metallum.nicex
appCountry: 
released: 
updated: 2023-05-31
version: 2.1.5
stars: 
ratings: 
reviews: 
size: 
website: http://www.nicex.com
repository: 
issue: 
icon: com.metallum.nicex.png
bugbounty: 
meta: ok
verdict: custodial
date: 2023-07-21
signer: 
reviewArchive: 
twitter: NiceXExchange
social:
- https://www.facebook.com/NiceXExchange
- https://www.youtube.com/c/NiceHash_Official
- https://discord.com/invite/nicehash
redirect_from: 
developerName: H-BIT d.o.o.
features: 

---

## App Description from Google Play

> Trade your favorite cryptocurrencies pairs, securely store your funds in your wallet, monitor your assets and market trends, buy & sell Bitcoin with credit card & bank transfer no matter where you are.
>
> Key features:
> - Secure cryptocurrency wallet
> - Easy buy and sell Bitcoin with credit/debit card & bank transfer
> - Over 60 currencies available
> - More than 90 trading pairs
> - Monitor your favorite currencies with one glance
> - Built in customer support in 9 languages
> - Support for OTP devices (Yubiko)
> - Easily convert & withdraw your funds

## Analysis 

- We were able to sign up on the web platform because the mobile app informed us that support was not available for our country.
- We found a Bech32 BTC and a lightning wallet that can send and receive. Additional features are only accessible after KYC.

### [Terms and Conditions](https://www.nicex.com/legal-privacy/terms-of-service) 

- Termination can be at the sole discretion of the provider.
- We see that the wallet is called NiceWallet provided by {% include walletLink.html wallet='android/com.bitgo.mobile' verdict='true' %} and Fireblocks, Inc. which holds, stores, and transfers funds, and hosts NiceWallet. 
- BitGo is a custodial provider, and by extension, makes this a **custodial** app. Further proof of this is the lack of an option to back up the private keys.