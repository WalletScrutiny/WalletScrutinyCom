---
title: "Cypherock X1"
appId: cypherockx1
authors:
- kiwilamb
- danny
released: 
discontinued: # date
updated:
version:
dimensions: 
weight: 5
website: https://www.cypherock.com/
shop: https://shop.cypherock.com/
company: Cypherock
companywebsite: https://cypherock.com/
country: IN
price: 99USD
repository: 
issue:
icon: cypherockx1.png
bugbounty:
verdict: nosource 
date: 2021-07-26
signer:
reviewArchive:


providerTwitter: CypherockWallet
providerLinkedIn: cypherockwallet
providerFacebook: cypherock
providerReddit: 
---


Cypherock was announced in a Bitcointalk ANN thread on February 14, 2020.

It's key innovation point is it makes use of keycards to "divide" the private keys through a process called "sharding". Each keycard has to be scanned or tapped individually on the cypherrock hardware wallet in order to restore a wallet. To protect the private key, the user then has the option to physically locate each "cyCard" in a different location. After tapping the cards, the users can then verify the words by typing on the interface of the device. The users are then prompted with the option to destroy the paper backup.
 
## Private keys can be created offline

> The Cypherock X1 uses 2 of 4 Shamir Secret Sharing (with the option to change the threshold in future) along with tamper-resistant hardware to secure the user’s private keys. Simply put, it is like Multi-sig but for the wallet recovery phrase.The seed phrase gets divided into 4 shards using the 2 of 4 SSS scheme and each of those shards gets stored in a unique cyCards. The cyCards can store upto 3 Wallets (read: Seed Phrase), each of which will be able to support multiple coins.

Source: [Bitcointalk ANN thread](https://bitcointalk.org/index.php?topic=5225800.0)

## Private keys are not shared 

> - The code for the X1 wallet **will** be open source
> - Each shard will be stored in a EAL6+ tamper resistant secure element chips. As comparison, an iPhone has the same level of security chip for securing fingerprints.
> - Nothing will be stored in the X1 Wallet on which the computation will be done.
> - Keys can be recovered by tapping any 2 out of the 4 cyCards on the X1 Wallet. Each cyCard can also be protected by a PIN just like any other hardware wallet. The recovered keys are stored in a volatile memory on the X1 Wallet which gets wiped out as soon as the operation is done.
> - The user can store 3 wallet recovery phrases in a single product.
> - The cyCards can be distributed around different places to increase security of the funds and protect against $5 wrench attacks.

From the [FAQ](https://www.cypherock.com/faq/): Can the company somehow steal the digital assets of the user?

> It is not possible for the company to steal the digital assets of the users. You can use Cypherock X1 without internet access. The device would need to be connected to an internet connected device just for broadcasting the transaction. The private keys need not ever come in contact with an internet connected device.

## Device displays receive address for confirmation
## Interface

The device has a screen and one circular button that allows users to select the letters. It is quite tedious as the single button is very limited in the number of letters it can select with one push of this button. This is evident in the [video shown here](https://youtu.be/eD3CZMPumCk?t=204).

## Reproducibility

In its [2020 Bitcointalk.org ANN post](https://bitcointalk.org/index.php?topic=5225800.0), Cypherock claims that the hardware wallet **will** be open source. It also makes this claim on [its website](https://twitter.com/BitcoinWalletz/status/1462700172719243266). The product is still in pre-order. We were able to locate Cypherock's Github page, but there was [no corresponding repository](https://twitter.com/BitcoinWalletz/status/1462694293085118466) specifically for its hardware wallet. 