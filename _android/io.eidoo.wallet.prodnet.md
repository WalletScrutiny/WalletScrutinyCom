---
title: "Eidoo: Bitcoin and Ethereum Wallet and Exchange"
altTitle: 

users: 100000
appId: io.eidoo.wallet.prodnet
launchDate: 2017-09-25
latestUpdate: 2020-11-19
apkVersionName: "2.14.0"
stars: 3.7
ratings: 1510
reviews: 730
size: 12M
website: https://eidoo.io
repository: 
issue: 
icon: io.eidoo.wallet.prodnet.png
bugbounty: 
verdict: nosource # May be any of: wip, fewusers, nowallet, nobtc, custodial, nosource, nonverifiable, reproducible, bounty, defunct
date: 2019-12-22
reviewStale: true
signer: 
reviewArchive:


providerTwitter: eidoo_io
providerLinkedIn: company/11232699
providerFacebook: eidoocrypto
providerReddit: 

redirect_from:
  - /io.eidoo.wallet.prodnet/
  - /posts/io.eidoo.wallet.prodnet/
---


The app's description sounds non-custodial as it mentions an HD backup:

> Eidoo is a multicurrency wallet and a crypto exchange with a single backup
passphrase and HD security level.

The website is more explicit:

> Your private key is encrypted on the app and only you can decrypt it as
**Eidoo is NOT a custodian wallet.**
You can use the wallet without providing any personal information

Unfortunately we can't find any source code. No such link on their website and
neither can we find any relevant hit searching for their appId
`io.eidoo.wallet.prodnet`
[on GitHub](https://github.com/search?q=%22io.eidoo.wallet.prodnet%22&type=Code)
which leads to the verdict: **not verifiable**.


Other observations
==================

When restoring a wallet from the 12 words mnemonic, the wallet uses the currently
active keyboard which might be less than trustworthy. More secure wallets have
their custom keyboards for backup entry.

The wallet also is limited to 12 words + passphrase and does not support 24 words
as some wallets use by default, so you won't be able to use this wallet to restore
a backup from such wallets.
