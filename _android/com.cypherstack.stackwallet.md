---
wsId: stackWallet
title: Stack Wallet
altTitle: 
authors:
- danny
- keraliss
users: 10000
appId: com.cypherstack.stackwallet
appCountry: 
released: 2024-05-13
updated: 2025-04-11
version: 2.1.11
stars: 4.7
ratings: 
reviews: 4
website: 
repository: https://github.com/cypherstack/stack_wallet/tags
issue: https://github.com/cypherstack/stack_wallet/issues/984
icon: com.cypherstack.stackwallet.png
bugbounty: 
meta: ok
verdict: sourceavailable
appHashes: 
date: 2023-09-11
signer: 
reviewArchive: 
twitter: stack_wallet
social:
- https://discord.com/invite/mRPZuXx3At
- https://t.me/stackwallet
- https://www.reddit.com/r/stackwallet
- https://www.youtube.com/channel/UCqCtpXsLyNIle1uOO2DU7JA
redirect_from: 
developerName: Cypher Stack Team
features: 

---

**Update 2024-09-11:**

**Review: Stack Wallet Build**

The build process for the Stack Wallet was attempted using the provided Dockerfile. However, the build failed due to an issue within the `build_app.sh` script. The script could not proceed, and the build was halted.

**Command Used:**
```
docker build -t stack_wallet -f stack.dockerfile .
```

**Error Noted:**
The following error was encountered during the execution of the `build_app.sh` script:
```
+ ./build_app.sh -a stack_wallet -p android -v 1.0.0 -b 1
/app/stack_wallet /app/stack_wallet/scripts
/app/stack_wallet/scripts
+ echo build_app.sh failed
+ exit 1
build_app.sh failed
```

The Docker build process successfully reached the point of invoking the `build_app.sh` script, but the script failed without providing further details.

**Conclusion**:
The Stack Wallet build was not successful due to the failure of the `build_app.sh` script. Further investigation into the script and its dependencies is required to complete the build process. The wallet is **not verifiable** at this time.


## App Description from Google Play

> Stack Wallet is a fully open source cryptocurrency wallet. With an easy to use user interface and quick and speedy transactions, this wallet is ideal for anyone no matter how much they know about the cryptocurrency space. The app is actively maintained to provide new user friendly features.
>
> Highlights include:
> - 10 Different cryptocurrencies
> - All private keys and seeds stay on device and are never shared.
> - Easy backup and restore feature to save all the information that's important to you.
> - Trading cryptocurrencies through our partners.
> - Custom address book
> - Favorite wallets with fast syncing
> - Custom Nodes.
> - Open source software.

## Analysis 

- We were provided with the seed phrases during wallet creation.
- Multiple wallets are available, and the BTC wallet addresses can be re-generated.
- They are Open Source, with an active GitHub repository.
- This app is slated **[for verification](https://gitlab.com/walletscrutiny/walletScrutinyCom/-/issues/503)**.