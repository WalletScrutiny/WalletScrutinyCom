---
wsId: bitfy
title: "Bitfy: Super App de Criptomoedas"
altTitle: 
authors:
 - danny
users: 100000
appId: com.bitfyapp
released: 2019-10-14
updated: 2021-07-24
version: "3.10.13"
stars: 3.1
ratings: 955
reviews: 627
size: 33M
website: https://bitfy.app
repository: 
issue: 
icon: com.bitfyapp.png
bugbounty: 
verdict: nosource
date: 2021-08-01
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
  Do not use this wallet. The seed provided by them works only in the bitfy app, that is, if the app disappears, your money goes with it.

To verify this, we proceeded to download the app on a Samsung Phone. 

They ask for your email address and mobile phone number. After filling in some personal details, you are asked to verify. 

Then you are asked to create an app password and a pin. The pin is used for a variety of things including payments and the provision of the 12 seed words which are then sent via email after creating a wallet. The only way to open the PDF that contains the seed words is through the 6-digit pin.

The seed words are in Portuguese, even though some segments of the app are in English.  

Unfortunately as of this writing, we were not able to import a wallet created using bitfy using electrum. Perhaps, more tests are warranted. 

We also could not find a direct link from the main domain linking to the source code of the app.
