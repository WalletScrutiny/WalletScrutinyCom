---
title: UKISS Hugware®
appId: ukiss.hugware
authors:
- danny
released: 2022-06-20
discontinued: 
updated: 
version: 
binaries: 
dimensions: 
weight: 
provider: UKISS Technology
providerWebsite: 
website: https://www.ukiss.io/
shop: https://www.ukiss.io/product/hugware-set-key/
country: SG
price: 139USD
repository: 
issue: 
icon: ukiss.hugware.png
bugbounty: 
meta: ok
verdict: noita
date: 2022-11-09
signer: 
reviewArchive: 
twitter: UKISSTech
social:
- https://www.linkedin.com/company/ukiss-tech/
- https://www.facebook.com/UKISSTech
- https://www.youtube.com/UKISSTechnology
- https://medium.com/ukisstech
- https://t.me/UKISSTech
- https://www.tiktok.com/@ukisstech
- https://www.instagram.com/ukisstech/

---

## Updated Analysis 2022-11-09

The {{page.title}} is unique in its security implementation. Most of the mainstream devices are stand-alone or paired with a mobile phone. 

<iframe width="560" height="315" src="https://www.youtube.com/embed/4-OMRrQ2pkY" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>


The two devices: 

- Have no interface
- Have to be connected to a desktop computer with the UKiss Hub Software installed (currently at v.1.1.3) or the UKiss app when connected to a mobile phone.
- [Require user registration](www.ukiss.io/my-account/.) to activate 5-year warranty
- Does not use recovery phrases

> Hugware comes in a pair. During setup, the master seed is generated in the Authentication Key (A-Key) and synchronised with the Rescue Key (R-Key). Use the A-Key to manage your crypto assets and keep your R-Key for when you need to recover access in the future. 
>
> Our state-of-the-art key pairing feature lets users do away with recovery phrases, thereby minimising instances of human error, phishing, and theft. However, it is your responsibility to ensure the security of your Hugware. Store your devices in a safe location and guard your authentication with a strong PIN.

| KEY FUNCTIONS         |                    |            |
|-----------------------|--------------------|------------|
|                       | Authentication-Key | Rescue-Key |
| Add wallet            | ✅                  | ✘          |
| Import wallet         | ✅                  | ✅          |
| Create account        | ✅                  | ✘          |
| Remove account/wallet | ✅                  | ✘          |
| Add asset             | ✅                  | ✘          |
| Add token             | ✅                  | ✘          |
| Move asset            | ✅                  | ✘          |
| Send asset            | ✅                  | ✅          |
| Add contact           | ✅                  | ✅          |
| Reset PIN             | ✅                  | ✅          |
| Recover key           | ✅                  | ✅          |
| Duplicate keys        | ✅                  | ✅          |

### Setup 

<iframe width="560" height="315" src="https://www.youtube.com/embed/MFZrnEa9Eos" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

### Notes

If the user loses the A-key device (Authentication) which contains the master key, the user can request the manufacturer to send a replacement. Once the replacement arrives, the A-key and the R-key are then synchronized. 

The desktop software and firmware are both not source-available.

## Verdict 

Both the A-key and the R-key **do not have a display or an interface** the user can interact with. Both devices are intended to be plugged in via USB-A or USB-C.


## Documentation

[User guide](https://www.ukiss.io/userguide/)

## Product Description 

The UKISS Hugware® is comprised of a pair of USB devices, the A-Key and the R-Key. The A-Key or the Authentication Key, [generates](https://youtu.be/dIAsYM53vVY?t=19) and stores private keys and authenticates transactions. The R-Key or the Rescue Key, resets passwords and restores the A-Key. UKISS is also slated to release the UKISS Suite which will add some features to the Hugware®: 

- Crypto swaps 
- Liquidity mining
- NFT trading
- Staking
- Yield farming 

Integrated Digital Security Solutions

- Data encryption
- Password management
- Ransomware protection
- Secure social messaging

UKISS also makes the claim that the recovery words are [deliberately eliminated](https://youtu.be/NRT8Eg5-TkI?t=117) from use in the device. We asked them on [Twitter](https://twitter.com/BitcoinWalletz/status/1503630819726073859) if it was possible if they can share the product specification sheet and whether the project is Open Source.

As of today March 15, 2022, the UKISS hugware is still in the middle of its soft launch. The site still asks for an email address for **Pre-Order discounts and promos**. Documentation, tutorials and other technical information such as private key generation are still not readily available online.  