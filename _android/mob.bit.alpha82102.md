---
wsId: 
title: Bit Alpha
altTitle: 
authors:
- danny
users: 5000
appId: mob.bit.alpha82102
appCountry: 
released: 2022-08-19
updated: 2022-08-19
version: '1.0'
stars: 
ratings: 
reviews: 
website: 
repository: 
issue: 
icon: mob.bit.alpha82102.png
bugbounty: 
meta: removed
verdict: nosendreceive
appHashes: 
date: 2024-02-05
signer: 
twitter: 
social: 
redirect_from: 
developerName: NADIM BHUTTA
features: 

---

## App Description from Google Play

> We designed the BitAlpha AI app to enable anyone to access the cryptocurrency markets and, trade various coins, including Bitcoin, Dogecoin, LUNA, and Ethereum.

## Analysis

- The app does not directly link to a website, but its privacy policy is hosted on bit-alpha.com, On the header is this text in bright red:
  > *Warning, due to extremely high media demand, we will close registration as of (timer in minutes)*
- Upon installation, the app opened a browser to a page. The design of the page is familiar to another app we recently inspected. We advise the user to proceed with caution.
- We filled up the form with contrived personal details and the app immediately asked us to deposit through several means. The word 'Praxis' was on the header. The available payment methods were:
  > - Visa
  > - Crypto by Finrax
  > - Binance Pay
  > - Neteller
  > - Skrill
  > - Perfect Money
- When selecting 'Deposit by Crypto' (Finrax), the currency is still denominated in USD, EUR, and USDT. We then clicked on Deposit.
- From there, a Finrax dialog asking if we would like to proceed after selecting BTC. 
- Finrax is similar to BitPay, in that they provide an address corresponding to the coin you select. It is a different payment processor. 

Since this app allows trading cryptocurrencies via CFD, the user does not really "deposit" cryptocurrencies but rather pays the cryptocurrency to another third-party provider, which then converts the amount to the desired fiat currency. The user can then purchase Contracts for Differences representing the cryptocurrencies, and once profit (or loss) is made, can then withdraw. The service is definitely custodial, and **does not allow the sending or receiving** of cryptocurrencies as a bitcoin wallet would.
