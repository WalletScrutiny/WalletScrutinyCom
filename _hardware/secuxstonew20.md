---
title: SecuX STONE W20
appId: secuxstonew20
authors:
- kiwilamb
- danny
released: 
discontinued: 
updated: 
version: 
binaries: 
dimensions:
- 59
- 89
- 13
weight: 62
provider: SecuX Technology Inc.
providerWebsite: https://secuxtech.com
website: https://shop.secuxtech.com/products/w20-hardware-wallet-for-computer-mobile-user/
shop: https://shop.secuxtech.com/products/w20-hardware-wallet-for-computer-mobile-user/
country: TW
price: 119USD
repository: https://github.com/secuxtech/SecuXMCU
issue: 
icon: secuxstonew20.png
bugbounty: 
meta: ok
verdict: nosource
appHashes: 
date: 2024-11-01
signer: 
twitter: SecuXwallet
social:
- https://www.linkedin.com/company/secuxtech
- https://www.facebook.com/secuxtech
features: 

---

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

## Updated Verdict 2022-11-24

Although the device has no claims that it is Open Source, its firmware's source is available and is still actively updated. 

Leo previously mentioned on [Issue 379](https://gitlab.com/walletscrutiny/walletScrutinyCom/-/issues/379) that: 

> I could not find anything on their use of the SE and neither could I find the SE firmware's source code. If the SE is solely responsible for the creation of entropy or the creation of the master key supposedly using entropy from the MCU without verification that MCU entropy was used, the SE firmware would be a potential attack vector that would be impossible to audit if closed source or public source without being reproducible.
Furthermore the firmware update does not detail the location where the MCU and SE firmware gets loaded from or how to verify their fingerprints.
> 
> Until these issues are resolved, we have to list this product (and probably all three of their products) as closed source.

Pending the response of SecuX tech, I think it's worth the benefit of the doubt to hear what they have to say. 

## Previous Verdict

The device can be paired with a mobile phone app via Bluetooth:

{% include walletLink.html wallet='android/com.secux.mobile' verdict='true' %}

## Private keys can be created offline - ✔️

From the [SecuX manual](https://secuxtech.com/secuxtech-download/User-Manual/SecuX-User-Manual-2020.pdf)

> 2. Device Initialization
When the device leaves the factory, there is no private key pre-set in the device. You will be asked to generate your own unique private key or restore an existing private key (using recovery words) during device initialization.

## Private keys are not shared - ✔️

The device has a tamper seal that changes its appearance when the device is first opened. Therefore, when the device is first initialized, the private keys that are generated never leave the device. 

> equipped with an Infineon SLE solid Flash CC EAL5+ Secure Element chip, which is used to securely store your unique PIN and Private Key. It enables zero transaction leakage and your transactions are verified without the private key ever leaving the device. The Infineon Secure Element Chip also comes with a security feature: self-destructive mechanism when exposed to light, in case someone wants to break into your wallet and steal the data inside.

From [Security FAQs](https://secuxtech.com/faq/).

## Device displays receive address for confirmation - ✔️

As shown on this [youtube screengrab](https://twitter.com/BitcoinWalletz/status/1466344015670898693) The display can adequately display the receiving address for confirmation.

## Interface

The SecuX Stone W20 has a 2.8 inch color touchscreen which is wide enough to display confirmation as well as other wallet interface necessities.

## Reproducibility

Secuxtech does not have any text on their page claiming that their hardware wallet is open source. However, they do have a repository named ['SecuX Device Firmware'](https://github.com/secuxtech/SecuXMCU).

It may be worth looking into.

