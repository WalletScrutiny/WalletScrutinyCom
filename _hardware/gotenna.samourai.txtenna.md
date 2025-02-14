---
title: Gotenna Samourai TxTenna
appId: gotenna.samourai.txtenna
authors:
- danny
released: '2018-10-15'
discontinued: 
updated: '2019-05-05'
version: '0.95'
binaries: https://github.com/MuleTools/txTenna/releases
dimensions:
- 130
- 32
- 13
weight: 48.19
provider: goTenna and Samourai
providerWebsite: 
website: https://txtenna.com/
shop: https://gotennamesh.com/products/mesh
country: US
price: 199USD
repository: https://github.com/MuleTools/txTenna/releases
issue: 
icon: gotenna.samourai.txtenna.png
bugbounty: 
meta: ok
verdict: nowallet
appHashes: 
date: '2022-05-19'
signer: 
reviewArchive: 
twitter: goTenna
social: 
features: 

---

## Background Information

goTenna [partnered](https://bitcoinmagazine.com/technical/gotenna-and-samourai-wallets-new-mobile-app-works-without-internet-access) with {% include walletLink.html wallet='android/com.samourai.wallet' verdict='true' %} wallet to create offline and signed bitcoin transactions using a mesh network. The result is the {{ page.title }}. The TxTenna apk can be downloaded and installed on an Android device to be paired with a goTenna device. Users would have to buy a pair of goTenna devices. The two can communicate with each other provided these devices are within range. A farther range is only possible with the addition of devices to form a [mesh network](https://en.wikipedia.org/wiki/Mesh_networking).  

The app used to be available on [Google Play](https://play.google.com/store/apps/details?id=com.samourai.txtenna) but is now only available via [GitHub](https://github.com/MuleTools/txTenna/releases).

This is the description from their [homepage:](https://txtenna.com/)

> Without relying on cell service or an internet connection, goTenna Mesh generates a signal that connects with other units within range, effectively creating a people-powered, decentralized mesh network.
> 
> Powered by goTenna Mesh, TxTenna is an Android app that enables off-grid broadcasts of signed Bitcoin transactions from Samourai Wallet. TxTenna-python is a set of scripts run on an internet connected PC or single board computer to receive and settle transactions from the TxTenna app on the Bitcoin blockchain.

Offline transactions

> When goTenna Mesh pairs with your phone, Samourai Wallet will generate a prompt to use the TxTenna App to broadcast transactions over the goTenna Mesh network until it reaches an online TxTenna user, up to three hops away.
>
> An off-line Bitcoin full node connected to a Blockstream Blocksat receiver can broadcast signed transactions and relay API data over the goTenna Mesh network.
>
> Through an online TxTenna user, transactions are confirmed on the Bitcoin blockchain and a private confirmation message is relayed back to the original TxTenna user.

## Product Description 

goTenna Mesh [PDF Product Specifications](https://cdn.shopify.com/s/files/1/0445/5745/files/goTenna-Mesh_Specs_2019_04_15.pdf?2778)

The scheme only works if the right components are present. Without one or the other, it would be difficult to implement. 

1. A pair to goTenna devices (if possible connected to other goTenna devices)
2. The Txtenna app installed on a mobile phone 

A demonstration can be seen in [Youtube](https://www.youtube.com/watch?v=tjDLRWzYylY).

## Further Documentation

From [0.95 README.md](https://github.com/MuleTools/txTenna/archive/refs/tags/0.95.zip)

> # txTenna
>
> txTenna is a proof-of-concept Android app developed by [Samourai](https://samouraiwallet.com) as part of the Mule.Tools research and development initiative exploring alternative means of transaction broadcasting to enhance censorship resistance. 
>
> txTenna can:
>
> - be used for transmitting transactions to the bitcoin network via SMS. Send your own transactions by SMS using a known txTenna relay or allow your own contacts to use your mobile number as an SMS relay.
> - be used for transmitting transactions to the bitcoin network via the goTenna mesh network.
>
> [Pony Direct](https://github.com/MuleTools/PonyDirect) functionality has been rolled into txTenna which maintains backward compatibility for the Pony Direct SMS payload format.
>
> ## Get Started
> 
> ### Build:
>
> Import as Android Studio project. Should build "as is". PGP signed tagged releases correspond to builds that were released on GitHub. You will need to obtain a SDK developer token from [goTenna](https://www.gotenna.com/pages/sdk).
>
> ### APK:
>
> The latest version of the APK can be installed from the [Github Releases page](https://github.com/MuleTools/txTenna/releases)

## How to use

> #### Broadcast a transaction by SMS:
>
1. Launch txTenna and enter the mobile phone number of a known txTenna device in the toolbar settings. A known UK based txTenna relay (+447490741539) will be automatically entered. If adding a different mobile number make sure to use international format.
>
2. From the main screen either scan the QR code of a signed transaction or select 'SMS Broadcast' from FAB menu and paste the transaction in the popup. Confirm the relaying of the transaction when prompted. (You can create and display raw signed transactions with [Samourai Wallet](https://www.samouraiwallet.com))
>
3. The transaction hex will be automatically divided into segments and sent via multiple SMSs to the desired relay device. Please note, you will be charged at your normal rate for sending standard SMS messages. 

#### Relay transactions for your mobile contacts:
>
1. Launch txTenna and keep it open.
>
2. Incoming SMS using the payload format described below will be intercepted and parsed to reconstitute the signed hex transaction.
>
3. Upon validation of the transaction hash, the transaction will be broadcast via the Samourai node pushTx.

##### Common issues:

> - Sending device does not have sufficient SMS credit.
> - Receiving device switched OFF.
> - Sending to wrong network. Check MainNet/TestNet switch in settings.
> - The occasional dropped SMS. If you can identify which SMS was dropped you can re-send it and the receiving device will complete the slatted transaction and broadcast it.

#### Broadcast a transaction by goTenna:

> 1. Launch txTenna and keep it open
> 2. Make sure that GPS location is running on your Android device.
> 3. Make sure that your Android device has Bluetooth switched ON.
> 4. Go to the 'Networking" screen and make sure that your goTenna is paired to your Android device.
> 5. From the main screen either scan the QR code of a signed transaction or select 'GoTenna Mesh' from FAB menu and paste the transaction in the popup. Confirm the relaying of the transaction when prompted. (You can create and display raw signed transactions with [Samourai Wallet](https://www.samouraiwallet.com))
> 6. The transaction hex will be automatically divided into segments and sent via multiple SMSs to the desired relay device. Please note, you will be charged at your normal rate for sending standard SMS messages. 

#### Relay transactions for your goTenna contacts:

> 1. Launch txTenna and keep it open.
> 2. Incoming goTenna mesh network packets containing the payload format described below will be intercepted, parsed, and uploaded to the txTenna gateway.
> 3. When all of the segments for a single transaction have been collected by the gateway, the transaction will be broadcast via the Samourai node pushTx.

## Analysis 

The schema works as follows: 

- A wallet (app or hardware) signs a transaction 
- This signed transaction is then communicated to TxTenna
- Txtenna broadcasts this to the mesh network via the goTenna device 

A [step by step tutorial/demonstration](https://medium.com/hackernoon/completely-offline-bitcoin-transactions-4e58324637bd) was described by grubles in Hackernoon.

We believe that Txtenna is only an intermediary software that allows wallets to transmit data using the goTenna device. As described from Samourai's ['offline mode' page](https://docs.samourai.io/en/wallet/features/offline-mode): 

> TxTenna is an Android app that enables off-grid broadcasts of signed Bitcoin transactions from Samourai Wallet. TxTenna-python is a set of scripts run on an internet connected PC or single board computer to receive and settle transactions from the TxTenna app on the Bitcoin blockchain.

Therefore it is **not a wallet**.









