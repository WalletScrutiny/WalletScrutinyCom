---
title: 'Ajaib: Stock, Crypto, US Stock'
date: 2026-10-28
authors:
- leo
website: https://ajaib.co.id/
twitter: ajaib_investasi
android:
  appId: ajaib.co.id
  users: 10000000
  appCountry: us
  released: Feb 15, 2019
  updated: 2026-10-26
  version: 2.108.1
  reviews: 290
  icon: ajaib.co.id.webp
  meta: ok
  verdict: nosendreceive
  developerName: Ajaib Technologies
iphone:
  appId: id.ajaib.co
  idd: '1473916571'
  appCountry: id
  released: '2019-09-05T07:00:00Z'
  updated: 2026-10-26
  version: 2.109.1
  reviews: 27009
  icon: id.ajaib.co.webp
  meta: ok
  verdict: nosendreceive
  developerName: Ajaib Technologies Corporation

---

## App Description

Ajaib is an Indonesian investment app published by Ajaib Technologies for Indonesian stocks, mutual funds, bonds, US stocks and crypto assets. The Play Store description names "crypto like Bitcoin (BTC)" among the assets and says the crypto service is provided by "PT Kagum Teknologi Indonesia, terdaftar dan diawasi oleh OJK, untuk layanan Aset Kripto" ("registered with and supervised by OJK, for crypto asset services"). Ajaib's crypto page says Ajaib uses a "custodian wallet". The same company publishes a separate crypto app, {% include walletLink.html wallet='android/coin.ajaib.co.id' verdict='true' %}.

## Analysis

- **Bitcoin support.** The Play Store description lists "blue-chip stocks & crypto like Bitcoin (BTC)". The Ajaib help centre says crypto bought in this app appears under "Portofolio > Aset Kripto" ([source](https://ajaib.co.id/pusat-bantuan/aset-kripto/bagaimana-cara-melihat-aset-kripto)).
- **Custody.** Ajaib's [crypto page](https://ajaib.co.id/kripto) answers the question "Apakah Ajaib menyediakan dompet kripto pribadi?" ("Does Ajaib provide a personal crypto wallet?") with: "Ajaib memakai sistem custodian wallet, jadi kamu nggak perlu pegang atau mengatur private key sendiri" ("Ajaib uses a custodian wallet system, so you don't need to hold or manage a private key yourself").
- **Sending and receiving BTC.** We found no documentation that BTC can be deposited to or withdrawn from this app. The help centre's crypto section tells users to fund crypto purchases in rupiah: "kamu bisa segera memulai investasi dengan mendeposit dana ke Rekening Ajaib Alpha (IDR)" ("you can start investing right away by depositing funds into the Ajaib Alpha Account (IDR)") ([source](https://ajaib.co.id/pusat-bantuan/aset-kripto/bagaimana-memulai-investasi-aset-kripto)). The crypto page describes cashing out as selling: "Setelah kamu menjual aset kripto, hasilnya akan masuk ke Rekening Ajaib Alpha dan bisa ditarik ke rekening bank kamu" ("After you sell crypto assets, the proceeds go to the Ajaib Alpha Account and can be withdrawn to your bank account"). Ajaib's [send and receive article](https://ajaib.co.id/belajar/investasi/kirim-dan-terima-aset-kripto) does describe BTC deposits ("Deposit Aset") and withdrawals ("Tarik Aset"), but every step says "Buka aplikasi Ajaib Kripto" ("Open the Ajaib Kripto app") and it states that only "aset yang ada di aplikasi Ajaib Kripto" ("assets in the Ajaib Kripto app") can be sent or received. That describes the separate Ajaib Kripto app, not this one.

The provider holds the keys, and the sources we read document BTC transfers only for the separate Ajaib Kripto app, while this app is funded and cashed out in rupiah. Until we can confirm on-chain BTC deposits and withdrawals in this app, we file it as {% include verdictBadge.html verdict="nosendreceive" type='short' %}. Either way it is custodial.

## iPhone

The provider's website links to the iOS app. It gives access to the same account and service, so the same verdict applies to it.

**Can't send or receive bitcoins**
