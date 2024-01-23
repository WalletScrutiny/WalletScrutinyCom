---
wsId: mojitoWallet
title: Mojito wallet
altTitle: 
authors:
- danny
users: 1000
appId: com.mojitowallet
appCountry: 
released: 
updated: 2023-05-18
version: 0.2.9
stars: 
ratings: 
reviews: 
size: 
website: https://www.mintlayer.org/en/mojito-wallet/
repository: https://github.com/mintlayer/mojito_mobile_wallet
issue: https://gitlab.com/walletscrutiny/walletScrutinyCom/-/issues/502
icon: com.mojitowallet.png
bugbounty: 
meta: ok
verdict: nonverifiable
date: 2023-09-06
signer: 
reviewArchive: 
twitter: mintlayer
social:
- https://t.me/mintlayer
- https://www.linkedin.com/company/mintlayer
- https://discord.gg/gkZ4h8McBT
- https://www.facebook.com/MintlayerOfficial
- https://www.youtube.com/channel/UCVVpaPry8xZS47pPBmS4rnA/videos
redirect_from: 
developerName: RBB SRL
features: 

---

## App Description from Google Play

> The Mojito wallet allows you to create multiple Bitcoin wallets in one, simple interface.
>
> Mojito is a MIT licensed cryptocurrency wallet built around the Bitcoin ecosystem.
> 
> With the Mojito wallet, you can:
>
> - Create BTC wallets to store, send and receive BTC
> - Retain full control of your private keys
> - No account creation necessary
> - Ensure that your private key never leaves your phone
> - Create BIP39 compliant seed phrases (mnemonic seed phrases)
> - Restore BTC wallets from seed phrase
> - Create BIP84 addresses
> - Create BIP49 addresses
> - Send and receive BTC from any generated addresses
> - Connect to your own node for increased privacy

## Analysis 

- The app provided a BTC wallet and the seed phrases. We helped generate entropy by drawing a cat. 

This app was previously [due to be verified](https://gitlab.com/walletscrutiny/walletScrutinyCom/-/issues/502), however [Leo](../authors/leo) issued the following commentary:

  > The build instructions are not very strict about tools to be used, making reproducibility unlikely. The repository did not use tags or releases, making finding matching versions difficult. Given this commit incremented the version from 0.2.7 to 0.2.10 with Google Play featuring version v0.2.9, we can say with certainty that reproducing the version on Google Play is impossible.
  >
  > A **nonverifiable** verdict is warranted until we check if compilation works at all.
