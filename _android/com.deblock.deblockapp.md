---
wsId: deblock
title: Deblock - Banking app
altTitle: 
authors:
- danny
users: 100000
appId: com.deblock.deblockapp
appCountry: 
released: 
updated: 2025-04-10
version: 3.0.16
stars: 4.7
ratings: 
reviews: 7
website: https://deblock.com/
repository: 
issue: 
icon: com.deblock.deblockapp.png
bugbounty: 
meta: ok
verdict: custodial
appHashes: 
date: 2024-09-06
signer: 
reviewArchive: 
twitter: DeblockApp
social:
- https://discord.com/invite/deblock
redirect_from: 
developerName: Deblock SAS
features: 

---

## App Description from Google Play

> - A Real Crypto Wallet: Manage your favorite cryptocurrencies such as Bitcoin (BTC), Ethereum (ETH). On Deblock, you truly own your cryptocurrencies and no one can take them from you.
> - Integration with Ledger Live and Ledger Wallet: Easily transfer your cryptos to/from your Ledger and maintain secure access to your assets.
> - Multi-Wallet Compatibility: Transfer from/to popular wallets like Metamask, Phantom Wallet, TronLink, and Trust Wallet to manage your cryptos.
> - Buying and Selling Cryptos: Buy and sell cryptocurrencies with ease like on Coinbase, Binance, Kraken, Revolut...
> - Personalized Finance: Track and optimize your budget with advanced tools like Revolut, Wise, and Curve.
> - Mobile and Bank Payments: Make instant and secure payments with Boursobank, Lydia, N26, Trade Republic.

## Analysis 

*Note: The app is only available for tax residents of France or France's oversea territories.*


Deblock is a France-based app that claims to offer an alternative self-custodial security system. Instead of the user memorizing a seed phrase, this app generates two "shards" of a key: one generated on the user's device and the other on Deblock's servers. Both parts are then encrypted and "backed up".

As stated on the [official website:](https://deblock.com/en-FR/best-non-custodial-wallets-in-the-world)

> Your shard of the key (2) <br>
    - Generated upon signup on your device. <br>
    - Encrypted and backed-up in case you lose your phone.
>
> Deblock's shard of the key (1) <br>
    - Generated upon signup on Deblock's server. <br>
    - Encrypted and stored in cold storage, in case a meteorite strikes our data centre.

You can “request your private key at any point in time.” According to the article linked earlier:

> The app will download Deblock's encrypted shard🔒 and decrypt it in your device. The app will use your shard and Deblock’s shard on your device to reconstruct the wallet's private key and your seed phrase.

There's a warning: 

> If you decide to use your wallet’s private key outside of the Deblock ecosystem, we will have to close your Deblock account

In the section “What if Deblock disappears?” (and you have neither the app nor a backup), an Emergency Recovery Process is outlined: If Deblock vanishes and the user has no app or backup, an "independent third party" will provide a decryption SDK to release both shards of the private key from cold storage. This includes the user’s half of the private key, implying that third parties effectively control the private key making this app **not verifiable.**