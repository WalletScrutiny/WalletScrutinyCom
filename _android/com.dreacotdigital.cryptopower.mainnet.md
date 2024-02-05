---
wsId: 
title: Cryptopower Wallet
altTitle: 
authors: 
- danny
users: 10
appId: com.dreacotdigital.cryptopower.mainnet
appCountry: 
released: Jan 20, 2024
updated: 2024-01-31
version: 1.1.0
stars: 
ratings: 
reviews: 
website: https://cryptopower.dev/
repository: https://github.com/crypto-power/cryptopower/releases
issue: https://github.com/crypto-power/cryptopower/issues/448
icon: com.dreacotdigital.cryptopower.mainnet.png
bugbounty: 
meta: ok
verdict: wip
date: 2024-02-05
signer: 
reviewArchive: 
twitter: 
social: 
redirect_from: 
developerName: Dreacot Digital Limited
features: 

---

## App Description

> Cryptopower is a self-custodial multi-coin wallet application designed for both desktop and mobile platforms. It offers support for creating wallets not only for Decred but also for other cryptocurrencies such as Bitcoin and Litecoin. The app is built using Gio, a Golang library for the implementation of cross-platform user interfaces.

## The App

Crytopower allows you to choose between resoring an existing wallet or creating a new one. Upon creating one, you are given a 33-word seed phrase. Functions such as sending and receiving transactions require that the wallet must first sync with "block headers." This appears to be a self-custodial wallet.

The source code was available on GitHub. 

I tried building the app but failed with error:

```
# gogio -target android .

gogio: go build -ldflags=-w -s -X gioui.org/app.ID=com.github.cryptopower -X gioui.org/app/internal/log.appID=com.github.cryptopower -buildmode=c-shared -tags  -o /tmp/gogio-3943281878/jni/x86_64/libgio.so . 

failed: libwallet/instantswap/instantswap.go:27:12: pattern instant.json: no matching files found

root@3f24c929af86:/workspace/cryptopower# 
root@3f24c929af86:/workspace/cryptopower# ls
LICENSE    app		appos	   dexc  go.mod  how-to-build-mobile.md  log.go  main.go		 reproduciblebuilds  ui
README.md  appicon.png	config.go  docs  go.sum  libwallet		 logger  reproducible_builds.sh  run_tests.sh	     version
```