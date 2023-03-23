---
title: Opolo Cosmos Recovery Card
appId: opolocosmos.card
authors:
- danny
released: 2020-10-01
discontinued: 
updated: 
version: 
binaries: 
dimensions: 
weight: 
provider: OPOLO Limited
providerWebsite: https://www.opolo.io
website: https://www.opolo.io/
shop: https://shop.opolo.io/products/opolo-shard-backup-card-with-protection
country: LU
price: 20 EUR
repository: 
issue: 
icon: opolocosmos.card.png
bugbounty: 
meta: ok
verdict: plainkey
date: 2023-02-28
signer: 
reviewArchive: 
twitter: opolowallet
social: 
---

## Updated Review 2023-03-23

Opolo's twitter account responded: 

<blockquote class="twitter-tweet"><p lang="en" dir="ltr">The mnemonics seed is stored on the secure card which is protected by the password (upto 128 characters long). To read more about protections please check out our kickstarter page <a href="https://t.co/qevRseey53">https://t.co/qevRseey53</a></p>&mdash; OPOLO Hardware Wallet (www.OPOLO.io) (@OpoloWallet) <a href="https://twitter.com/OpoloWallet/status/1638129725284524033?ref_src=twsrc%5Etfw">March 21, 2023</a></blockquote> <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>

> The mnemonics seed is stored on the secure card which is protected by the password (upto 128 characters long). To read more about protections please check out our kickstarter page

## Previous Review 2023-02-28

### Product Description 

The card is a backup mechanism for the {% include walletLink.html wallet='hardware/opolocosmos' verdict='true' %}

### [Procedure](https://www.opolo.io/wiki/doku.php?id=wallet-mangement:restore-opolo-wallet-with-card)

> ### OPOLO Cosmos Restore Wallet with OPOLO Card
> To perform this action, the device must not have any wallet setup. If there is a wallet already on the device, then this restore will not work unless that wallet has not been deleted.
>
> 1. Connect the OPOLO Cosmos to OPOLO Desk if not connected!
> 2. Go to the settings page on OPOLO Desk
> 3. Under the section “Hardware Wallet,” press the button “Restore Device.”
> 4. You can recover using OPOLO Card or by manually entering the mnemonics on the device.
> 5. Select “Recovery using OPOLO Card” and press “Continue.”
> 6. Follow the instructions on the device, you need to place the OPOLO Card on the backside of the device so the mnemonics could be read from the card. You may need to retry multiple times and place the card aligned to the device so the device can read the mnemonics.
> 7. On successful card read, you will see the wallet is loaded on the device, and you will be able to perform actions on this wallet. 

<iframe width="560" height="315" src="https://www.youtube.com/embed/cuXe4dCNrfA" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>

## Contact 

We contacted @opolowallet on twitter to [query](https://twitter.com/BitcoinWalletz/status/1630508588555968513) them about how their card works.

## Analysis 

This is primarily a backup card that incorporates the use of the sharding of the private keys. It cannot function without the {% include walletLink.html wallet='hardware/opolocosmos' verdict='false' %}

According to the WalletScrutiny methodology: 

> *"We only consider a hardware wallet if **dedicated hardware** protects the private keys in a way that leaves the user in **full and exclusive control** of what transactions he signs or not." 

Absent the Cosmos hardware wallet, the backup card cannot be utilized. However, it is very similar to a paper wallet in that the mnemonic phrase is stored on the NFC card. It is not clear if the mnemonic phrase is encrypted or how exactly the sharding is performed. 

The documentation merely details the [backup procedures](https://www.opolo.io/wiki/doku.php?id=get-started:create-wallet&s[]=backup).

### Backup Procedures

> Now you will be able to see the instructions on the OPOLO Cosmos hardware wallet.
>
> **First**, you will see the 24 words BIP39 mnemonics. You must write them down on paper, and make multiple copies. Or if you have a crypto steel, note it down on there. This is very critical, if you lose this backup, you may lose all your funds. So make multiple copies of written mnemonics and put them in a secure place. You must must must take 3-4 backups on paper or steel.
>
> **Now** if you continue on the device, you will be asked to take a backup on OPOLO Card. This is an optional step, but this makes life easier when you need to restore the OPOLO wallet. But this shouldn't be the only backup you have. You must keep your paper or steel backups in case of Card failure.
>
> **Place** the OPOLO card under the device (on the backside) and press “Next”, on a successful backup, you will see a message with success. If you get a failure, readjust the position of OPOLO Card on the backside of the device and press “Retry.” When you successfully save the mnemonics on the card, please carefully store it in a very secure location. Someone who gets the card can restore the wallet. Please consider it as a paper, with mnemonics written on it.

The last phrase is very telling - *"someone who gets the card can restore the wallet. Please consider it as a paper, with mnemonics written on it."* 

In conclusion: 

1. The private keys are created on another device {% include walletLink.html wallet='hardware/opolocosmos' verdict='false' %}

2. The private keys are shared with the other device.

3. There is no interface on the card itself

Thus, the conclusion closest to our verdict is that it shares private key material. 





