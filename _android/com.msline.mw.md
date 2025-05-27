---
wsId: masterWallet
title: MasterWallet
altTitle: 
authors:
- danny
users: 10000
appId: com.msline.mw
appCountry: 
released: 2019-06-20
updated: 2022-06-20
version: 2.3.3
stars: 
ratings: 
reviews: 
website: http://x-widget.org/
repository: 
issue: 
icon: com.msline.mw.png
bugbounty: 
meta: removed
verdict: custodial
appHashes: 
date: 2023-08-16
signer: 
twitter: 
social: 
redirect_from: 
developerName: x-widget
features: 

---

Note: The twitter account for {% include walletLink.html wallet='android/io.masterbank.app' verdict='true' %} [references this app](https://twitter.com/masterpay7/status/1376758986196721665) via a tweet. They may be related.

We tried multiple times to register with the app, but we did not receive the confirmation email. 

Prior to registration, we were given the option to create or restore a wallet using seed phrases. [(Twitter Screenshot)](https://twitter.com/BitcoinWalletz/status/1644619048267960321) After this, we were asked to register. 

We could not find a copy of the service's Terms and Conditions via the website,  it was only available in the app. We posted [screenshots on twitter.](https://twitter.com/BitcoinWalletz/status/1644617555276095488)

## App Description from Google Play

> MasterWallet makes it easy and secure to manage multiple digital assets like Bitcoin, Ethereum, Ripple, Binance and many other tokens such as AXL, Polestar, etc. 

## Findings 

- After several attempts and variations, we still were not able to receive the verification email. 
- The app claims to be non-custodial through the use of a 12-word seed phrases given on its app. We tried this on Electrum but it did not work. 
- Moreover, once the option to create a wallet is given - the user will not be able to access these same options again unless they sign in. For us, we were stuck in the registration form. Thus, we cannot import the seed phrases in this app anymore. 

## The Terms 

> - The Company provides the following services:
>
> 1. Enabling trade of digital asset between Members.
> 2. Storing, buying and selling of cryptocurrencies between Members.
> 3. Withdrawing money to a Member's personal bank account
>
> Article 25 (Withdrawal of Digital Assets and Korean Won) 
>
> 1. When a Member requests a withdrawal, the Company shall first verify his or her identity and withdraw the requested amount to the address registered by the Member or to the account under the Member's name.
> 3. Daily limit and procedure of crypto currency withdrawal follows the guidelines on the website.

## Analysis and Verdict 

We were not able to register with the service so we are going to make assumptions based on some facts that we gathered.

1. We do not know if this app can indeed accept or send Bitcoin. But if we follow the description on the app and the Terms, we can assume that it should be able to. Otherwise, they are making misleading claims. 

2. If a member needs to "request" a withdrawl, this means that the provider is ultimately the custodian for the funds. A real non-custodial wallet would require no such permission. 

3. We were able to get the seed phrases - but again, without the ability to restore this on another wallet, or on the same app itself without having to log in or register, it defeats the purpose. 

Based on these findings we will be marking this as a **custodial** provider unless new information comes up. The app is **not verifiable**.






