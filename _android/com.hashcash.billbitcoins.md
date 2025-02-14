---
wsId: 
title: 'Billbitcoins- Pay With Crypto'
altTitle: 
authors:
- 'danny'
users: 1000
appId: 'com.hashcash.billbitcoins'
appCountry: 
released: '2021-03-17'
updated: 2024-10-08
version: '2.0.12'
stars: 4.8
ratings: 98
reviews: 5
website: 'https://www.billbitcoins.com/index.html'
repository: 
issue: 
icon: 'com.hashcash.billbitcoins.png'
bugbounty: 
meta: 'ok'
verdict: 'nowallet'
appHashes: 
date: '2024-11-28'
signer: 
reviewArchive: 
twitter: 
social: 
redirect_from: 
developerName: 'Hashcash Consultants LLC'
features: 

---

## Google Play App Description

> Conventional card based payment platforms cost you upto 3% per transaction. Through Billbitcoins you save upto 2% without the hassles of card platforms.

## Analysis

In its [Terms of Use](https://billbitcoins.com/terms-of-use/), it describes the app in the following manner:

> This Software functions as a free, open source, and multi-signature digital wallet. The Software does not constitute an account where We or other third parties serve as financial intermediaries or custodians of Your bitcoin(s).
>
> While the Software has undergone beta testing and continues to be improved by feedback from the open-source user and developer community, We cannot guarantee there will not be bugs in the Software. You acknowledge that Your use of this Software is at Your own discretion and in compliance with all applicable laws. You are responsible for safekeeping Your passwords, private key pairs, PINs, and any other codes You use to access the Software.
>
> IF YOU LOSE ACCESS TO YOUR BITCOIN WALLET OR YOUR ENCRYPTED PRIVATE KEYS AND YOU HAVE NOT SEPARATELY STORED A BACKUP OF YOUR WALLET AND CORRESPONDING PASSWORD, YOU ACKNOWLEDGE AND AGREE THAT ANY BITCOIN YOU HAVE ASSOCIATED WITH THAT WALLET WILL BECOME INACCESSIBLE. All transaction requests are irreversible. The authors of the Software, employees and affiliates of Billbitcoins, copyright holders cannot retrieve Your private keys or passwords if You lose or forget them and cannot guarantee transaction confirmation as they do not have control over the bitcoin network.

### Actual Experience

The app starts by asking the user to sign in or register. Clicking 'sign up' will open the registration page. This includes providing a real name, organization, phone number and email address. 

There is nothing to indicate that this is a Bitcoin multisignature wallet app. We could not locate the seed phrase or private key option nor were these given during startup. There was no wallet-creation stage. Instead, there was a registration page. Eventually we got locked out of the app. We documented in video our testing and [posted it on x.](https://x.com/dannybuntu/status/1862125299544269012). 

Next up, we tried to look for the source code of the app. We found their [GitHub organization page.](https://github.com/orgs/HashCash-Consultants)

But could **not** find the relevant [Android app source code.](https://github.com/search?q=com.hashcash.billbitcoins&type=code)

So this gets more confusing, when we scrolled further down the terms.

> We are a cryptocurrency payment processor. We enable you to accept cryptocurrency as payment for goods or services, and process cryptocurrency payments that you receive from your customer (Purchaser). We are not a crypto exchange, wallet, or a place to purchase or sell cryptocurrencies.

This seems to reflect what we experienced on the web app. We could add our own Bitcoin address, and the web app did not provide a Bitcoin address. 

It would make more sense to mark this app as **not a Bitcoin wallet**.