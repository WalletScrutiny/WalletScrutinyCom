---
title: KoinKeep
appId: koinkeep
authors:
- danny
released: 2019-12-07
discontinued: 
updated: 
version: 
binaries: 
dimensions: 
weight: 
provider: KoinKeep
providerWebsite: 
website: https://web.archive.org/web/20200203064949/https://koinkeep.com/
shop: https://web.archive.org/web/20200607031808/http://koinkeep.com/buy/
country: US
price: 100USD
repository: https://github.com/KoinKeep/BitcoinSpoon
issue: 
icon: koinkeep.png
bugbounty: 
meta: ok
verdict: noita
date: 2022-05-16
signer: 
reviewArchive: 
twitter: KoinKeep
social: 

---

## Product Description 

A list of {{ page.title }}'s features.

> Public Key Cryptography
>
- 32 byte secp256k1 keys are used exclusively.
- All keys are stored in as few places as possible. Keys on the hardware device never go to the phone and vice versa.
>
Multi-sig
> - Any number of KoinKeep hardware wallets can be combined into a multi-sig arrangement.
- When using multiple devices, two-thirds of the collection are required to unlock funds.
>
> Local Transaction Signing
- Transaction payloads are transferred between devices, signed and passed back.
- Transactions are taken to hardware wallets individually, so they never need to be in the same location.
>
> On-chain Two-factor Authentication (2FA)
> - KoinKeeps use a unique bitcoin script format that allows for on-chain 2FA
> - The key for this 2FA is stored in the user's phone and is never transferred to the device.
> - This key is required but not sufficient to unlock funds.
>
> The unique input script format is: [Signature] OP_CHECKSIGVERIFY [Signature] [Signature] OP_2 [Public Key] [Public Key] [Public Key] OP_3 OP_CHECK
>
> Bluetooth
- Nothing sensitive is ever sent over Bluetooth (ie. no keys).
- All communication over Bluetooth is encrypted AES_CBC anyway.
- All encryption keys are 32 bytes.
- Initial setup performs diffie key exchange. After which the device will only ever recognize that single key forever.
- Nonces are used to prevent replay attacks.
>
> Encrypted Storage
- All device storage is encrypted.
- Encryption is done with AES_CBC.
- The encryption key is 32 bytes.
- The encryption key is never stored in permanent memory.
- The encryption key is instead stored on the user's phone and given to the device during signing.
- Learn more about KoinKeep’s storage encryption strategy
- Direct-access SPV Bitcoin Wallet
- KoinKeep’s phone application connects directly to the Bitcoin network as an SPV (Simple Payment Verification) wallet.
- Bloom filters are used in a privacy-increasing fashion.
- When a bloom filter is updated all currently connected nodes are disconnected. New nodes receive the updated bloom filter. This prevents nodes from being able to 'diff' the bloom filters and reduce your privacy.
>
> Whitelist Nodes
- You can specify nodes to always connect to.
- You can specify nodes to only connect to by marking them as "master nodes." This is helpful if you run your own node to further increase your privacy.
>
> Built in Block Explorer
- Using online block explorers decreases privacy, because their servers can track you.
- KoinKeep’s phone app has a built-in basic block explorer, which shows all transactions relevant to your wallet.

{{ page.title }} has a [companion app](https://apps.apple.com/us/app/koinkeep/id1492540597) in the Apple Store.

## Analysis 

The website is [no longer online](https://www.isitdownrightnow.com/koinkeep.com.html). Its twitter account's [last post](https://twitter.com/KoinKeep/status/1340756308572528642) was made in December 21, 2020. It is highly likely the device is **no longer for sale**. Apart from that, it has **no display interface**. It claims to mitigate the "trusted screen problem" through this: 

<blockquote class="twitter-tweet"><p lang="en" dir="ltr">KoinKeep‘s come in sets of three allowing for easy multi-key setup (hide each in different locations).<br><br>Gatekeeper solves the ‘trusted screen’ problem.<br><br>We believe together this is the best over the counter Bitcoin storage solution on the market.</p>&mdash; Keeper (@KoinKeep) <a href="https://twitter.com/KoinKeep/status/1249480166184648704?ref_src=twsrc%5Etfw">April 12, 2020</a></blockquote> <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>

[Gatekeeper](https://github.com/KoinKeep/GateKeeper) is available on GitHub:

> GateKeeper is a tool for verifying withdrawal transactions and more. It will verify that your Bitcoin wallet is not lying or stealing from you.
>
> GateKeeper should be used:
>
- After a withdrawal transaction is created.
- Before a transaction is published.
- To ensure the transaction is not published, make your withdrawal transaction in an offline environment.

The basic idea is that the user instead of using an online companion app to interface with his hardware wallet, the user uses yet another offline device to read and interpret the tx before it reaches an internet-connected device which indeed can solve the security issue of all our {% include verdictBadge.html verdict='noita' type='short' %} devices but at a huge cost:

Normally:

1. Create unsigned transaction on companion app on internet connected machine
2. Verify details on hardware wallet
3. Approve - Signed transaction gets sent back to companion app
4. Companion app broadcasts

Here:

1. Create unsigned transaction on companion app on internet connected machine
2. Blindly approve - Signed transaction gets sent to third device?
3. Third device displays details. If those are ok, transfer the signed transaction to companion app
4. Companion app broadcasts

So here it is not clear if that third device sits between companion app and hardware wallet. If that is the case - the unsigned transaction is passed through the third device to the hardware wallet - the user is susceptible to that third device being compromised and showing X while getting signed and broadcast Y. If it does not see the transaction prior to HW signing it, the information flow gets even more complicated but the chances of a compromised "GateKeeper" doing harm vanish.

All in all GateKeeper is a neat idea but doesn't save this product from a negative verdict regarding the lack of a display.