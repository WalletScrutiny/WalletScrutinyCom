---
title: Offline.Cash (Bitcoin Note)
appId: offline.cash
authors:
- danny
released: 
discontinued: 
updated: 
version: 
binaries: 
dimensions: 
weight: 
provider: 
providerWebsite: 
website: https://offline.cash/
shop: 
country: US
price: 
repository: 
issue: 
icon: offline.cash.png
bugbounty: 
meta: ok
verdict: unreleased
date: 2022-11-17
signer: 
reviewArchive: 
twitter: offlinecashco
social: 
features: 

---

## [Product Description from the FAQ](https://offline.cash/pages/faq)

> We’ve combined currency-grade printing with secure NFC chips to create the easiest to use cold storage product.
> 
> The Bitcoin Note uses a multisig that combines a local encrypted key with a private key that you generate. The stored Bitcoin is only claimable when the holder cuts the note.
>
> If you receive a note that you want to keep in cold storage, you can re-key it from entropy you generate. After expiration only the locally stored user generated private key can access the funds.

### Multi-signature

> The Bitcoin is accessible through a multisig loaded by the first holder of the note. One key of the multisig, the “user key”, is generated by the first holder and stored in plaintext on the note. The second key, a “manufacturer key” is generated at the time of manufacture and stored, encrypted on the note.
>
> The multisig requires both keys to access funds until the “Claim Before” date printed on the note at which point in time the multisig downgrades so that only the user key can claim the funds. Under no circumstance can the manufacturer key claim funds alone.

### Claiming-funds

> Bitcoin can be claimed off of the Bitcoin Note under two conditions: the first is by cutting a trace on the Bitcoin note indicated by the words “Cut to Claim” and reporting that information to us via the open source Bitcoin Note app. At that point in time we will return the decryption key for the manufacturer key stored on the note such that a transaction can be created to claim funds. The second method to claim funds is to wait until the date printed on the front of the note after which the plaintext user key stored on the note can be used to claim funds.

### Components

> The Bitcoin Note consists of:
>
> - A denominated note that includes —
> - A durable synthetic paper substrate with high resolution offset printing, micro text features, intaglio and foiled elements.
> - A printed serial number and claim by date.
> - A NFC chip that —
> - Stores two Bitcoin private keys; a user key in plaintext and a manufacturer key, encrypted.
> - Includes a circuit trace on the NFC chip which, when cut, triggers an irreversible change in the NFC chip.
> - Stores encryption keys which are used in order to execute specific actions relative to the memory slots on the NFC chip.
> - A Bitcoin P2SH which —
> - Requires both keys on the note in order to spend associated funds before the claim by date.
> - Downgrades after the printed “claim by” date such that only the user key is required to claim funds.
> - A note server which —
> - Authenticates notes through encrypted sessions
> - Releases decryption keys for the factory key upon validation that the trace on the NFC chip has been cut
> - Signs Bitcoin block hashes and writes them to the note
> - Facilitates re-key procedures whereby the holder requests the creation of a new multisig with a new user key stored on the note.
> - An open source client app which —
> - Arbitrates messages between the note and the manufacturer server
> - Writes to and reads from memory slots on the note relating to the key material as well as with respect to the memory structure.
> - Audits messages between the note and the manufacturer server as well as the memory structure of the note with respect to a checksum.

## Verdict 

As of the review date, the product is still in "Reserve Now" mode. It has not yet been released. 