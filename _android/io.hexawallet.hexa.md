---
wsId: Hexa
title: Legacy Hexa (do not download)
altTitle: 
authors:
- leo
users: 1000
appId: io.hexawallet.hexa
appCountry: 
released: 2020-03-26
updated: 2021-12-03
version: 1.7.4
stars: 3.7
ratings: 23
reviews: 14
size: 85M
website: https://hexawallet.io
repository: https://github.com/bithyve/hexa
issue: https://github.com/bithyve/hexa/issues/2544
icon: io.hexawallet.hexa.png
bugbounty: 
meta: defunct
verdict: ftbfs
date: 2021-12-29
signer: 
reviewArchive: 
twitter: HexaWallet
social: 
redirect_from:
- /io.hexawallet.hexa/
features: 

---

**Update 2021-12-29**: As the name implies, this app was deprecated by its
successor
{% include walletLink.html wallet='android/io.hexawallet.hexa2' verdict='true' %}.

The page footer on their website answers most of our questions:

> Bitcoin Only Wallet \| Best Android Bitcoin Wallet \| IOS Bitcoin Wallet \| Non
  Custodial Bitcoin Wallet \| Simple Bitcoin Wallet \| Multisig wallet \| Stack
  Sats \| Donate Bitcoin \| Bitcoin Donation \| Buy bitcoin in UK \| Crypto wallet \|
  Send bitcoin \| Beginners bitcoin wallet \| Shamir Secret Sharing Bitcoin Wallet

So it's "Non Custodial Bitcoin Wallet". There is also a
[link to their Github](https://github.com/bithyve/hexa) and while not equipped
with a FOSS license, it is public source code of a wallet.

So the build instructions looked lacking from the start as there is no word
about building the apk but only about running the app, we tried it nevertheless:

```
$ git clone https://github.com/bithyve/hexa
$ cd hexa/
$ git checkout v1.4.1
$ docker run --rm -v$PWD:/mnt --workdir=/mnt -it walletscrutiny/android bash
root@af2c99dc5b57:/mnt# apt update
root@af2c99dc5b57:/mnt# apt install curl npm rubygems -y
root@af2c99dc5b57:/mnt# curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | apt-key add -
root@af2c99dc5b57:/mnt# echo "deb https://dl.yarnpkg.com/debian/ stable main" | tee /etc/apt/sources.list.d/yarn.list
root@af2c99dc5b57:/mnt# apt update
root@af2c99dc5b57:/mnt# apt install yarn -y
root@af2c99dc5b57:/mnt# npm install npm@latest -g
root@af2c99dc5b57:/mnt# npm install -g rn-nodeify
root@af2c99dc5b57:/mnt# gem install cocoapods
...
Building native extensions. This could take a while...
ERROR:  Error installing cocoapods:
	ERROR: Failed to build gem native extension.
...
root@7a3a4f43290e:/mnt# yarn install
...
patch cocoapods
./setup.sh: 14: pod: not found
Done in 132.25s.
```

and as the above is only the good guesses out of 35 commands typed so far, this
is where we give up and consider the app **not verifiable** due to lacking build
instructions.
