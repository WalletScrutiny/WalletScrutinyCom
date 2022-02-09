---
wsId: kinesismoney
title: "Kinesis Money - Exchange Gold, Bitcoin & Currency"
altTitle: 
authors:
- danny
users: 10000
appId: com.kinesis.kinesisapp
appCountry: us
released: 2020-02-28
updated: 2021-12-15
version: "1.2.78"
stars: 4.0
ratings: 419
reviews: 44
size: 36M
website: https://kinesis.money/
repository: https://github.com/KinesisNetwork/wallet-mobile
issue: 
icon: com.kinesis.kinesisapp.png
bugbounty: 
meta: ok
verdict: nosource
date: 2021-09-30
signer: 
reviewArchive:

providerTwitter: KinesisMonetary
providerLinkedIn: kinesismoney
providerFacebook: kinesismoney
providerReddit: Kinesis_money

redirect_from:

---

### Google Play
Kinesis app tries to integrate different markets for trading, sending and receiving. With the app, you can trade Kinesis gold (KAU), Kinesis silver (KAG) and cryptocurrencies. It also has an option for a Visa debit card. The app also features a 'cryptocurrency exchange' service that allows users to trade KAU and KAG with cryptocurrencies such as Bitcoin and Ethereum.

### The App

We downloaded the app and registered via email. It then asked us to verify and create a pin. We verified our identities via government ID, selfie and utility bill. 

You need to setup 2FA in order to access the BTC wallet. Once you have that up, you can receive or send bitcoins. We then tried to look for options to backup the BTC wallet via a mnemonic or a seed. We were not able to locate it on the phone. 

### The Site

We were able to find some information that proves the app can send, receive and store bitcoin. One of them is the [withdrawals fee page](https://kinesis.money/about-us/fees/#h-withdrawal-of-crypto-and-fiat). 

The options from the web application of Kinesis has more details regarding the 12-word recovery seed phrase. Note that we were not able to access this option via the mobile app.

> **What is your 12-word recovery (seed) phrase?**<br><br>
Your Kinesis 12-word seed phrase, also known as a "private keys", "recovery phrase", or "mnemonic phrase", are a string of numbers and letters that are unique for each account. They are used to generate the public keys and these public keys are used to generate the public addresses you use to receive cryptocurrencies.<br><br>
When you activate a wallet on your laptop using chrome, for example, this is the only place you can access it. If you want to access it on a different browser, or on another device, you will need to use that recovery phrase again.

While we were also able to locate the [source code](https://github.com/KinesisNetwork/wallet-mobile) for the Android wallet, the repositories last commit was from May 18, _2018_. The appID was also `com.kinesiswalletapp` rather than `com.kinesis.kinesisapp`, the appID on the Play Store.

From the Help Center: [Can I use the Kinesis Wallet on multiple computers?](https://support.kinesis.money/hc/en-gb/articles/360031778772-Can-I-use-the-Kinesis-Wallet-on-multiple-computers-)

> Yes, you can, however, you will need to import your Wallet on each new device and browser which will require your recovery phrase. Be aware, clearing your device cache will require you to re-import your wallet using the recovery phrase.

On the web application, we are able to import an existing wallet via a 12-word phrase or create a new wallet. Once we created a wallet, we were provided with our new 12-word phrase. After confirming that the user has saved the key, we were compelled to check the user agreement:

> I understand that my wallet and Kinesis are held securely on this device and not on any servers.

### Verdict

From the above, we can conclude that this app is **non-custodial.**

However, with the app's latest update being on 2021-08-09 and the Github repository having last been updated back in 2018, it's doubtable that the source code will match up. As such, this app is **not verifiable.**
