---
title: BitCard®️
appId: bitcards
authors:
- danny
icon: bitcards.png
date: 2022-05-17
website: https://bitcards.com/
twitter: Bitcard_US
social:
- https://www.linkedin.com/company/bitcard/
- https://www.facebook.com/BitCardUS/
- https://www.instagram.com/bitcard_us/
provider: Bitcoin Solutions, Inc
shop: https://www.cardcash.com/buy-gift-cards/discount-bitcoin-cards
country: US
meta: ok
verdict: custodial

---

## Background 

Oddly, {{ page.title }} does not provide physical gift cards, but sends out e-giftcards online instead. Bitcoin Solutions claim to be 100% regulated. 

## Product Description 

From the [FAQ](https://bitcards.com/faqs/):

> Are BitCard® safe?
> When you buy a BitCard®, all cryptocurrencies are held in secure cold storage. All funds are FDIC insured 100% in Fiat currencies up to 130 million dollars. BitCard® has a state-of-the-art platform where you can track all your Bitcoin and business in real-time with total confidence.

**Redemption requires registration on bitcards.com as well as KYC**

> 1. Go to our website bitcards.com
2. Register an account or log in
3. Complete the KYC process
4. Click on the “Redeem BitCard®” button
5. Enter your gift card number and pin
6. Finished!

**How does {{ page.title }} store your bitcoin?**

> When you redeem your BitCard®, your coins are stored by a licensed and regulated Nevada chartered trust company, which secures billions of dollars’ worth of fiat and cryptocurrency for some of the biggest companies in the industry.
>
> Your Bitcoin and USD are stored under your name with you as the sole legal owner. BitCard® does not have the ability to move your funds.
>
Bitcoin is stored in offline cold storage wallets using best-in-class security practices and technologies.
>
BitCard® cannot move your Bitcoin or USD without your authorization. In order to ensure that BitCard® cannot move Bitcoin out of your account, you will receive a direct confirmation of withdrawal from our financial institution whenever you withdraw your Bitcoin. This email is delivered directly to you and requires your authorization to move Bitcoin from cold storage wallets to your own.

## Analysis 

When the user redeems the {{ page.title }}, he is asked to register an account and complete the KYC process. Then rather than a private key or a QR code, the user is asked to enter the gift card number and pin. 

We initially thought that this service is a bearer token because of the mental image of a "gift card". Upon closer investigation, we discovered that it was only an e-giftcard, with no public or private keys. 

Users need to log in to the managed account via the bitcards.com website. This is a **custodial service**. 
