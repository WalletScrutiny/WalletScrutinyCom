---
title: BC Vault One
appId: bcvaultone
authors:
- kiwilamb
- danny
released: 
discontinued: 
updated: 
version: 
binaries: 
dimensions:
- 57
- 100
- 10
weight: 41
provider: REAL SECURITY D.O.O..
providerWebsite: https://www.real-sec.com/
website: https://bc-vault.com/
shop: https://bc-vault.com/shop/
country: SI
price: 132EUR
repository: 
issue: 
icon: bcvaultone.png
bugbounty: 
meta: ok
verdict: nosource
date: 2021-12-10
signer: 
reviewArchive: 
twitter: bc_vault
social:
- https://www.linkedin.com/company/bcvault
- https://www.facebook.com/bcvault

---

## Private keys can be created offline 

Yes. BC Vault uses "**nondeterministric wallets**". This is a [short snippet](https://bc-vault.com/2020/04/a-deep-dive-into-the-bc-vault-security-model/) of BC Vault's security overview. It does not use seed phrases.

> To ensure the generation of truly random numbers BC Vault uses input from the built-in hardware gyro sensor and various timings. BC Vault solves the problem of random number generation using a truly random number source: the human shaking the device in a unique way. Each wallet generated on the BC Vault is totally unique and not linked to any other wallet on the same or any other device. This is called a nondeterministic wallet.
>
> This is important, because even if you are completely compromised, with passwords, pins, and your device or backup in the possession of an attacker, all your future wallets on the same device will not be affected. The attacker would have to get the backup again every single time you create a new wallet (if you don’t use wallet passwords or pins, in which case the attacker would also need that!).
>
> Some other crypto wallets do not use this approach but use BIP39/44 deterministic wallets. The crucial difference is that wallet/private key entropy is only calculated once for all wallets past, present or future. This allows users a convenient backup system using 24, 12 or 8 words to encode all private keys. One serious drawback of this approach, and why we decided against it is that the attacker only needs these 24 words for total control of your wallets past, present and future.

## Private keys are not shared 

From the main page of BC Vault:

> Private keys are stored encrypted in a state of the art storage medium called FRAM that has full data retention for over 200 years (at +35°C) and is not affected by magnetic fields.

The raw private keys can be shared with the owner in its raw hexadecimal form but only upon downloading version 1.3.2 of the firmware. It's worth noting that this is [not an intended feature of the device and was only allowed due to user demand](https://support.bc-vault.com/support/solutions/articles/43000543089-can-i-reveal-raw-private-keys-of-a-wallet-on-bc-vault-). 

## Backups

Backups can be performed using a MicroSD card or by [printing a paper QR code backup](https://bcvault.freshdesk.com/support/solutions/articles/43000079901-how-do-i-backup-my-data-). 

They [did mention potential downsides](https://bcvault.freshdesk.com/support/solutions/articles/43000079935-how-can-someone-hack-my-bc-vault-how-safe-are-my-crypto-wallets-) to printing the QR code on a piece of paper.

## Device displays receive address for confirmation

The BC Vault can display the public address both on the PC and on the device. This can be seen in this [demonstration video.](https://youtu.be/eML_4ePDn5o?t=106) The confirmation of transaction details are possible via the large display the device provides. 

## Interface

From their [homepage](https://bc-vault.com/)

> Each initiated transaction from the desktop application has to be approved on the device itself. All transaction details can be seen clearly on the OLED for confirmation.

## Reproducibility

The hardware wallet is closed source and only has 2 repositories **bc-js** - a Javascript API for integrating BC-Vault, and **bc-vault-wallet-provider** - A wallet provider for web3-provider-engine, on its [GitHub page](A wallet provider for web3-provider-engine).
