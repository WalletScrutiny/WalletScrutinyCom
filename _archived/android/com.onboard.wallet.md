---
title: Onboard Global
appId: com.onboard.wallet
meta: ok
verdict: nobtc

---

## App Description

Onboard is a financial services platform operated by Nestcoin (British Virgin Islands) offering a P2P cryptocurrency marketplace with escrow services, USD accounts, virtual debit cards, and a "seedless self-custody wallet" supporting Bitcoin, Tether (USDT/USDC), and other digital assets. The platform's terms contain contradictory custody language, stating it "offers hosted digital wallet services, holding and releasing Digital Assets" while simultaneously claiming "Onboard does not store or custody any locked Digital Assets", creating ambiguity about actual control over funds. Onboard operates through multiple licensed entities: Gopay Financial Services Inc. (Canada FINTRAC MSB C100000565), Onboard Digital (US FinCEN MSB 31000293152346), and Nestcoin Europe (Poland VASP RDWW-1639).

## Analysis 

In the [terms](https://www.onboard.xyz/terms) we see: 

> offering a marketplace to enable you engage in the transaction of “Digital Assets” such term to be broadly understood to include digital currencies such as Bitcoin, Tether, and others

**Section 8**

> 8. Onboard’s rights related to the implementation of a transaction and related to the operation of the website
> - Onboard is entitled to additional rights in case it suspects that the Transaction ordered by User or any other activity of Users within the Website might be related to committing a crime, money laundering, terrorist financing, violation of the provisions of the Regulations, legal provisions or good morals:
> - the right to terminate the User Account;
> - the right to refuse or stop execution of the Transaction;
> - the right to withdraw the Transaction executed;

So why are there contradictions? We [tested](https://x.com/BitcoinWalletz/status/1991471580757782639) the app to see:

The app has many sub-sections. Of interest are these two: 

1. The trading account
2. The Defi account

We were not able to test the trading account because it would require further diving deeper into the app - and passing their KYC procedures. It was not possible to proceed further without doing so - and thus we conclude that this portion of the app is custodial as described in the terms. 

The Defi portion of the account was readily available, but **does not support Bitcoin**. 

In the sequence of Android app reviews, the question of whether an app supports Bitcoin comes before querying for custody. In this case, we are lead to the conclusion that since the DeFi portion of the app was readily accessible, and because it **does not support Bitcoin**, then the verdict would be reflected as such.