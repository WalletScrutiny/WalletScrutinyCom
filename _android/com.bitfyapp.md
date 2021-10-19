---
wsId: bitfy
title: "Bitfy: Super App de Criptomoedas"
altTitle: 
authors:
- danny
users: 100000
appId: com.bitfyapp
released: 2019-10-14
updated: 2021-10-18
version: "3.10.18"
stars: 4.0
ratings: 1011
reviews: 664
size: 32M
website: https://bitfy.app
repository: 
issue: 
icon: com.bitfyapp.png
bugbounty: 
verdict: nosource
date: 2021-09-10
signer: 
reviewArchive:


providerTwitter: bitfyapp
providerLinkedIn: 
providerFacebook: bitfyapp
providerReddit: 

redirect_from:

---


Bitfy is a Brazilian app that claims to have a:

> All-in-one digital wallet ensures that users are the only ones who have access to private keys.

Translated using Google Translate, it explicitly states its self-custodial nature

> We are a non-custodant portfolio, we do not have access to your keys.

On the surface, it may seem that the app has many of the characteristics for 'good' self-custodial bitcoin wallet. But we proceeded to investigate further by looking at the reviews and downloaded the app.

One of the more indicting reviews on Google Play was this:

> [Luiz Sahb Druziani](https://play.google.com/store/apps/details?id=com.bitfyapp&reviewId=gp%3AAOqpTOHdfOm2ZYnNVaUuVbyLCzlzkUFo5oiiXkPuzcAx8DkhnaYPzAeHXxyYWQxOtKXGof-1qYbOJlmttoL07w)<br>
★☆☆☆☆ May 28, 2020<br>
Do not use this wallet. The seed provided by them works only in the bitfy app, that is, if the app disappears, your money goes with it.<br>

To verify this, we proceeded to download the app on a Samsung Phone. 

They ask for your email address and mobile phone number. After filling in some personal details, you are asked to verify. 

Then you are asked to create an app password and a pin. The pin is used for a variety of things including payments and the provision of the 12 seed words which are then sent via email after creating a wallet. The only way to open the PDF that contains the seed words is through the 6-digit pin.

However, this is potentially poor protection for a wallet backup. They have 100k downloads and send mnemonics from their servers with a 6 digit pin "password protection". The app claims to be self-custodial but it is possible for them to access the mnemonics.

Even if they delete the mnemonic after sending it to the user (which cannot be proven), now the user's email provider and a bunch of other servers have a copy, too. 6 digits only protects against manual, not automated brute force.

The seed words are non-standard mnemonics. They are not found in the BIP39 list. Specifically, [the Portuguese mnemonics](https://github.com/bitcoin/bips/blob/master/bip-0039/portuguese.txt). 

Unfortunately as of this writing, we were not able to import a wallet created using Bitfy using Electrum. Perhaps, more tests are warranted. 

While keeping all this in mind this app is still classifiable as a **non-custodial** wallet. However, with **no source** in sight, we do not have the means to verify this wallet.
