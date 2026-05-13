---
wsId: lnFlash
title: 'Flash: Rewards & Payments'
altTitle: 
authors:
- danny
users: 1000
appId: com.lnflash
alternativeStores: 
appCountry: 
released: 2024-01-07
updated: 2026-05-02
version: 0.5.2
reviews: 
website: https://getflash.io
repository: https://github.com/lnflash/flash-mobile
icon: com.lnflash.png
bugbounty: 
meta: ok
verdict: sourceavailable
date: 2025-06-13
signer: 
twitter: LNFlash
social:
- https://njump.me/npub1l080awn9wsw87ywm3flmpmccf5rmlvhd7vfgspj2pnavxupnlfesmflash
- https://www.instagram.com/getflash.io
- https://www.youtube.com/@LNFlash
- https://www.linkedin.com/company/getflash-io
redirect_from: 
developerName: Island Bitcoin
builds: 
features:
- foss
- liquid
- ln
- nfc

---

## App Description from Google Play

> Flash is helping bring the digital finance ecosystem to the Caribbean. Flash is built on top of the Bitcoin and Lightning Networks. Based on the code that runs Blink wallet, it uses the infrastructure from Galoy.
>
> Flash has built reliable Bitcoin Lightning Payments for All: Flash is a wallet you can reach for when you need payment speed and reliability. Rest assured knowing that Flash has dedicated global partners managing Lightning Network liquidity and channels, handling support requests, and improving the app every day.
>
> Great Wallet for Beginners: Flash is designed to make your first steps in Bitcoin simple. Flash is an easy to use, reliable and feature-rich custodial Lightning wallet for everyday payments.
>
> Low Fees Across the Board: Whether you're sending or receiving via the Lightning Network, Flash Wallet ensures fees are kept to a minimum, often lower than other ways to pay. Transfers between Flash users are entirely free—send and receive without the worry of high fees.
>
> USD Stability & Bitcoin Flexibility: Keep your account stable with our Stabilized USD-equivalent accounts, providing a hedge against volatility for your short-term spending. Fully compatible with the Lightning Network, Flash Wallet ensures your funds are as flexible as they are stable.
>
> Receive Bitcoin Your Way: Flash Wallet provides many ways to receive Bitcoin, including custom Lightning Addresses for each user, printable LNURL Paycodes and more. Receive Bitcoin via NFC technology, making transactions as simple as a tap with devices like bolt cards or rings, or redeem bitcoin from QR vouchers such as Azteco and Lightsats effortlessly, thanks to the new LNURL-withdraw feature.
>
> Bitcoin Point of Sale for Merchants: Every Flash wallet user has a receive-only, web-based Point of Sale “Cash Register.” This lets employees or anybody else create invoices on behalf of the business. It can be pinned to an employee’s home screen, or shared on-line for receiving donations or tips.
>
> Experience and Learn Bitcoin in your Native Language: Multiple languages make Flash Wallet feel built for you, regardless of where you live. Today, the wallet is translated to English, Spanish, French, Portuguese, Czech, German, Thai, Catalan, Swahili and many more. The Flash bitcoin wallet is available in more than 20 languages. Don’t see your language? Reach out to us on Twitter at @LNFlash or on Nostr at @npub1l080awn9wsw87ywm3flmpmccf5rmlvhd7vfgspj2pnavxupnlfesmflash to request a new language.
>
> Open Source Bitcoin Wallet: True to the Bitcoin ethos, the Flash bitcoin wallet is built on Free and Open Source Software (FOSS). Flash is built on open source Bitcoin banking infrastructure maintained by IBEX, and open source non-custodial Bitcoin software development kit maintained by Breez technologies.
>
> Key Features for Flash Users:
> - Custom Lightning Address for all Flash users (username@flashapp.me)
> - NFC capabilities for receiving Bitcoin with convenience.
> - Email authentication for enhanced account security.
> - Nostr enabled DM and group chat capabilities (coming soon)
> - Comprehensive in-app Bitcoin education, ideal for beginners.
>
> Additional Advantages:
> - Zero fees for transactions within Flash Wallet users.
> - A detailed log for all your Bitcoin payments.
> - An intuitive contact list for frequent transactions.
> - A map pinpointing local businesses that accept Bitcoin via Lightning.
> - Compatibility with leading wallets such as Blink, Strike, Phoenix, CashApp, River, and Wallet of Satoshi & more.
>
> Download Flash Wallet today and join a growing community embracing Bitcoin.

## Analysis

Flash Wallet explicitly identifies as *hybrid-custodial*, stating that it relies on "dedicated global partners managing Lightning Network liquidity and channels," and offers features like "Stabilized USD-equivalent accounts"—both of which indicate that users do not hold their own private keys. These services require backend infrastructure controlled by the operator, meaning user funds are held on their behalf.

They have a tiered model where if you provide your sms or email, the backup of the seed phrases is made available. 

To quote:

> Flash is a hybrid custodial wallet, so your backups on your Cash(USD) wallet are automatically encrypted and stored when you add a phone number or email address to Flash App. However, your Bitcoin wallet is completely under your control, and you will need to secure the backup yourself. In order to restore your Cash(USD) wallet in the event that you lose your device, you will to follow our restore process (Import Wallet) and provide your phone number or email address. For your BTC wallet we strongly recommend writing down your backup phrase and storing it in a secure place as soon as possible.
>
> IMPORTANT: If you lose your device and do not have your backup phrase, you will not be able to restore your BTC wallet and your Bitcoin will be lost. Treat your Bitcoin wallet like your savings account, and your Cash(USD) wallet like the cash in your pocket; we recommend that you only store as much cash on Flash as you would carry in your pocket.

The app supported both Bitcoin and lightning. We tested this and was provided with the 12-word seed phrases. This app's **source is available.**

{% include featureEvidence.html feature="ln" quote="Flash is built on top of the Bitcoin and Lightning Networks." source="Store" %}

{% include featureEvidence.html feature="foss" quote="This project is licensed under the MIT License." source="GitHub README" %}

{% include featureEvidence.html feature="nfc" quote="Receive Bitcoin via NFC technology, making transactions as simple as a tap with devices like bolt cards or rings" source="Store" %}

{% include featureEvidence.html feature="liquid" quote="Seamless integration with Liquid sidechain functionality" source="GitHub README" %}