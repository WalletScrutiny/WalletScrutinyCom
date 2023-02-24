---
title: Keevo Carbon Key
appId: keevo.carbonkey
authors:
- danny
released: 2020-10-01
discontinued: 
updated: 
version: 
binaries: 
dimensions: 
- 23
- 58
- 11
weight: 30
provider: BitKey Technogies
providerWebsite: https://www.keevowallet.com
website: https://www.keevowallet.com/products/keevo-model-1
shop: https://www.keevowallet.com/products/keevo-model-1
country: US
price: 299USD
repository: 
issue: 
icon: keevo.carbonkey.png
bugbounty: 
meta: ok
verdict: nosource
date: 2023-02-24
signer: 
reviewArchive: 
twitter: keevowallet
social:
- https://www.facebook.com/keevowallet
---

## Product Description 

The Keevo Carbon Key is a part of the {% include walletLink.html wallet='hardware/keevo' verdict='true' %} hardware wallet 3-of-4 multifactor authentication system. 

Described by the manufacturer: 

> It is a piece of hardware separate from your Keevo device that is a secondary encrypted memory device. No keys are stored on the Carbon Key, just encrypted hashes of 3 key shares which require the users password and fingerprint to decrypt.

As a precautionary measure for the user, the {{ page.title }} can be sent to a custodial service, Iron Mountain. There, it will be kept in secure storage for a fee of $6 a month. 

> The Carbon Key is a separate backup device which has its own unique and randomly generated key along with a secure memory unit where Keevo also stores all of your other encrypted sub keys. All the electronic communication and information transferred between the Keevo Wallet and Keevo Carbon Key are transmitted through custom contacts and encrypted communication protocols.

More information [from the Keevo blog post](https://www.keevowallet.com/blogs/news/why-we-built-keevo-part-2-the-tech-behind-the-device):

## Analysis 

The {% include walletLink.html wallet='hardware/keevo' verdict='false' %} operates on 3-out-of-4 authentication: 

1. The Keevo device itself
2. Password
3. Thumbprint
4. Carbon Key

### Recovery in case the Keevo Hardware Wallet is Lost

> If your device breaks or is lost, you can use your Carbon Key to restore your coins on another Keevo device. We offer a Keevo Care service for this exact purpose where you can purchase another Keevo at a discounted price.
>
> Your Carbon Key is a separate piece of hardware that backs up your encrypted password and fingerprint, along with a 4th unique key share! It can then be securely stored at one of Iron Mountain's vaults or you can choose your own location. 
>
> If you would like, you always have the option to use your seed phrase to restore as well.

It is complicated to assign a verdict to this device as it is a part of the {% include walletLink.html wallet='hardware/keevo' verdict='true' %} wallet. 

But at the interim: 

- This device on its own cannot sign transactions
- Would need a primary {{ page.title }} device 

### Keevo Care 

Another question mark that arises is with the [Keevo Care](https://www.keevowallet.com/pages/services) service:

> Keevo Care
> - 1 Year Extended Warranty
> - Full coverage for your Keevo and Carbon Key™
> - Loss and Theft Protection
> - Get a replacement Keevo for only $119
>
> Secure Storage
> - Carbon Key™ storage in a secure Iron Mountain Vault
> - Encrypted data backup
> - Easy Carbon Key™ retrieval for backup, restoration, or updates
>
> Secure Storage and Beneficiary
> - Carbon Key™ storage in a secure Iron Mountain Vault
> - Encrypted data backup
> - Easy Carbon Key™ retrieval for backup, restoration, or updates
> - Secure and confidential transfer to a named beneficiary after death

If the funds/keys for a device can be transferred to a beneficiary without the active participation of the wallet owner, doesn't that make the whole system, a custodial affair? 

Nevertheless, our initial assessment stands: Keevo **does not provide the source code** for their device and software. 






