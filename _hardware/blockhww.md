---
title: Bitkey
appId: blockhww
authors:
- danny
released: '2024-03-14'
discontinued: 
updated: '2024-03-14'
version: '2024.50.0'
binaries: https://github.com/proto-at-block/bitkey/
dimensions:
- 56
- 62
- 13
weight: 65
provider: Block
providerWebsite: https://block.xyz/
website: https://bitkey.world
shop: https://bitkey.world/en-US/products/bitkey
country: US
price: 150USD
repository: https://github.com/proto-at-block/bitkey
issue: 
icon: blockhww.png
bugbounty: >-
  https://support.bitkey.world/hc/en-us/articles/19812055576852-How-do-I-report-potential-security-issues
meta: ok
verdict: noita
appHashes: 
date: '2024-03-14'
signer: 
reviewArchive: 
twitter: Bitkeyofficial
social:
- https://www.linkedin.com/company/bitkey-official
- https://www.facebook.com/profile.php?id=100088526238789
- https://www.instagram.com/ownbitkey
features:
- multiSignature

---

**Disclaimer**: The WalletScrutiny project is sponsored by Spiral, a subsidiary of Block.

<iframe width="560" height="315" src="https://www.youtube.com/embed/pZ-Yi7A-o_A?si=cP6zKgW7r-JosAb-" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>

This product has a companion app: {% include walletLink.html wallet='android/world.bitkey.app' verdict='true' %}.   

## Update, 2024-03-04: The Bitkey Hardware Wallet is now officially released

## Description 

The Bitkey hardware device is made from [corian and stainless steel](https://bitkey.world/en-US/products/bitkey). Its security features include key handling, biometric authentication, 2 of 3 multisignature transactions, cloud backups and social recovery mechanisms. 

Owners of the Bitkey can invite trusted contacts to assist in the recovery of their keys in the event of phone and device loss. Rather than using the seed phrase recovery model by itself, Bitkey utilizes social recovery. NFC technology is meant to ensure that transaction authentication would always involve the presence of two devices, or two private keys. The third key is [held by Square](https://bitkey.world/en-US/how-it-works) in their servers.

### BitKey's approach to self-custody

Users can also set spending thresholds. [Spending more than the threshold would need another key.](https://bitkey.build/our-approach-to-self-custody/)

> We’ll require two of those three keys to authorize any transaction; importantly, we’ll only use Square’s key to authorize transactions requested by the customer if either their hardware wallet is used or if the transaction amount is below a customer-configured spending limit. This will mean more capability in one wallet

## Analysis 

### Setup

- Download the Bitkey app.
- Open the app and choose "Set up new wallet."
- Pair the hardware device with the app using NFC (no initial charging required).
- If NFC issues arise, ensure NFC is enabled on the phone.
- Enroll the user's fingerprint following the app's prompts.
- Complete cloud backup for iOS with iCloud or for Android with Google account.
- Establish recovery contact methods, with email as a mandatory channel.
- Customize transaction and product update notifications.
- Agree to the terms of service.

### Multisignature

- There are three keys involved: one in the hardware wallet, one in the mobile app, and one in Square's servers.
- Square provides the security for the server-held key.
- Transaction authorization requires two out of three keys.
- Square’s key is used only when:
    - The customer requests a transaction and uses their hardware wallet, or
    - The transaction is below a set spending limit configured by the customer.

### Recovery Options

Here are the available recovery options [offered by Bitkey.](https://support.bitkey.world/hc/en-us/articles/18801968949652-What-recovery-methods-are-available  )

>  - [Cloud recovery](https://support.bitkey.world/hc/en-us/articles/18842210239764): Lost/Replaced phone with cloud backup available
>
>  - [Delay + Notify](https://support.bitkey.world/hc/en-us/articles/18842292452500):
>
> - - Lost/Replaced phone without cloud backup available
>
> - - Lost/Replaced hardware device with/without cloud backup available
>
>  - [Cloud Health Check](https://support.bitkey.world/hc/en-us/articles/24491938926484): Lost/Replaced Cloud account
>
>  - [Trusted Contacts:](https://support.bitkey.world/hc/en-us/articles/24395098961940) Lost/Replaced BOTH hardware device and phone, near the same time
>
>  - [Emergency Access Kit](https://support.bitkey.world/hc/en-us/articles/24395170222868): Bitkey app unavailable in app store(s)


### Fingerprint Scanner

- The [fingerprint scanner](https://support.bitkey.world/hc/en-us/articles/18801888284692-How-do-I-enroll-my-fingerprint) is used to unlock the device and sign transactions.

## Verdict

Bitkey innovates with a combination of social recovery, biometrics, NFC and multisignature technology. From a strict security standpoint however, we cannot ignore the fact that the device does not have a display for users to verify outgoing transactions. It acknowledges this [here](https://bitkey.build/our-approach-to-self-custody/): 

> Storing bitcoin shouldn't require buying a second phone, or anything close to that. We want customers to be able to use the computer they already take everywhere,(...) From a hardware perspective, we think that means leaving out whatever we can -- starting with a display. Before we make that decision, though, we'll be reaching out to security experts across the community to make sure this is the right tradeoff for our customers.

Absent a button and a screen, the device would be engaging in blind-signing. Users would be trusting the mobile device, and the app that is preparing the transaction. Attackers who have access to manipulating the software can just as easily alter details such as the address where the bitcoin would be sent. 

For this reason, we give the device a verdict of having a **bad interface**.
