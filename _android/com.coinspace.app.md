---
wsId: coinspace
title: 'Coin Wallet: Buy Bitcoin'
altTitle: 
authors:
- leo
users: 100000
appId: com.coinspace.app
appCountry: 
released: 2015-05-01
updated: 2023-02-23
version: 5.9.4
stars: 4.3
ratings: 1234
reviews: 60
size: 
website: https://coin.space
repository: https://github.com/CoinSpace/CoinSpace
issue: https://github.com/CoinSpace/CoinSpace/issues/30
icon: com.coinspace.app.png
bugbounty: https://openbugbounty.org/bugbounty/CoinAppWallet/
meta: ok
verdict: ftbfs
date: 2019-12-16
signer: 
reviewArchive: 
twitter: coinappwallet
social:
- https://www.linkedin.com/company/coin-space
- https://www.facebook.com/coinappwallet
redirect_from:
- /coin/
- /com.coinspace.app/
- /posts/2019/11/coin/
- /posts/com.coinspace.app/
developerName: CoinSpace
features: 

---

**Update**: The provider closed
[the issue about reproducibility](https://github.com/CoinSpace/CoinSpace/issues/30),
so we do not assume this app to be reproducible any time soon.

Coin Bitcoin Wallet at least implies to be non-custodial with this feature:

> Secure passphrase generation (your master private key), no one else can access
your Coin.Space wallet.

but other features do not sound that promising:

> Get started in seconds and access your wallet from any device: app or web.

They also claim

> Over 20 million Wallets users.

and are around since early 2015, so we are hopeful to find more solid
information on their website because in the Playstore description there is no
word about source code.

There we again see strong claims about this wallet not being custodial:

>  Coin does not hold your keys for you. We cannot access accounts, recover
keys, reset passphrase, nor reverse transactions. Protect your keys & always
check that you are on correct URL. You are responsible for your security.

But nowhere on the website is a link to a source code repository.

Searching GitHub for their applicationId `com.coinspace.app` we find two
repositories, with [one](https://github.com/CoinSpace/CoinSpace) looking
promising: One of the latest commits is tagged `v2.16.3` which is
exactly the version we see on Google Play.

Unfortunately there is nothing in terms of build instructions. Given there are
two open issues, [issue 14](https://github.com/CoinSpace/CoinSpace/issues/14)
and [issue 17](https://github.com/CoinSpace/CoinSpace/issues/17) asking about
how to make this work, not specifically asking about Android but seeing these
issues remaining unresolved in a year and almost two years
I will postpone this analysis and conclude
for now that this wallet is **not verifiable**.

**Update:** The developer [replied](https://github.com/CoinSpace/CoinSpace/issues/30)
to our request to resolve the issues we had but he closed the issue commenting:

> Perhaps, it didn't match because we don't publish here our private parameters
which we use for build. But you can be sure that our tags match App on Google
Play store.

which was not our issue.

We are tempted to just try stuff with the Docker file there but our mission
statement is that it should be easily reproducible which definitely includes not
having to guess and so we remain until further notice with our prior verdict:
**not verifiable**.
