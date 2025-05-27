---
wsId: 
title: Bitbarg
altTitle: 
authors:
- danny
users: 50000
appId: com.bitbarg.app
appCountry: 
released: 2022-03-12
updated: 2025-03-04
version: 3.2.8
stars: 4.3
ratings: 
reviews: 44
website: https://bitbarg.com
repository: 
issue: 
icon: com.bitbarg.app.png
bugbounty: 
meta: ok
verdict: nosendreceive
appHashes: 
date: 2023-07-07
signer: 
twitter: bitbarg
social:
- https://www.linkedin.com/company/bitbarg-com
- https://t.me/bitbarg24
- https://www.instagram.com/bitbarg24
redirect_from: 
developerName: Bitbarg
features: 

---

## App Description from Google Play

> Choose from 400+ supported cryptocurrencies, including Bitcoin (BTC), Ethereum (ETH), Bitcoin Cash (BCH), Litecoin (LTC), Binance Coin (BNB), and more.
>
> CLASS-LEADING SECURITY
> Security is the highest priority for us when it comes to safeguarding your funds. Your funds are protected by our Secure Asset Fund for Users. Store your crypto safely with the Bitbarg app.

## Analysis

- The app and website's language is primarily in Persian.
- The terms can be found [here](https://bitbarg.com/terms-of-service).
  - Generally, the Terms describes the service as an exchange wherein the platform earns through fees. It is account based, and the users must register using a phone number.
  - The platform has a termination clause that bars the user's access from the service given certain conditions.
  - Dispute resolution will be through the laws of the Islamic Republic of Iran.
- The description describes a custodial service.
- **Strangely**, it also claims that it does **not** [provide a "currency wallet service"](https://bitbarg.com/how-to-create-wallet) - which contradicts its description. It then proceeds to link to both the Android and iOS version of {% include walletLink.html wallet='android/com.wallet.crypto.trustapp' verdict='true' %}
- We were also not able to register despite trying to use a temporary Iranian number because the app's interface would not allow us to add another digit.
- We tried asking their support via the chat, but they kept insisting that we should get a user account before they will answer any question. After persistent queries they finally relented and answered via chat. We posted the original message on twitter. The image can be downloaded and uploaded to Google translate. It says that the account supports a Rial wallet, but not a cryptocurrency wallet.
- We posted screenshots on [twitter](https://twitter.com/BitcoinWalletz/status/1677223158292652034).
- We were in a quandary as to what verdict to give this app. Initially, we thought that it was custodial. Then we thought that it did not have a wallet as [confirmed by their support](https://twitter.com/BitcoinWalletz/status/1677226845312360450) [(Translation using Google Translate)](https://twitter.com/BitcoinWalletz/status/1677227844437524480). But then we thought, users can purchase BTC using the Rials in their account, so this qualifies as an app that **cannot send or receive bitcoin**.
- Though I came up with this finding, I would recommend a native Persian speaker to corroborate our findings as there is quite a lot to be lost in translation.
