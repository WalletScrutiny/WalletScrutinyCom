---
wsId: agoraDeskAnonymous
title: 'AgoraDesk: buy BTC anonymously'
altTitle: 
authors:
- danny
users: 5000
appId: com.agoradesk.app
appCountry: 
released: 2022-08-18
updated: 2024-05-28
version: 1.1.39
stars: 4.4
ratings: 
reviews: 12
website: https://agoradesk.com
repository: https://github.com/AgoraDesk-LocalMonero/agoradesk-app-foss/releases
issue: 
icon: com.agoradesk.app.png
bugbounty: https://agoradesk.com/security-bounty-whitehat
meta: removed
verdict: custodial
appHashes: 
date: 2025-03-14
signer: 
reviewArchive: 
twitter: AgoraDesk
social:
- https://www.reddit.com/r/AgoraDesk
- https://t.me/AgoraDesk
redirect_from: 
developerName: LocalMonero / AgoraDesk
features: 

---

## App Description from Google Play

> Buy or sell Bitcoin without ID verification. Cash or online.
>
> Wondering how to invest in Bitcoin? On AgoraDesk, purchasing bitcoins has never been easier - instantly buy BTC from a person using your favorite online payment method: PayPal, credit/debit card or bank transfer, gift cards, Venmo or any other. If you want to buy bitcoins near you with cash, you can find someone willing to sell bitcoins locally - the trading platform supports buying and selling BTC with cash. You can even buy bitcoins using cash by mail.
>
> Our app is free and open source, which ensures that many eyes are looking at the app's code to ensure that there are no security holes or privacy leaks. 

## Analysis 

How it Works:
> 1. Pick a payment method or choose from all the available offers.
> 2. Press BUY to start the trade.
> 3. Follow the seller's instructions in the trade chat

- The app did not provide seed phrases.
- There is a Bech32 BTC address that can send and receive.
- There was no option to back up the private keys from the settings.
- The platform has this clause in their [terms:](https://agoradesk.com/terms)
  > If we find your account to pose a high risk to AgoraDesk or our customers we will consider you in breach of these terms of service and may temporarily limit your account and freeze your cryptocurrency arbitration bond and fee wallet in accordance with these terms of service. We do not have any bank accounts that hold users' funds, nor do we facilitate or escrow any local currency payments between buyers and sellers. Trades are settled between unhosted wallets and accounts that directly belong to the trade parties.
- Trades can be between two parties with their own self-hosted wallets. [(More information here)](https://agoradesk.com/how-to-buy-cryptocurrency)
- As mentioned before, the app does have its own wallet.
- Digging [further:](https://agoradesk.com/faq#how-to-receive)
  > In order to sell cryptocurrencies on AgoraDesk you'll first need to send some coins for the arbitration bond to your AgoraDesk wallet. To do that you'll need a AgoraDesk account, access to coins in another wallet and you need to know your AgoraDesk receiving address.
- Thus, we conclude our findings. The wallet provided in the app is the AgoraDesk wallet. It also serves as the wallet for the arbitration bond mentioned above.
- As some sort of facilitator for trades, it is necessary for AgoraDesk to have control over this wallet and thus, the private keys. This is for [disputes:](https://agoradesk.com/faq#protection)
  > This means that if the seller runs away with your money and does not finalize the trade, **AgoraDesk support can direct the cryptocurrency held in the arbitration bond to you.** 
- The AgoraDesk wallet therefore has to be **custodial**.
