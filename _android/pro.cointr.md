---
wsId: coinTRPro
title: 'CoinTR Pro: Trade Bitcoin ETH'
altTitle:
authors:
- danny
users: 10000
appId: pro.cointr
appCountry:
released: 2022-10-30
updated: 2023-07-11
version: 2.2.0
stars: 4
ratings:
reviews: 6
size:
website: https://www.cointr.pro
repository:
issue:
icon: pro.cointr.png
bugbounty:
meta: ok
verdict: custodial
date: 2023-07-03
signer:
reviewArchive:
twitter: CoinTRpro
social:
- https://t.me/CoinTRPro
- https://www.instagram.com/cointrturkiye
- https://www.facebook.com/profile.php?id=100083113521452
- https://www.youtube.com/channel/UCU2wOPdZ9mT2g3S2_wQcQQw
- https://medium.com/@cointrbtc
redirect_from:
developerName: CoinTR pro
features:

---

## App Description from Google Play

> CoinTR has obtained financial licenses, MSB license from FinCEN, support compliance and reliable business. Users' assets guardian by international professional financial management criterion SOX 404, GAAP and ISO27000 Information Security Standards.
>
> Rich and Diverse Trading Model
>
> Including Bitcoin (BTC), Ether (ETH), Doge etc. spot and contract trading, choose your own leverage, support up to 125 times robust contracts, to meet your diverse trading needs.

## Analysis

Important note: There are two major sections within this app:

1. The exchange
2. The web3 TRON/ETH wallet that allows the private keys to be backed-up.

- We signed up, but the email verification did not contain the code to input in the form. It merely told us to "login directly". We closed the app and opened it again and logged in using the details we provided. This time, they sent a code.
- There are two tabs at the top of the app:
  - Exchange
  - Web3 Wallet

### Web3 Wallet Section

- The wallet section allows us to create a wallet, but the "import wallet" option says "Coming soon"
- We set a wallet password.
- It sent another verification email. It consisted of 6 digits.
- Furthermore, it then asked us to back up the wallet password which is in ciphertext, which has 64 characters.
- We tapped on "Complete", and it gave a message that the Web3 Wallet was created.
- A multichain wallet was presented with various tokens. The primary network is ETH. The secondary network was TRON.
- There is no bitcoin.
- The seed phrase and the private keys have their own export functions.

### Exchange

- This is a centralized cryptocurrency exchange located within the same app.
- It is possible to deposit with a Bech32 BTC address.
- This [Help Document](https://support.cointr.pro/hc/en-us/articles/5211778969103-How-to-withdraw-Web-) describes how users can withdraw BTC from the platform.

## [Terms](https://support.cointr.pro/hc/en-us/articles/5224297265423)

- Section 3 gives the platform the power to freeze the user's funds
- Section 3.1 describes the process by which trade orders are made on the platform. This clause also describes how the platform has control over user funds.
- Section 6.1 gives the platform the power to terminate the user's access at any time without prior notice to the user.

Despite the ability to export the seed phrases and the private keys in the Crypto Web3 wallet located within the same app, we believe this is a custodial provider for the simple fact that users would still have to login before they can either import a wallet or create a wallet.

More definitive to this argument is the **Web3 Wallet component only supports ETH and TRON tokens**. It **does not support Bitcoin**.

This is a **custodial** app.
