---
wsId: dfxDefichainWallet
title: DFX DeFiChain Wallet
altTitle: 
authors:
- danny
users: 5000
appId: com.defichain.app.dfx
appCountry: 
released: 2021-08-24
updated: 2023-03-22
version: 1.20.1
stars: 3.5
ratings: 
reviews: 2
website: https://dfx.swiss/defichain/
repository: 
issue: 
icon: com.defichain.app.dfx.png
bugbounty: 
meta: defunct
verdict: nobtc
appHashes: 
date: 2023-08-04
signer: 
reviewArchive: 
twitter: DFX_Swiss
social:
- https://www.instagram.com/dfx.swiss/
- https://www.linkedin.com/company/dfxswiss/
- https://t.me/DFXswiss_en
redirect_from: 
developerName: DFX AG
features: 

---

## App Description from Google Play 

> Do you want to participate in the decentralized financial market and earn high yields on your crypto? Buy & Sell DeFiChain Assets like e.g. DFI, dBTC, dETH, dTSLA, dNVDA with bank transfers at utmost simplicity and security, uncomplicated via the DFX wallet. This wallet enables you to have full control, since only you hold your private key.

## Analysis 

We downloaded the app and contacted the developer for some clarifications. 

For one, when we tapped the Bitcoin icon, this was the message [(Screenshot)](https://twitter.com/BitcoinWalletz/status/1649364211196399616/photo/3): 

> Send ONLY Bitcoin (BTC) to your BTC deposit address shown below or scan the QR code. We will transfer dBTC in your DFX Wallet afterwards
>
> Please click here to complete the KYC process and make a deposit or withdrawal to get your bitcoin address.

Our first question was "Doesn't this mean that the user will receive dBTC instead of actual BTC?" 

Here's their reply: 

> If you want to have dBTC by sending BTC to DFX you need to be fully verified.
Hence, you have to perform KYC and we need also one Fiat wire transfer (either buy Crypto or sell crypto with FIAT). The amount of the order is not relevant.
After these two steps are complete, you can send BTC for receiving dBTC on your DefiChain wallet address.

We followed up with: 

> Daniel: Just to clarify, this means, it's not possible to store BTC and send BTC from the app - only dBTC right?

They responded with: 

> Hi Daniel,
​>
> we have several products and apps for several blockchains -see https://dfx.swiss
​> 
> - DFX DefiChain App --> https://dfx.swiss/defichain/
> - DFX Bitcoin Only App --> it is a fork of the bluewallet with our Fiat on- and > offramp --> https://dfx.swiss/bitcoin/ 
> - DFX MetaMask Exchange --> https://dfx.swiss/exchange/
​>
> all of them are non custodial.

*Can a wallet be really non-custodial if a provider requires KYC before providing the private keys?*

## This is the part that confounds us

In their [Terms and Conditions](https://dfx.swiss/terms-and-conditions/) page, they state that: 

> Before DFX’s financial services can be used, the customer must register via the DFX app or on the payment page. Registration is free of charge and leads to the creation of a user profile after acceptance of the current terms and conditions. In addition, a non-custody wallet is created. DFX has no access to this, only the customer. When a customer registers, the information and documents that the customer must submit to DFX and the maximum amount for which the customer can buy or sell, respectively, stake cryptocurrencies depend on his identification level

The keys are supposedly provided to the user AFTER KYC.  

Note that there is a considerable amount of analysis undertaken by this company when it comes to transactions: 

This is found in the **"Handling of Customer Information Section"** of the same Terms page:

> Customers acknowledge that DFX may record and analyze all of its customers’ actions on DFX-owned websites, APIs, applications, and other direct marketing campaigns for purposes of security, system monitoring, administration, marketing, and compliance with legal and regulatory requirements. DFX will store this information under appropriate security conditions for a limited period of time. DFX will not disclose personal information to third parties **unless DFX is required to do so by law and/or regulation.**

## Analysis 

- The user for this specific wallet may have a supposedly "non-custodial" dBTC wallet after undergoing KYC. 
- After KYC, the user then deposits BTC which is then converted to dBTC by DFX 

I think Ockham's razor applies in this case, and the simplest explanation for this, is that it is **not a bitcoin wallet**.

 

