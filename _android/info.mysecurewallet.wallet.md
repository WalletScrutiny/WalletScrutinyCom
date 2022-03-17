---
wsId: 
title: "Bitcoin wallet"
altTitle: "Bitcoin wallet by mysecurewallet.info"
authors:
- leo
- emanuel
users: 5000
appId: info.mysecurewallet.wallet
appCountry: 
released: 2019-11-01
updated: 2019-11-02
version: "1.1"
stars: 3.5
ratings: 63
reviews: 42
size: 3.9M
website: 
repository: 
issue: 
icon: info.mysecurewallet.wallet.png
bugbounty: 
meta: defunct
verdict: custodial
date: 2022-01-15
signer: 
reviewArchive:
twitter: 
social:
redirect_from:
---

**Update 2022-01-15**: This app is not on the Store anymore.

This wallet lists no provider website but Emanuel found it on 
[BitcoinTalk](https://bitcointalk.org/index.php?topic=5203894.0)
and
[GitHub](https://github.com/omidkhsdev/wallet).

On BitcoinTalk they assume it's closed source. On GitHub it has 2 commits from
years ago.

The most recent reviews all agree that it's not working. If the app on Google
Play is what we found on GitHub then [this](https://github.com/omidkhsdev/wallet/blob/master/app/src/main/java/com/bitcoin/wallet/ApiService/BaseUrl.java#L4):

```
class BaseUrl {
    static final String BASE_URL="https://mysecurewallet.info";
}
```

might explain why **the wallet doesn't work**. That website doesn't exist anymore.
Also [this](https://github.com/omidkhsdev/wallet/blob/master/app/src/main/java/com/bitcoin/wallet/API/ApiWallet.java#L16):

```
@GET("importwallet")
Call<CreateWalletResponse> importWallet(@Query("appsession") String email,
                                        @Query("privatekey") String privateKet);
```

looks like private keys get sent to servers to import/sweep them.

Anyway, the description only says this about security:

> 1- Highest security

but absent a claim of the app being self-custodial we probably can file it as
custodial and thus **not verifiable**.

