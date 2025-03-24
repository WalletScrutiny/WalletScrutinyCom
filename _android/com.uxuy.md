---
wsId: uxuy
title: 'UXUY: Memecoin for Trading'
altTitle: 
authors:
- danny
users: 500000
appId: com.uxuy
appCountry: 
released: 2023-08-09
updated: 2025-02-08
version: 1.3.13
stars: 4
ratings: 
reviews: 24
website: https://uxuy.com
repository: 
issue: 
icon: com.uxuy.png
bugbounty: 
meta: ok
verdict: custodial
appHashes: 
date: 2024-09-05
signer: 
reviewArchive: 
twitter: uxuycom
social:
- https://t.me/uxuycom
- https://discord.com/invite/BZwZA27Zkv
- https://www.linkedin.com/company/uxuy
redirect_from: 
developerName: UXUY Limited
features: 

---

## App Description from Google Play

> At UXUY, your security is our top priority. We utilize cutting-edge MPC (Multi-Party Computation) technology to provide institutional-grade self-custody solutions.
>
> Say goodbye to mnemonic phrase wallets! Our keyless security solution ensures you don't have to worry about storage difficulties, loss, or single-point failures. Your private keys will be safeguarded at the highest level, ensuring the security and reliability of your assets.

## Analysis 

Wallet setup begins with generating MPC private key shares.

It first generates a cloud MPC slice. Then it securely stores cloud MPC key slice. The third step involves generating a personal MPC slice. Finally, the personal key slice is encrypted and prepared for backup.

Backup methods include:

- Google Drive
- iCloud
- Dropbox
- Baidu Cloud
- Local Storage

We chose local storage and created a folder for it. It then asked us to setup facial authentication. We skipped it. It then prompted us to activate and claim what it calls its GasPool allocation, so we don't have to worry about transaction fees.

Multiple cryptocurrencies are shown and supported, including, wBTC, Sats(Lightning), ETH and others.

The lightning address that was given to us `is3b1ba5a27d2800b6@uxuy.com`, while the invoice is:

> lnbc1pndjurqpp5eeu6l8hcz9f5c5pkrnlrs63246vfy0swj25lw90dfwutpm098hxqdqqcqzzsxqrrsssp59t58e6hvk43jucjs65ap2khscaykf6xcyu8gmqesh3pzp0h4suks9qyyssqd80hr658x5lpnfhm0fv8d8cttyr6zmlr3z2pq0jgq5jkmpg59tc46uc8es9p4zxhkey7v2x6futu4k4uqjctkay2lvcj7skred20fccpgj5twy

We shared the address because we thought it prudent to identify parts of it to determine what verdict to give to it. 

**First:** `is3b1ba5a27d2800b6` is the unique identifier.

**Second:** `@uxuy.com` which is the domain, could also indicate that payments are routed through uxuy.com as an LSP or a lightning service provider. 

## UXUY claims to be self-custodial and non-custodial

It claims to be self-custodial in its Google Play page, and non-custodial in its [documentation.](https://docs.uxuy.com/mpc-wallet/)

> A non-custodial secure wallet is a type of wallet that never generates or retains the complete private key or mnemonic phrase at any point. During the creation of an MPC (Multi-Party Computation) wallet, only MPC unit shards are generated through algorithms, and no private key is generated throughout the entire process, only the existence of MPC unit shards. When signing transactions, private keys are not used for signing; instead, irreversible signatures are created using MPC unit shards.
>
> ### The types of sharding used by UXUY
>
> 2/2 Shard Unit: UXUY employs a 2/2 sharding approach to create MPC wallets for users. Users manage one shard unit and host one shard unit. 3/2 Social Recovery: Users can upgrade their 2/2 shard unit to a 3/2 shard unit for social wallet recovery. The development of 3/2 social recovery is currently underway. Stay tuned for updates!" 

Coming up with a verdict for this is not easy. On one hand, we have the claims of the provider that they are both self and non-custodial. On the other hand, we seem to have indications of a custodial service. 

1. The use of their domain in the lightning wallet address. This could indicate that they are acting as the Lightning Service Provider, which means their bitcoin lightning wallet is actually custodial. 

2. The non-generation of the private key and in instead replaced by 'shards'. 

So we go back to the WalletScrutiny methodology:

> Some services might claim their setup is super secure, that they don't   actually have access to the funds, or that the access is shared between  multiple parties. For our evaluation of it being a wallet, these details are  irrelevant.

Not your keys, not your coins. 

If we were to apply some real world use cases to this, absent the mnemonic phrase, all that airport security would have to do is to take control of the mobile phone. Perhaps, issue a subpoena to the provider and invoke anti-money laundering laws, and if the provider has their own shard, use the mobile phone and the provider shard to control the funds. 

For this reason, we have to err on the side of caution and mark this as a **custodial** service. Even if it weren't and by some explanation they are indeed non-custodial, their source code is not available for perusal. They do have a [GitHub organization page](https://github.com/orgs/uxuycom/repositories).
