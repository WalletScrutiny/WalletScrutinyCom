---
title: Mutiny Wallet
appId: app.mutinywallet.com
authors:
- danny
released: 2023-07-29
discontinued: 
updated: 
version: 0.4.6-1
binaries: https://github.com/MutinyWallet/mutiny-web/releases
dimensions: 
weight: 
provider: 
providerWebsite: 
website: https://www.mutinywallet.com
shop: 
country: 
price: 
repository: https://github.com/MutinyWallet/mutiny-web
issue: https://gitlab.com/walletscrutiny/walletScrutinyCom/-/issues/495
icon: app.mutinywallet.com.jpg
bugbounty:
meta: ok
verdict: wip 
date: 2023-08-02
signer: 
reviewArchive: 
twitter: MutinyWallet
social:
- npub1t0nyg64g5vwprva52wlcmt7fkdr07v5dr7s35raq9g0xgc0k4xcsedjgqv
features:
- ln
- nostr integration 
---

## App Description 

> Mutiny is a self-custodial lightning wallet that runs in the browser.
>
> Users managing their own liquidity is tough, so that's why we've partnered with Voltage to be the main Liquidity Service Provider with their new Flow 2.0 product that we helped develop. This service lets you receive Lightning payments without worrying about opening channels or managing liquidity. This integration allows a new Mutiny user to receive their first Lightning payment within seconds of opening the application.
>
> We've decided to separate the balance between your funds locked up in Lightning channels and funds available for on-chain spending. While unified balances are the end goal, some sacrifices have been made with other Bitcoin wallets that confuse users with different trade-offs. Our trade-off here is that users are in control at the cost of a little more complexity. When splicing is more widely available, this should significantly help solve all the problems with unified balances. We applaud Pheonix for being the first in this space and for all the hard work they've done along with Dusty Daemon.
> 
> Like many Bitcoin wallets, your seed words secure all your funds on Mutiny. When you first load the wallet, you may go to settings to view it, or you will be prompted to back up your seed after receiving funds for the first time. After backing up, you can set a password to encrypt your local storage data. This requires you to unlock the wallet every time it loads to protect the funds on your device.
>
> Typically, only your on-chain funds are secured by your seed words. So now, we've added encrypted & remote storage into the mix for restoring your latest Lightning-related data. If you ever clear your browser storage or move to a new device, your Lightning data will be pulled down from your configured backup server to restore your funds. We use a new project called Versioned Storage Service to do this, which you may self host yourself. VSS is also made by Block's Spiral team, primarily by Gursharan, so huge acknowledgments for making that possible.

- The app is currently in beta, and they also offer a Signet version which uses test coins.
- Initiating a lightning payment requires that a lightning channel must be opened. This requires a minimum amount (currently at 50,000 sats + a setup fee)

## Analysis 

- This progressive web app gives the user the capacity to back up the seed words. 
- It also allows self-hosting.
- Since it is self-custodial and source-available, **it is for verification**.
