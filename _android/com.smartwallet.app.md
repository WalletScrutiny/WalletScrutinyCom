---
wsId: echooDeFi
title: 'Echooo: Safe & Earn with DeFi'
altTitle: 
authors:
- danny
users: 10000
appId: com.smartwallet.app
appCountry: 
released: 2023-02-10
updated: 2023-05-31
version: 1.5.0
stars: 4.6
ratings: 
reviews: 3
size: 
website: https://www.echooo.xyz/
repository: 
issue: 
icon: com.smartwallet.app.png
bugbounty: 
meta: ok
verdict: custodial
date: 2023-06-29
signer: 
reviewArchive: 
twitter: echooo_wallet
social:
- https://t.me/Echooowallet
- https://discord.com/invite/UX26GYAJw4
redirect_from: 
developerName: Echooo Labs Pte Ltd
features: 

---

## App Description from Google Play

> Echooo is a decentralized self-custodial MPC&AA smart contract wallet app that supports multi-signature and social recovery. The multi-signature mechanism ensures security while significantly reducing transaction costs through Echooo's unique AI-driven technology architecture, combined with the zkSync layer2 network. Echooo uses the ERC-4337 standard and continuously optimizes account abstraction, so as to deliver a better user experience and a seamless transition from Web2 to Web3 for more users.
>
> Echooo is seed phrase free with security ensured by algorithm encryption and cloud storage technology.
> - Multi-Layer Security Infrastructure combined with MPC, TEE (Trusted Execution Environment), social recovery and multi-signature infrastructure to ensure bulletproof asset security.
> - No single point failure anymore with an account recovery mechanism in place.

## Analysis

- The app describes itself as mnemonic/private key free.
- When we checked their documentation, the only [supported networks](https://www.echooo.xyz/TechGuides) are:

- Ethereum
- zkSync

Chains to support in the future included:

- BSC(Binance Smart Chain)
- Polygon
- Arbitrum
- Optimism

- There is [no mention of support for BTC](https://twitter.com/BitcoinWalletz/status/1674316225399214080), and yet, there is a 'BTC-N' Wallet.
- Apparently, 'N' is a designation to (from app question mark symbol):

> distinguish wallets in different networks, the format is 'network-type-name', where the network and type cannot be modified.

Thus, this should be a Bitcoin wallet, with a type 'N' plus the name of the wallet we chose to give it.

### It claims to be self-custodial

Yet, its backup procedures are questionable. First, it claims that it supports MPC (Multi-Party Computation we presume) Wallets where the private keys are supposedly encrypted, and then backed up on either Google Drive or Dropbox.

One backup is called 'Master', and the other, 'Slave'. If Master is backed up in Google drive, the app recommends that 'Slave' is backed-up in Dropbox or somewhere else.

We opened our Google Drive to see the content. We found a folder and a Google Doc file. In the file:

For Master:

    {"address":"bc1q9wg6vfxk3pg2fs69yzsy6f9ruak2ucx59eftj2",
    "createTime":1688023423454,
    "encryedInfo":"42ndcg9fXXaXH4NYL6ClWCA5ulubRfeBdM1IcGhAze5AnH4a8d90jHUh9bUMK2MGQdyQ5UpAKxfuj1EXCK3ZmyKg8PoQywdNMdwhPVFcnIM\u003d",
    "kekId":"e0d0d3cba55c4d869bfd653eba0c5605b3dc2fcb-34cc-4a79-962d-29730eade830",
    "version":"1688022095052"}

For Slave:

    {"address":"bc1q9wg6vfxk3pg2fs69yzsy6f9ruak2ucx59eftj2",
    "createTime":1688024897210,
    "encryedInfo":"1FJ8GW1tLvdw5FJ74WWItx+vld4a5R6aRE5HmLx8ZRai6T1utk7CWmSzMc78JAGVU2PvuplTICTssaoRUUpMCDfQ3/zpDyK1HCUoLgVSH6s\u003d",
    "kekId":"eddc2a1a02fe46278f6d92c820afb7b0b3dc2fcb-34cc-4a79-962d-29730eade830",
    "version":"1688022095052"}

We had Google Bard explain these strings:

> - address: The address of a Bitcoin Cash wallet.
> - createTime: The Unix timestamp of when the wallet was created.
> - encryedInfo: The encrypted information about the wallet.
> - kekId: The ID of the key encryption key that was used to encrypt the wallet.
> - version: The version of the wallet.

Note, that the AI indicated that this was a Bitcoin Cash address, this is because the same address could be present in both BTC and BCH networks.

## Conclusion

This was difficult for us to give a verdict to. For one, these two files are stored on Google Drive, a service within a corporation with its own [Terms and Conditions](https://www.google.com/drive/terms-of-service/), which states:

> 2. Program Policies
>
> We may review content to determine whether it is illegal or violates our Program Policies, and we may remove or refuse to display content that we reasonably believe violates our policies or the law. But that does not necessarily mean that we review content, so please don’t assume that we do.

Yet, on the other hand, the provider claims their product is self-custodial.

The objective of keeping the private keys is that nobody except the owner has absolute control of these - especially in practical terms.

If an attacker, say the US government, with enough intelligence, has Google to **freeze** the Google Drive or DropBox account of the user, then the wallet owner has effectively lost control of the keys.

We are open to other interpretations, but we primarily view this as a **custodial** provider for the reasons stated above.
