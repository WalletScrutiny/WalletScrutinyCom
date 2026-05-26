---
wsId: confirmoLightning
title: Bitcoin Lightning POS
verdict: custodial
meta: removed
authors:
- danny
twitter: CryptoConfirmo
social:
- https://www.linkedin.com/company/confirmoltd
- https://www.facebook.com/confirmo.net
redirect_from:
- /android/cz.confirmo.app.confirmo_flutter/
- /iphone/confirmo.app.pos/
android:
  appId: cz.confirmo.app.confirmo_flutter
  users: 1000
  released: 2022-08-12
  updated: 2023-08-01
  version: 1.0.8
  icon: cz.confirmo.app.confirmo_flutter.png
  date: 2024-04-26
  website: http://confirmo.net
  developerName: CONFIRMO
iphone:
  appId: confirmo.app.pos
  idd: '1639106148'
  appCountry: ca
  released: 2022-08-24
  updated: 2023-08-18
  version: 1.0.8
  reviews: 0
  icon: confirmo.app.pos.jpg
  date: 2025-10-15
  website: http://www.confirmo.net/
  developerName: Confirmo s.r.o.

---

## Android

## App Description from Google Play

> 1. You type in the amount to receive.
> 2. The app will generate a unique invoice with a QR code.
> 3. Your customer scans the code with their crypto wallet, NFC tag or Bolt
Card and confirms the payment.
> 4. The funds are instantly sent to your Confirmo account in BTC, Fiat or stablecoins depending on your account settings.
> 5. The funds are automatically transferred to your linked bank account or crypto wallet.
>
> Download the app and pair it with your Confirmo account. That’s all.
>
> Both the account and app are completely free. You can pair multiple
devices with one Confirmo account in your dashboard, where you will
also find a complete transaction history and user-friendly accounting.
Your account is also fully compatible with our crypto payment gateway,
email invoicing, and payment & donation buttons.

From their website:

> Turn your smartphone into a Bitcoin Lightning POS terminal.

## Analysis 

1. We were asked to pair with a Confirmo account.
2. We took a look at their [Terms and Conditions](https://confirmo.net/legal/terms-and-conditions#deadLink)

**Wallet and Exchange Services**
>
> 25.1. We provide a DC wallet and a deposit account in FC on request. All DC will be held on Your account in a wallet controlled by Us. It is necessary for Us to have control over this wallet so We can ensure You are in a position to settle the exchanges You enter into.

DC in the their terms stands for "Digital Currency". 

This is also seen in the statement on their website:

> We use the battle-tested Trezor hardware wallets to store crypto in cold storage, along with Fireblocks’ MPC-CMP private key protection and Policy Engine, and Intel SGX hardware isolation. 

Like most lightning based Point-of-Sale systems, the user is a provided an account that is hosted by the provider. This makes it a **custodial service** and the app, **non-verifiable**.

---

## iPhone

{% include copyFromAndroid.html %}
