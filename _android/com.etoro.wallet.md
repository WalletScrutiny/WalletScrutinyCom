---
wsId: etorowallet
title: "eToro Money"
altTitle: 
authors:
- kiwilamb
- leo
users: 100000
appId: com.etoro.wallet
launchDate: 
latestUpdate: 2021-05-30
apkVersionName: "27.0.0"
stars: 2.1
ratings: 793
reviews: 536
size: 7.1M
website: https://www.etoro.com/crypto/wallet
repository: 
issue: 
icon: com.etoro.wallet.png
bugbounty: 
verdict: custodial # wip fewusers nowallet nobtc obfuscated custodial nosource nonverifiable reproducible bounty defunct
date: 2021-04-21
reviewStale: true
signer: 
reviewArchive:


providerTwitter: etoro
providerLinkedIn: etoro
providerFacebook: eToro
providerReddit: 

redirect_from:

---


From the eToro wallet FAQ:

> **[Where is my private key? (eToro Wallet)](https://www.etoro.com/customer-service/help/1306618582/where-is-my-private-key-etoro-wallet/)<br>
  eToro secures your private key using market-leading security technologies. As
  per eToro’s security protocols, we do not share our wallet addresses, as doing
  so may expose our clients’ funds to potential attacks.

which is a convoluted way of saying:

* Not your wallet but the company "eToro secures your private key"
* You cannot even know if they have all your coins as they "do not share our wallet addresses"

The other question is also not really answered:

> **[Where are my coins held? (eToro Wallet)](https://www.etoro.com/customer-service/help/1306618852/where-are-my-coins-held-etoro-wallet/)**<br>
  When the coins are in the wallet, they are stored on the blockchain (hot storage). Coins on the platform are held mostly in cold storage.

which again means nothing. All coins are stored "on the blockchain", hot or
cold. This dichotomy makes no sense but we think they try to say that the amount
stored in this app (eToro Wallet) is fully in their server's hot storage while
balances on their trading product are mostly in cold storage.

Please also note that this app achieved a considerable amount of installations
despite a miserable 1.5★ rating. In
this case, this app is only for users of
[their other app](/android/com.etoro.openbook/) and this app is the only way to
get your Bitcoins out of the other app.

So we assume this app is custodial and thus **not verifiable**.
