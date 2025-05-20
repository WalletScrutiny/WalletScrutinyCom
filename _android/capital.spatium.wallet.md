---
wsId: spatium
title: Spatium MPC Crypto Wallet
altTitle: 
authors:
- danny
- leo
users: 1000
appId: capital.spatium.wallet
appCountry: us
released: 2018-08-31
updated: 2024-02-22
version: 3.2.5
stars: 
ratings: 
reviews: 
website: https://spatium.net/
repository: 
issue: 
icon: capital.spatium.wallet.png
bugbounty: 
meta: removed
verdict: nosource
appHashes: 
date: 2025-01-27
signer: 
twitter: spatium_news
social:
- https://www.linkedin.com/company/spatium-capital
- https://www.facebook.com/spatiumnews
- https://github.com/CaspianTechnologies
redirect_from: 
developerName: CaspianTechnologies
features: 

---

## Update 2024-07-17

The [Terms and Condition's](https://spatium.net/terms-and-conditions) wording has been updated since the last review:

> All content included in or made available through the Site or any related content, materials and information such as text, graphics, logos, button icons, images, audio clips, digital downloads, data compilations is the property of CASPIAN TECHNOLOGIES PTE LTD (Singapore) or its affiliates or its content providers and protected by international copyright laws.  

> You agree you will not copy, transmit, distribute, sell, license, reverse engineer, modify, publish, or participate in the transfer or sale of, create derivative works from, or in any other way exploit any of the content, in whole or in part without the prior written consent of CASPIAN TECHNOLOGIES PTE LTD (Singapore).
>
> We grant You a limited, personal, non-exclusive, non-transferable license to access the Site and to use the content, solely for personal, internal, and non-commercial purposes. Any right not expressly granted to You in this Terms are hereby reserved by CASPIAN TECHNOLOGIES PTE LTD (Singapore) and its affiliates and licensors.
>
> You may not use or exploit any marks without prior written consent from CASPIAN TECHNOLOGIES PTE LTD (Singapore).

However, we assume the app itself remains closed source. We found a Github profile with the provider's name: [@CaspianTechnologies](https://github.com/CaspianTechnologies) 
No source code for the app was to be found. Any claims this app has made concerning security are therefore **not verifiable.**

## Old Review 2021-11-17

## App Description

> Spatium is a unique keyless crypto wallet that allows you to easily and safely buy, store, and send crypto.
> 
> Spatium wallet, based on SMPC technology and anonymous biometrics, allows you to manage digital assets **without a Private Key**. It’s replaced with an encrypted set of secrets distributed between your device and professional security provider.

In this case this does not mean that the wallet doesn't use a private key, with their server doing so. They claim there is no private key. Period. Which of course is bogus as Bitcoin transactions need a private key to sign.

It further claims to use biometrics to allow users to recover their data. In a [Medium blogpost](https://medium.com/spatium-blog/spatium-protocol-smpc-on-your-guard-d78a243f519) they mention more details. 

The worrying part is that they use threshold signatures with secrets generated and never leaving other devices, allowing to define a threshold "k of n" of devices required to sign a transaction. Unless k=n, their (partial) custodians can collude against the user but with k=n, the user is still not in control of his funds. The custodians could extort the users: Give us half your money or we burn it all.


## The App

There is a Bitcoin wallet with a send and receive function. Backup is possible through the use of biometric data.

## [Termination Clause in User Agreement](https://spatium.net/user-agreement.html)

> Upon termination of the Agreement, your account will cease to exist (be deleted). Upon termination of this Agreement, we will cease to provide services and you will cease to have access to the Application.
>
> If you terminate the Agreement for any reason, you will not be entitled to any refund of fees for use of features of the Application (if any) or any other fees. No data from your prior Reports will ever be available to you.

## Closed Source

> reverse engineer, decompile, disassemble or otherwise attempt to extract the source code of the Software, except as expressly permitted by law in the jurisdiction in which you are located;

> rent, lease, sell, assign or otherwise transfer the rights to the Application;

## Verdict

Without the private keys, we do not consider hashed biometric data as a suitable replacement. Add to that the ability to terminate access to the application plus their unwillingness to share their source code. While this does not qualify as a self-custodial service it does not exactly look "custodial" either. 

As this app **does not have publicly available source code** it is **not verifiable.**


