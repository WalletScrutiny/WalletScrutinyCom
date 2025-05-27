---
title: SecuX STONE W10
appId: secuxstonew10
authors:
- kiwilamb
- danny
released: 2020-09-23
discontinued: 
updated: 
version: 
binaries: 
dimensions:
- 59
- 89
- 13
weight: 49
provider: SecuX Technology Inc.
providerWebsite: https://secuxtech.com
website: https://shop.secuxtech.com/products/w10-hardware-wallet-for-computer/
shop: https://shop.secuxtech.com/products/w10-hardware-wallet-for-computer/
country: TW
price: 69USD
repository: 
issue: 
icon: secuxstonew10.png
bugbounty: 
meta: ok
verdict: nosource
appHashes: 
date: 2022-11-24
signer: 
twitter: SecuXwallet
social:
- https://www.linkedin.com/company/secuxtech
- https://www.facebook.com/secuxtech
features: 

---

## Product Description

- Infineon Secure Element chip
- Tamper-proof sealing labels
- Support 1000+ coins, tokens and NFT (ERC-721 & ERC-1155)
- 2.8 inch color touchscreen
- Supports multiple OS on computer
- Micro-B USB connection
- Compatible recoverability with BIP32, 39, 44, 49 standards

### [Setup Instructions](https://secuxtech.com/howitworks/device-setup_step_w10-new/)

- [The private keys can be created offline.](https://secuxtech.com/howitworks/device-setup_step_w10-new/) 
- The device can connect to a web portal called [SecuXess](https://wallet.secuxtech.com/secuxess/#/) via USB  or Bluetooth (through a PC). 
- More information about [SecuXess](https://secuxtech.com/howitworks/web/).
- The portal can be used to "Add Accounts, Send and Receive".

## Updated Review 2024-11-01

They have replied through an email dated 2022-12-05: 

1. Is your product open source? or merely source-available?

    > Our products are currently open-source for some codes. We are planning to make our product firmware more open-sourced in Q1/2023.
    > However some source codes are highly related security designs which will still be closed source to ensure our products from potential risk and been hacked.

2. Is the SE solely responsible for the creation of entropy or the creation of the master key?

    > SE is used to create the master (private) key and store it in SE with a high degree of security, even without leaving SE when signing transactions.

3. Where do the firmware updates come from?

    > Our product firmware is developed and maintained by our technical development team for adding new features, improving performance and fixing bugs.

4. Where do the MCU and SE firmware get loaded from?

    > SecuX has hosted a firmware update server and only the authorized SecuX products can access SecuX firmware update service.

5. Is there a way to verify their fingerprints?

    > There is a secure mechanism between firmware and device, which will verify the authenticity of the firmware by its signature and hash value of the loaded firmware.

The partial availability of some elements of their code, means that this device will get a verdict of **no source-availability**. As mentioned in (2), the sole source of entropy is in the closed source SE, making it trivial to hide a backdoor using weak entropy.

## Previous Review 2022-11-24

## Are the private keys shared with another device? 

It is possible. Part of the function of the web portal, which the user connects to via a PC, is to send and receive coins. 

These are the instructions for sending coins ([User Manual](https://fcc.report/FCC-ID/2ASNW-SX001/4230687.pdf)):

> To send crypto assets, follow these 4 steps to secure a safe transaction.
> 
> Step1: Edit transaction details
> 
> - Select a crypto asset from Select Crypto Asset menu
> -  Select an account
> - Enter transaction details (Recipient address, Asset amount, Network fee preference)
> - Click Continue
>
> Step 2: Verify the transaction details.
>
> After clicking Continue, the transaction details will be also shown on the device for your
verification.
>
> Step 3: Confirm the transaction
>
> Compare the transaction details displayed on the host's SecuXcess APP screen and the device's LCD display. If it matches, click "Confirm". If not, please stop trading immediately because the host may be hacked. 

## Does the device display the receive address for confirmation?

Yes.

## Interface

Has its own touchscreen display.

## Is the firmware reproducible? 

There are no claims that the firmware is source-available and no claims that the project is Open Source. However, they do have the repository for the [firmware](https://github.com/secuxtech/SecuXMCU) available.

Leo previously mentioned on [Issue 379](https://gitlab.com/walletscrutiny/walletScrutinyCom/-/issues/379) that: 

> I could not find anything on their use of the SE and neither could I find the SE firmware's source code. If the SE is solely responsible for the creation of entropy or the creation of the master key supposedly using entropy from the MCU without verification that MCU entropy was used, the SE firmware would be a potential attack vector that would be impossible to audit if closed source or public source without being reproducible.
Furthermore the firmware update does not detail the location where the MCU and SE firmware gets loaded from or how to verify their fingerprints.
> 
> Until these issues are resolved, we have to list this product (and probably all three of their products) as closed source.

Pending the response of SecuX tech, I think it's worth the benefit of the doubt to hear what they have to say.
