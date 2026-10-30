---
title: QuickX Touch
appId: quickxtouch
authors:
- danny
released: 
discontinued: 
updated: 
version: 
binaries: 
dimensions:
- 85
- 54
- 0.8
weight: 5.4
provider: QuickX Touch
providerWebsite: https://web.archive.org/web/20210801014756/https://www.quickxtouch.com/
website: https://www.quickx.io#deadLink
shop: https://www.quickxtouch.com/product/quickx-touch-card#deadLink
country: MT
price: 149USD
repository: 
icon: quickxtouch.webp
bugbounty: 
meta: discontinued
verdict: noita
date: 2026-10-30
signer: 
twitter: quickxprotocol
social:
- https://www.linkedin.com/company/quickx
- https://www.facebook.com/quickxprotocol
- https://www.instagram.com/quickxprotocol
- https://www.youtube.com/quickxprotocol
- https://www.reddit.com/r/QuickX/
- https://medium.com/quickxprotocol
- https://t.me/quickxprotocol
builds: 
features:
- nfc

---

**⚠️ Warning:** This provider is gone. Its websites are dead and its apps are no longer on Google Play.

**Update 2026-10-30:** QuickX is gone, and the card can no longer be ordered or get support, so we mark it discontinued. A wallet on the card can still be restored from its backup mnemonics, and the card's maker, Keypair (the developer of both QuickX Touch apps), still lists its own {% include walletLink.html wallet='android/kr.co.keypair.keywalletTouch' %} app on Google Play. On 2026-10-30 quickxtouch.com no longer resolved; its [last archived copy, from December 2024](https://web.archive.org/web/20241202173512/https://www.quickxtouch.com/), only says the site was stopped by its administrator.

<div class="alertBox"><div>There are reports that this company is involved in Ponzi schemes. Furthermore, it claims to be licensed by the MFSA (Malta Financial Services Authority), when in fact, <a href="https://www.mfsa.mt/news-item/mfsa-warning-quickx-ltd-cnexchange-unlicensed-entity/">they are not</a>. 
 </div> </div>

## Product Description 

> QuickX Touch is an NFC Card-typed cold wallet. It is a hardware wallet that can safely store various cryptocurrency. QuickX Touch keeps your assets secure. QuickX Touch is a rugged, durable credit card. QuickX Touch fully complies with ISO7816 and ISO14443 specifications. In addition, QuickX TOuch does not require a battery and therefore can be used semi-permanently. QuickX Touch can support multiple cryptocurrencies such as Bitcoin, Ethereum, Bitcoin Cash, Litecoin, Omisego, various ERC-20 tokens and many other coins. 

More features:

> - Compatibility for Smartphone
> - Compatibility for PC through KeyWallet Reader
> - No Battery Required
> - Backup/Recovery Sheet
> - Multi Currency
> - A FIDO certified U2F Authenticator

## Wallet Creation and Private keys

The card is primarily an NFC device which can connect with an Android phone with NFC capabilities. It has a companion app: {% include walletLink.html wallet='android/kr.co.keypair.quickxtouch' verdict='true' %} and its successor {% include walletLink.html wallet='android/kr.co.keypair.quickxtouch2' verdict='true' %}, both of which are no longer available as of February 20, 2022. 

A third-party video tutorial on [YouTube](https://www.youtube.com/watch?v=5f_NSVqzSn0) details how to create a wallet with QuickXTouch: 

- The NFC card is connected with the NFC-enabled Android phone with an installed version of {% include walletLink.html wallet='android/kr.co.keypair.quickxtouch2' %}. 
- The user then uses the phone to create a wallet and generate the backup mnemonics. 
- A wallet can be restored for as long as the user has control of the mnemonics.

## Analysis 

There are 2 other projects that are related to the QuickX Touch: The QuickX Protocol and CNexchange.io. Although the Android app is no longer available, the hardware wallet can still be ordered through its online portal.

Like most NFC cards that are reliant on a companion app on another device, the QuickX touch **risks exposure of the private key through the connected device**. There was also no mention whether the private keys are stored on a secure chip element. With no input and output interfaces, this makes the card highly dependent on the app. This risk is also made more prominent when the app is suddenly not available for download anymore.

{% include featureEvidence.html feature="nfc" quote="QuickX Touch is an NFC Card-typed cold wallet." source="Product Description" %}
