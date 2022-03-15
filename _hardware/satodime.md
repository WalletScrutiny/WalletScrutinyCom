---
title: "Satodime"
appId: satodime
authors:
- danny
- leo
released: 2021-12-06
discontinued: 
updated: 2022-02-17
version: "0.2.0"
binaries: 
dimensions: [85.6, 1, 53.98]
weight: 5
provider: "Satochip SRL"
providerWebsite: https://satochip.io
website: https://satodime.io/
shop: https://satochip.io/product/satodime-original/
country: BE
price: 25EUR
repository: https://github.com/Toporin/Satodime-Tool
issue: 
icon: satodime.png
bugbounty: 
meta: ok
verdict: plainkey
date: 2022-03-08
signer: 
reviewArchive: 
twitter: satochipwallet
social: 
  - https://www.linkedin.com/company/satochip
  - https://www.reddit.com/r/satochip
  - https://www.youtube.com/channel/UCPmmfB5PpuwMtha9mbaRNlg
  - https://t.me/Satochip
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

*Note that this is all done via the [Satodime Tool](https://github.com/Toporin/Satodime-Tool/releases), a python based Windows/Linux program.*

## Process

The card is read with "Satodime Tool" on a device with a card reader or NFC. The card itself does not have any form of display or interface such as a button.

The chip has three states:

- Sealed - a new vault has been created and the private key is not yet shown to anybody. This state allows the user to accept, share, buy and get the satodime.
- Unsealed - the private key has been revealed and entropy data provided
- Uninitialized - the key pair has not been generated yet or has been recently reset after a transaction

## Analysis

This is a physical bearer token. Its lack of a display requires both
parties to a transaction to install the "Satodime Tool" on either a Windows or a
Linux machine. The Medium article linked above and on the Satodime website also
details a sample transaction wherein a user buys a Tesla car:

> You want to buy the new Tesla using Bitcoin. You grab your Satodime, seal a new Bitcoin vault, write down the BTC address and load 1 BTC to it. Then, you go to the car dealer and begin negotiations. The dealer is asking for 1.25 BTC for this beautiful Ludicrous P100D. You accept the deal and send 0.25 more BTC to your Satodime vault using your favorite Bitcoin client. You grab your mobile phone, scan the Satodime using NFC and show the sealed vault to the car dealer. He can verify that the Bitcoin vault is sealed and full of 1.25 BTC. You shake hands and give him the card. You grab the car and leave the showroom peacefully and silently. SEAL — LOAD — VERIFY

The name and feature set suggests a relation to CoinKite's
{% include walletLink.html wallet='hardware/opendime' verdict='true' %}. It's
basically an electronic version of it, with mostly the same features, including
the assurance to have externally provided entropy being used in the key
generation and the issue with not having a backup but the advantage of the
device being re-usable with new keys. If the user fails to unseal the key slot
though, the coins stored on the device are lost.

The recipient of a Satodime has to install the companion app in order to verify
and claim the received funds.

Just like the Opendime, Satodime lets the companion app know the key when
unsealed. This defeats the purpose of a hardware wallet.
