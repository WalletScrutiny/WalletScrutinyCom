---
title: MIRkey
appId: mirkey
authors:
- kiwilamb
- danny
released: 
discontinued: 
updated: 
version: 
binaries: 
dimensions:
- 19
- 45
- 10
weight: 7
provider: Elliptic Secure
providerWebsite: https://ellipticsecure.com
website: https://ellipticsecure.com/products/mirkey_overview.html
shop: https://ellipticsecure.com/order.html
country: US
price: 49USD
repository: 
issue: 
icon: mirkey.png
bugbounty: 
meta: ok
verdict: noita
appHashes: 
date: 2021-12-04
signer: 
reviewArchive: 
twitter: 
social:
- https://www.linkedin.com/company/ellipticsecure
- https://github.com/ellipticSecure
features: 

---

> The MIRkey is a [FIDO2 Security Key](https://ellipticsecure.com/mirkey/faq/2019/05/28/what-is-a-hardware-security-key.html), multi-purpose [HSM](https://ellipticsecure.com/ehsm/faq/2019/02/09/what-is-a-hardware-security-module.html) and hardware Bitcoin wallet.

Here is [a tutorial](https://ellipticsecure.com/mirkey/how-to/2019/07/08/how-to-use-MIRkey-hardware-bitcoin-wallet-with-Electrum.html) on how to use this wallet with Electrum.

## Interface - ❌

This hardware wallet resembles a USB. It has no screen, although it has a button that allows the user to sign transactions.

## Private keys can be created offline - ✔️

From the product page:

> With MIRkey you can import, create and store cryptographic keys safely. Keys are stored encrypted with master keys in tamper proof silicon that can only be unlocked with the user password. Its hardware and operating system free nature safeguards your keys from being stolen or copied without your knowledge.
>
> This protects your keys from ransomware as well as malware and viruses.

[MIRkey specifications](https://ellipticsecure.com/developer/documentation/ehsm/mirky-specifications.html)


## Private keys are not shared - ✔️

In an article on [the blog](https://ellipticsecure.com/mirkey/how-to/2019/07/08/how-to-use-MIRkey-hardware-bitcoin-wallet-with-Electrum.html), {{ page.title }} recommends storing bitcoins offline.

> Using a hardware device means that the keys to your Bitcoins are never exposed to software or stored on your file system where they can be copied by malware. Keep a copy of your seed words on paper in a vault and use a backup hardware device in case of loss, damage or theft. In case of device theft, transfer the Bitcoins to a new wallet.

[MIRkey documentation on hardware security keys.](https://ellipticsecure.com/mirkey/faq/2019/05/28/what-is-a-hardware-security-key.html)

> In contrast, a hardware security key uses a private key to digitally sign a random chunk of data to prove to the server that it has ownership of the private key. The server verifies this signature by using the public key. The private key is never transferred out of the security key so there is no opportunity for the hacker to obtain the private key.
>
> From a hardware point of view, a well designed hardware security key like the MIRkey is in essence a simplified form of a hardware security module. This means the private keys are protected by using a secure element in secure silicon and the cryptographic operations are performed in a secure environment - no other software is allowed to execute in the secure environment. The only way to obtain the private key is to get physical access to the security key and even then it is very difficult, costly and time consuming to retrieve the private key from the device. This provides you with ample time to:
>
> - Notice that the key is missing and
> - de-register the security key before your account can be compromised.

## Device displays receive address for confirmation - ❌

There is a lack of any on-device screens, thus complicating the verification process. A transaction is sent to the device for signing and the user blindly presses a button on the device as confirmation.