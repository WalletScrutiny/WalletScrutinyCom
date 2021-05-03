---
wsId: 
title: "D'CENT Crypto Wallet - Bitcoin, Ethereum, XRP etc."
altTitle: 
authors:
- kiwilamb
users: 10000
appId: com.kr.iotrust.dcent.wallet
launchDate: 
latestUpdate: 2021-04-26
apkVersionName: "5.3.0"
stars: 4.4
ratings: 245
reviews: 171
size: 31M
website: https://dcentwallet.com/
repository: https://github.com/DcentWallet
issue: 
icon: com.kr.iotrust.dcent.wallet.png
bugbounty: 
verdict: nosource # wip fewusers nowallet nobtc obfuscated custodial nosource nonverifiable reproducible bounty defunct
date: 2021-05-03
reviewStale: true
signer: 
reviewArchive:


providerTwitter: DCENTwallets
providerLinkedIn: 
providerFacebook: DcentWalletGlobal
providerReddit: 

redirect_from:

---

After some research on this wallet it was not clear as to how the app manages private keys, so I reached out to the twitter handle...

"Hi with the mobile wallet app, the user is given 24 words backup recovery. Do you as the provider also keep a copy of these for backup, or are they the sole ownership of the wallet user?"

And the teams speedy response....

> "D'CENT Wallet is a completely self-custody wallet. User has the sole ownership and access to the wallet and assets(privates keys) that are created in it. <br>
> The mnemonic code is created randomly when the wallet is installed. Since D'CENT(company) does not keep a backup at all, you will lose your assets if you lose the recovery words. Please be careful in handling your confidential information."

With the provider confirming they have a non-custodial wallet we need to locate some source code in order to check the wallet for reproducibility. <br>
I have contacted the proivder to direct us to the correct [repository](https://github.com/DcentWallet)

Our verdict: This 'wallet' claims to be non-custodial, however with no public source code found at the providers [github repository](https://github.com/DcentWallet) it is **not verifiable**.
