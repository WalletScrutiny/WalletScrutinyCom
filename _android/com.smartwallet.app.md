---
wsId: echooDeFi
title: 'Echooo : Crypto AA Wallet&DeFi'
altTitle: 
authors:
- danny
users: 50000
appId: com.smartwallet.app
appCountry: 
released: 2023-02-10
updated: 2025-03-06
version: 1.21.1
stars: 4.8
ratings: 
reviews: 76
website: https://www.echooo.xyz/
repository: 
issue: 
icon: com.smartwallet.app.png
bugbounty: 
meta: ok
verdict: nosource
appHashes: 
date: 2024-07-24
signer: 
twitter: echooo_wallet
social:
- https://t.me/Echooowallet
- https://discord.com/invite/UX26GYAJw4
redirect_from: 
developerName: Echooo Labs Pte Ltd
features: 

---

## Update 2024-07-24

We searched [GitHub for the appId](https://github.com/search?q=%22com.smartwallet.app%22&type=code), "com.smartwallet.app", but did not find any relevant repository. On their website they claim that: 

> Open Source and Rigorous Audits
>
> The smart contracts of the Echooo wallet have undergone exhaustive reviews by multiple reputable third-party institutions to ensure the absolute security of user private keys.
>

I suggested changing the wording on their site [on X](https://x.com/dannybuntu/status/1815932856239108365), as the header gives the impression that the entire project is Open Source. 

## App Description from Google Play 2023-06-29

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

Our interpretation of these strings:

- address: An actual BTC address
- createTime: The Unix timestamp of when the wallet was created. `Thu Jun 29 2023 07:23:43 GMT+0000` in this case
- encryedInfo: Despite the typo, this is probably the encrypted private key of the wallet - or part thereof.
- kekId: The ID of a key encryption key that was used to encrypt the wallet. This implies that the backup does not contain all information required to obtain the private key. The key encryption key is probably stored by the provider.
- version: The version of the wallet.

So while these backups do allow to restore the private key with the help of the provider while any one of these files maybe is not enough to restore it, more information would be required.

If done such that the provider does never get the private key - as promised - the app would have to send the kek to the provider and the encrypted backup to two different places such as the suggested Google Drive and Dropbox.

While this clearly is non-custodial - the provider has no control over your funds - it is quite prone to error or hacks. If the provider disappears or Google or Dropbox close your account, you are without a backup. Especially if the provider disappears, you also cannot use an alternative product to recover your funds. And if somebody hacks into your email account or PC, they probably also get access to your Dropbox and Google Drive.

## Conclusion

While their choice of doing key management is not an industry standard, it is - as long as nothing goes wrong - self-custodial but as we could not find the source code, this product is **not verifiable**.
