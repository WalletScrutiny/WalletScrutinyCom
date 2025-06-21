---
wsId: coinlord
title: COINLORD
altTitle: 
authors:
- danny
users: 10000
appId: com.cryptore.android
appCountry: 
released: 2021-12-16
updated: 2024-11-05
version: 1.2.2
stars: 4.8
ratings: 
reviews: 5
website: https://coinlord.org/
repository: 
issue: 
icon: com.cryptore.android.jpg
bugbounty: 
meta: removed
verdict: custodial
appHashes: 
date: 2025-02-28
signer: 
twitter: coinlord_trade
social:
- https://www.facebook.com/coinlordtradee
- https://www.linkedin.com/company/coinlord.trading
- https://t.me/coinlord_official
- https://www.instagram.com/coinlordtrade
- https://www.facebook.com/coinlordtradee
redirect_from: 
developerName: Sanatan Technologies
features: 

---

## App Description from Google Play

> COINLORD is a Cryptocurrency marketplace in India. You can Buy and Sell Bitcoin, Ethereum, Ripple, and many more in India using COINLORD Cryptocurrency Exchange App. You can easily deposit INR using IMPS/UPI/ NEFT/RTGS/ Credit or Debit Cards.

## Analysis

- [(Link to CoinLord's Terms and Conditions)](https://coinlord.org/terms-conditions)
- We were able to register by using a temporary Indian phone number.
- Once inside, we found a BTC wallet, but its public key starts with 0x:
  > 0x3c8774667713f6073949699684f0b87bb417a319
  
  Which is not a Bitcoin address. The app apparently is selling "wrapped" Bitcoins on some other chain as actual BTC.
- We took a look at other funding options:
  - Instant UPI
  - UPI
  - Bank Transfer
- We could not find any option to backup the private keys. Initially, we thought this app was straightford as a custodial exchange. However, the BTC address format is mysterious as it is not in the usual P2SH, Legacy or Bech32 formats.
- We [tweeted](https://twitter.com/BitcoinWalletz/status/1678349179188396032) them about it.
- Apart from this, key indicators in the terms and conditions do point to a custodial service:
  - Section 11. Ability to terminate user account and access
  - Section 12. Right to modify site's contents at any time.
  - Limitation of users to [Indian nationals](https://coinlord.org/faq)  
  - KYC requirement prior to withdrawal.

## Conclusion

- It was difficult to give this app a verdict because it is not so clear why the BTC address is not in the correct format. However, there is a BTC withdrawal option apart from bank withdrawals.
- The crucial element of this verdict is the lack of an option to backup the private keys, which corroborates a **custodial** verdict.
