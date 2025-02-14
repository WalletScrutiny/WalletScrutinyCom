---
wsId: 
title: 'EttaWallet'
altTitle: 
authors:
- 'danny'
users: 10
appId: 'com.ettaln'
appCountry: 
released: 
updated: '2023-09-06'
version: 'VARY'
stars: 
ratings: 
reviews: 
size: 
website: 'https://ettawallet.app'
repository: 'https://github.com/EttaWallet/EttaWallet'
issue: 
icon: 'com.ettaln.png'
bugbounty: 
meta: 'removed'
verdict: 'fewusers'
appHashes: 
date: '2024-11-07'
signer: 
reviewArchive: 
twitter: 'ettawallet'
social: 
redirect_from: 
developerName: 'Rukundo'
features:
- 'ln'

---

## App Description from Google Play

> EttaWallet is a self-custodial, open-source Lightning wallet that leverages the Lightning Network for secure and intuitive daily bitcoin transactions.
>
> Meticulously crafted with the help of the Bitcoin Design community, EttaWallet is perfect for both beginners and seasoned bitcoiners. Benefit from top-notch security, instant, low-fee transactions via the Lightning Network, and an intuitive interface, all while maintaining complete control over your private keys.

## Analysis 

1. The app starts by giving two choices: 'Create a Wallet' or 'Restore a Wallet'.
2. The app then proceeds to ask the user to nominate a 6-digit pin. 
3. When the user taps on 'Request' (similar to 'receive'), the user is then presented with this:

> First things first, you'll need a payment channel
>
> tldr:
>
> Before you can send or receive bitcoin on the lightning network, you need to have a payment channel with a well connected node.
>
> Setting up a payment channel will allow you to move bitcoin freely and instantly from one person to the next
>
> EttaWallet will atttempt to open a new channel with a Lightning Service Provider (LSP) to obtain liquidity and to route your payments through the network
>
> In order to route payments to their final destination, there is usually a small routing fee you have to pay.
> 

### The app then spins up the status indicators:
- Spinning up lightning node ...
- Generating invoice
- Paying invoice

4. It is not clear who manages this LSP. 
5. The on-chain BTC address is not accessible.

This app is [for verification](https://github.com/EttaWallet/EttaWallet/issues/7), but until such time this app has more users, the prevailing verdict would be that it has **few users**.


