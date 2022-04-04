---
title: Sallet One
appId: sallet.one
authors:
- danny
- leo
released: 
discontinued: 
updated: 
version: 
binaries: 
dimensions:
- 120
- 66
- 9.7
weight: 138
provider: Sallet One
providerWebsite: 
website: https://salletone.com/
shop: https://salletone.com/?r=front/product&S_ID=20210520114827&ID=994
country: CN
price: 100USD
repository: https://github.com/SalletOne/sallet-one-cold
issue: https://github.com/SalletOne/sallet-one-cold/issues/1
icon: sallet.one.png
bugbounty: 
meta: ok
verdict: nonverifiable
date: 2022-03-15
signer: 
reviewArchive: 
twitter: SalletOne
social:
- https://www.facebook.com/salletone
- https://www.youtube.com/channel/UCBAbHtt_Uk47csOqMC94dEQ
- https://medium.com/@Sallet_Atelas

---

This hardware wallet requires a companion app: {% include walletLink.html wallet='android/com.yaolian.qoline' verdict='true' %} downloadable via Google Play or the Apple store.

The [user manual](https://salletone.com/?r=front/news&S_ID=20210427140342) describes the procedure once a user unboxes his Sallet One device.

1. Password setting
2. Mnemonic phrase generation
3. Confirmation of mnemonic backup
4. Mnemonic words import
5. Password
6. Home page is the wallet address
7. QR code for receiving
8. The device can generate any number of addresses for multiple currencies
9. The device can scan the QR code from the app
10. The transaction details are confirmed and confirmed through the device itself.

## Private keys can be created offline - ✔️

From the [Terms of Use](https://salletone.com/?r=front/showcontent&S_ID=20210508101749)

> "Cold wallet" refers to a wallet product that stores private keys of digital assets and never connects to the Internet. Sallet one cold wallet is a hardware wallet, which is used to generate mnemonic words randomly, and private keys of different currencies are generated from the mnemonic words. In the end, the private key generates the public key, and finally the public key generates the asset address to realize the safe storage of digital assets.


## Private keys are not shared - ✔️

From the [SalletOne User Service Protocol](https://salletone.com/?r=front/showcontent&S_ID=20210526160843)

> Article 31 The Users shall be responsible for the proper safekeeping of their mobile devices, as well as their information such as Wallet passwords, private keys, mnemonics and Keystore. The Company is not responsible for the safe-keeping of such devices or information of the Users. All risks, responsibilities, losses and expenses caused by the Users’ loss of their mobile devices, their active or passive disclosure or forgetting of their Wallet passwords, private keys, mnemonic words, Keystore, or attacks or fraud by others shall be borne exclusively by the Users.

## Device displays receive address for confirmation - ✔️

Yes. This is documented in the [user manual](https://salletone.com/?r=front/news&S_ID=20210427140342).

## Interface - ✔️

The 4 inch display touchscreen makes it convenient to use the device. Device communication with companion app is through QR code.

## Code and Reproducibility

We were able to locate Sallet One's GitHub repository but it lacks build
instructions. Together with the lack of actual product pictures or videos, the
code being only two commits, the companion apps not having many users/ratings
and the rather lacking documentation we have little hope for this product to be
very interesting but for now simply consider it as **not verifiable**.
