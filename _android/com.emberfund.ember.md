---
wsId: ember
title: "Ember Fund Invest in Crypto"
altTitle: 
authors:
- danny
users: 10000
appId: com.emberfund.ember
released: 2019-01-24
updated: 2021-09-21
version: "9.0"
stars: 4.5
ratings: 439
reviews: 253
size: 48M
website: https://www.emberfund.io/
repository: https://github.com/ember-fund
issue: 
icon: com.emberfund.ember.png
bugbounty: 
verdict: nosource
date: 2021-08-02
signer: 
reviewArchive:


providerTwitter: Ember_Fund
providerLinkedIn: 
providerFacebook: 
providerReddit: 

redirect_from:

---
From its Google Play description:

> Ember Fund is a **100% non-custodial** crypto wallet and investment platform which means we don’t store your crypto assets, so only you have full control and access to your funds!<br><br>
The most powerful property of Bitcoin, Ethereum, blockchain and crypto assets is the ability to custody your own assets instead of trusting a third party. We’ve built Ember to be fully non-custodial, so we don’t store your Bitcoin (BTC), Ethereum (ETH) or any cryptocurrency. Instead, we create and fund the necessary crypto wallets on your behalf. You alone have access and control of your funds through your device. We’re the first in the world to build a Bitcoin & cryptocurrency hedge fund investing & wallet app like this.

### The App

We downloaded the app and the first thing it asked to do after registering with an email and keying a pin, was to invite friends to 'start earning Bitcoin daily' at 10 sats/hr. We clicked on the "+" button and saw a Bitcoin logo. We clicked it and it showed a balance of $0.00 BTC, clicking on the QR code takes us to another screen with the ability to receive bitcoin. It says in the app that we need to fund the wallet before we could invest in a fund. We could not locate the send button as is customary in most Bitcoin wallets.

### The Private Keys

Ember claims:

>Our wallet technology provides state of the art security for users, making control of digital assets approachable by abstracting complex private keys to username, password, and PIN code (plus TouchID & FaceID).<br><br>
Ember knows nothing about the encrypted data it interacts with. This data is only accessible to the user. All data is fully encrypted before it touches our servers and can only be decrypted by the user while using the app. Ember does not store any information from user wallets, cannot execute trades, and cannot interact with the blockchain on behalf of the user. It's not just end to end encryption; it is Zero Knowledge architecture. This means that in the unlikely scenario of Ember being hacked, there would be no sensitive user data for an attacker to steal.

Furthermore, under the **Security** tab in Ember.io's Resources Page

> **Are my funds safe? Do I need to trust Ember Fund?**<br><br>
You own your own private keys so you are free to access your assets at all times through Ember or another wallet provider.

This statement poses further questions about how the user can access his own private key:

> **How can I view/export my private key?**<br><br>
Ember's security model was designed to avoid the risks of exporting private keys, while creating the simplest app experience possible.<br><br>‍
‍Your private key is encrypted and never leaves your device. Nobody else can access it, not even Ember.

If it is encrypted, never leaves the device and without an option to backup or export it by the user himself, this begs the question: how can you "access your assets" through "another wallet provider"?

### The Site and FAQ 

Ember.io's [FAQs](https://www.emberfund.io/resources) read:
> Ember Fund is a non-custodial DeFi platform, which means only you have access to your **private keys**, no personal information (aside from your email) is stored, 

We're still looking for a way to Send BTC from the wallet so we searched the site and found this information once you click on 'Withdrawing' under the [Resources](https://www.emberfund.io/resources) page:

> **How do I withdraw from my portfolio?**<br>
To withdraw from your portfolio, simply tap the “Liquidate Portfolio” button on the Settings page in the app. Your portfolio will be sold into Bitcoin that goes directly to your Ember wallet. From there, you can send your Bitcoin to any exchange to cash out for fiat currency. 

We were not able to locate the "Liquidate Portfolio" button under the Settings page. 

### Terms and Conditions

The Ember Terms can be found [here](https://www.emberfund.io/resources#w-tabs-0-data-w-pane-13).

The service offers a non-custodial app which does not readily offer the user to export the private keys, but its terms seem to disallow the user from the usage of the app given certain conditions. Section 4 states:

> Additionally, we may revoke Your access to our Platform if we believe that Your actions may harm us, our business interests, or any third party rights.  Failure by us to revoke Your access does not act as a waiver of Your conduct.  Nothing in this Agreement obligates us to provide You any access to the Platform or any of our associated services.

**Section 5** provides more information about the overall operation of the app:

> Ember Fund allows You to send, request, receive, and store digital currency (“Digital Currency or Digital Currencies”) via Your own digital wallet (“Digital Wallet”).  All wallets created are non-custodial, meaning that You control all private and public keys associated to the Digital Wallet and Ember Fund never has control or possession of Your Digital Wallet to facilitate any transactions made. Ember Fund reserves the right to refuse to process or to cancel any pending digital transaction as required by law, at our discretion, in response to a subpoena, court order, or other binding government order, or to enforce transaction limits. Please be aware that once a transaction is initiated via Your Digital Wallet, Ember Fund may not reverse such transaction, Your Digital Wallet is solely controlled by You and we cannot access or control Your Digital Wallet in any manner, You are solely liable for maintaining access to Your Digital Wallet . 

### Contact

Initially, we thought of it as a DeFi app of sorts, but upon looking at the terms and the reviews, it may appear more like a custodial service. Although it is possible to backup 
We reached out to Ember.io to ask them about their app via [twitter](https://twitter.com/dannybuntu/status/1440227344258527237).

### Source Code
Ember.io does provide a link to their Github account, however none of the repositories match up with this app's ID. While [one repository](https://github.com/ember-fund/edge-react-gui) has an application ID, it is simply a fork of {% include walletLink.html wallet='android/co.edgesecure.app' %}

The repo does not contain any original code and was not updated since February 2020.

### Verdict
This app claims to be non-custodial, but with no source to back it up, it is **not verifiable.** The app is closed source.
