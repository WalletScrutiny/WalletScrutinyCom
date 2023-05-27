---
wsId: 
title: Monya - Monacoin & Altcoins Wa
altTitle: 
authors:
- danny
users: 5000
appId: org.missmonacoin.monya
appCountry: 
released: 2018-01-02
updated: 2021-12-14
version: 3.10.5
stars: 
ratings: 
reviews: 
size: 
website: https://monya-wallet.github.io
repository: https://github.com/monya-wallet/monya
issue: https://github.com/monya-wallet/monya/issues/130
icon: org.missmonacoin.monya.png
bugbounty: 
meta: stale
verdict: nonverifiable
date: 2022-12-17
signer: 
reviewArchive: 
twitter: monya_wallet
social: 
redirect_from: 
developerName: 藤原出帆
features: 

---

## App Description

> Crypto currency wallet that supports Monacoin, Bitcoin, Counterparty and many other currencies, and that satisfies both beginners and advanced users.
>
> Easy
> - This makes difficult crypto aspects easy.
> - You don't need email address or another private information.
>
> Multi currency
> - Bitcoin-based coins such as Bitcoin, Dash, Litecoin supported
> - Counterparty, Monaparty, Monacard are supported.
> - Not only XEM but also NEM Mosaic available
> - Ethereum , ERC 20 Tokens are also supported.
> - You can also send and receive XRP.
>- You can even add a new currency.
>
> Security conscious
> - Private key is stored in only your device. So it is much higher than online wallet.
> - Easy backup methods
> - BIP44 HD wallet
> - Complete open source

## The Site

Their site is a [Github hosted website](https://monya-wallet.github.io/).

## The App

We tried the app. Some portions of it were in Japanese, although you can choose to receive your mnemonics in English. After the user is provided with a passphrase, the app asks you to set a password. You can add several other cryptocurrencies including Bitcoin. It is possible to send and receive Bitcoin.

## Verdict

This app is self-custodial. However, upon attempting to verify this code, [we got the following:](https://github.com/monya-wallet/monya/issues/130)

> Building version 3.10.4 and comparing it to version from google-play, result in below diff:<br>
Command: `diff --recursive --brief ./monya_local_build_3.10.4_2/ ./monya-from-google-play`
>
> Result:
>

```
Files ./monya_local_build_3.10.4_2/AndroidManifest.xml and ./monya-from-google-play/AndroidManifest.xml differ
Files ./monya_local_build_3.10.4_2/assets/www/dist/0.dist.js and ./monya-from-google-play/assets/www/dist/0.dist.js differ
Files ./monya_local_build_3.10.4_2/assets/www/dist/dist.js and ./monya-from-google-play/assets/www/dist/dist.js differ
Only in ./monya-from-google-play/META-INF: GOOGPLAY.RSA
Only in ./monya-from-google-play/META-INF: GOOGPLAY.SF
Files ./monya_local_build_3.10.4_2/META-INF/MANIFEST.MF and ./monya-from-google-play/META-INF/MANIFEST.MF differ
Files ./monya_local_build_3.10.4_2/resources.arsc and ./monya-from-google-play/resources.arsc differ
```

This app is **unreproducible.**
