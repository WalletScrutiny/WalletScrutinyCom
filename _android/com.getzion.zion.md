---
wsId: 'zionApp'
title: 'Zion - Create Openly'
altTitle: 
authors:
- 'danny'
users: 5000
appId: 'com.getzion.zion'
appCountry: 
released: '2021-12-21'
updated: '2023-05-12'
version: '2.0.5'
stars: 2
ratings: 
reviews: 27
size: 
website: 'https://getzion.com'
repository: 
issue: 
icon: 'com.getzion.zion.png'
bugbounty: 
meta: 'removed'
verdict: 'nosource'
appHashes: 
date: '2025-02-13'
signer: 
reviewArchive: 
twitter: 'get_zion'
social:
- 'https://www.instagram.com/get_zion'
redirect_from: 
developerName: 'Zion - Create Openly'
features: 

---

## App Description from Google Play

> The latest version contains a new feature - direct messages!
> 
> - opened by pressing on the paper plane icon from the feed screen or from the profile of a different user;
> - write text messages, share photos and videos, send or receive sats;
> - search for new contacts in the New Contacts tab accessed from the list of your chats.
>
> The update also includes:
> 
> - boosts renamed to ZAPs;
> - custom ZAP amount (long press on a ZAP icon);
> - blue creator checkmark.

## Analysis 

- When first signing-up the user is given a 12-word mnemonic phrase instead of a password. The account of the user is also known as the DID, or decentralized ID.
- The app is a social content-rewarding platform using lightning. 
- The 'wallet' interface is denominated in Sats. It has send and fund options. When we click on 'fund', it generates a lightning invoice. There is a warning informing the user that the QR code is not a bitcoin wallet. 
- Under the same QR code display, there is a button that says, 'Open Wallet'. It opens a recommendation to CashApp. 

## Commentary by [Leo](/authors/leo/):

> A LN wallet is a Bitcoin wallet. Not all LN wallets support sending or receiving to bitcoin addresses but LN transactions do require private keys of course and in contrast to base layer transactions, the receiving wallet also needs the keys.
>
> In contrast to base layer, on lightning, things are not so standardized and with only the mnemonic you would not be able to restore the wallet. Sadly, many LN nodes require a backup after every transaction sent or received.

## Continued

Described in the documentation:

> A Zion account contains your DID:ION, connects you to the Zion DWN, and Zion Lightning Wallet. 

The Zion [DWN](https://docs.zion.fyi/Architecture/decentralized-web-nodes) is the Zion decentralized web node which a Zion account connects to. 

It is common convention to have a lightning wallet alongside a Bitcoin wallet, but Zion seems to have done away with the Bitcoin wallet portion maybe for the purposes of simplifying the user experience. But then, this gets tricky. If the app does not have the Bitcoin private keys, but has a lightning wallet, how then are transactions signed? How is a channel maintained? Who controls the nodes? 

Interestingly, Zion describes itself as a [semi-custodial](https://www.zion.fyi/terms) platform indicating that they do not have copies of the user's seed phrases. They also describe themselves as an Open Source platform, but only have an organizational GitHub with 1 repository for their whitepaper. Searching for their App ID, [does not result](https://github.com/search?q=com.getzion.zion&type=code) in any hit within GitHub code.

This makes the app **not source-available.**
