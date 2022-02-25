---
title: "Satodime"
appId: satodime
authors:
- danny
released: 2021-12-06
discontinued: # date
updated: 2022-02-17
version: 0.2.0
dimensions: [85.6, 1, 53.98]
weight: 5g
website: https://satodime.io/
shop: https://satochip.io/product/satodime-original/
company: Satochip SRL
companywebsite: https://satochip.io
country: BE
price: 25EUR
repository: https://github.com/Toporin/Satodime-Tool/releases
issue:
icon: satodime.png
bugbounty:
meta: ok
verdict: noita
date: 2022-02-22
signer:
reviewArchive:


providerTwitter: satochipwallet
providerLinkedIn: satochip
providerFacebook:
providerReddit: satochip
---


## Product Description

The Satodime is a bearer smartcard that can hold multiple cryptocurrencies as well as ERC20 tokens and NFTs. The card's secure element is an EAL6+ chip which stores the private keys. According to linked Medium article, it is meant as a [disposable hardware wallet](https://satochip.medium.com/satodime-why-and-how-to-use-your-bearer-crypto-card-490316180873) which allows users to transact hand-to-hand.

> With a Satodime card, you can physically transfer #Bitcoin, #Litecoin, #BitcoinCash, #Ethereum or any other #ERC20 tokens (including #NFTs) from one user to another (hand-to-hand), while still remaining secure, without the need to trust a third party.

This is how it deals with the private keys:

> "Private keys are strictly sealed within the secure chip."
>
> You don't know the keys until you redeem the key slot."

Apart from that, details of how the keys are handled are elaborated in the same Medium article.

> Private/public keypairs stored on the Satodime are always generated randomly inside the secure chip. As long as the keyslot is sealed, nobody has access to the private key. To prove that the private keys were not pre-generated during manufacturing and that no backdoor was inserted in the firmware, the user is prompted for a 64-hex random value during the sealing process. This random input is used to provide entropy during the key generation process. When the keyslot is unsealed and the private key is revealed, the entropy data (including user input) is provided and allows to ensure that the key generation process was indeed random.

A [Satodime Android app](https://github.com/Toporin/Satodime-Android/releases) is still in beta.

## Retrieving the Private key

> Retrieve the private key == UNSEAL
>
> If you want to retreive the private key of a specific keyslot, you can unseal the keyslot at anytime. This action is not reversible.
>
> Unsealing a keyslot will ask the secure chip to expose the private key.
>
> When a keyslot is unsealed, the private key is made available to the user and can be recovered by clicking on the ‘more details’ button of the corresponding slot.
>
> Once the private key is unsealed, it is no longer protected by the secure chip and any asset associated with the corresponding address should be transferred immediately to a new address. This is generally done by ‘sweeping’ the private key and many wallet provides this option (e.g. Electrum and Metamask).

*Note that this is all done via the [Satodime Tool](https://github.com/Toporin/Satodime-Tool/releases), a python based Windows/Linux program.

## Process

The Satodime needs a chip reader or an NFC enabled device. It would then need a Windows or Linux downloadable Python program called the [Satodime Tool(https://github.com/Toporin/Satodime-Tool/releases). The card itself does not have any form of display or interface such as a button.

The chip has three states:

- Sealed - a new vault has been created and the private key is not yet shown to anybody. This state allows the user to accept, share, buy and get the satodime.
- Unsealed - the private key has been revealed and entropy data provided
- Uninitialized - the key pair has not been generated yet or has been recently reset after a transaction

## Analysis

As a disposable hardware wallet that is designed to be passed hand-to-hand, its lack of a display and interface requires both parties in a transaction to have to install the Satodime Tool on either a Windows or a Linux machine. The Medium article linked here above, and on the satodime website, also details a sample transaction wherein a user buys a Tesla car:

> You want to buy the new Tesla using Bitcoin. You grab your Satodime, seal a new Bitcoin vault, write down the BTC address and load 1 BTC to it. Then, you go to the car dealer and begin negotiations. The dealer is asking for 1.25 BTC for this beautiful Ludicrous P100D. You accept the deal and send 0.25 more BTC to your Satodime vault using your favorite Bitcoin client. You grab your mobile phone, scan the Satodime using NFC and show the sealed vault to the car dealer. He can verify that the Bitcoin vault is sealed and full of 1.25 BTC. You shake hands and give him the card. You grab the car and leave the showroom peacefully and silently. SEAL — LOAD — VERIFY

Note that the Android app is still in beta here. Also, the buyer has to show **his** Android phone to verify with the seller that the BTC amount is in the satodime. Otherwise, the seller would also have to install the same Android app on his own phone, or on a desktop PC in order to verify. 
