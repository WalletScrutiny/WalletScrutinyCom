---
wsId: 
title: Blixt Wallet
altTitle: 
authors:
- leo
users: 1000
appId: com.blixtwallet
appCountry: 
released: 
updated: 2023-01-21
version: VARY
stars: 
ratings: 
reviews: 
size: 
website: https://blixtwallet.github.io
repository: https://github.com/hsjoberg/blixt-wallet
issue: https://github.com/hsjoberg/blixt-wallet/issues/318
icon: com.blixtwallet.png
bugbounty: 
meta: ok
verdict: nonverifiable
date: 2022-02-07
signer: 
reviewArchive: 
twitter: BlixtWallet
social: 
redirect_from: 

---

**Update 2022-02-07**: This wallet recently reached 1000 downloads on Play
Store, so now it's time to see if it reproducible ...
See "Code and Reproducibility" below ...

So we got a support request from somebody who put money into this lightning wallet
and the channel instantly closed but days later he didn't have his money back.
Communications with the provider were not helpful neither.

The force-close transaction had a timelock as is normal in lightning - only weird
thing was the timelock allows to **spend after ... 1987**.

A lightning network force close is when one of the parties in a channel publishes
a channel state without crafting a closing transaction with the counter party
first. As this might happen in bad faith, the counter party is then supposed to
have time to publish a punishment transaction, so this timelock should lay in
the future, not some past at which there wasn't any bitcoin yet. In summary, this
transaction looks like a poorly implemented LN wallet. The transaction also had
five outputs which is indicative of affecting more than two parties like in a
**custodial wallet**?

On the Play Store description they claim (full description):

> Blixt Wallet is a non-custodial open-source Bitcoin Lightning Wallet for
  Android with focus on usability and user experience, powered by lnd and
  Neutrino SPV.

The app is also available for iPhone only via testflight though.

{{ page.title }}'s main developer is
[Hampus Sjöberg](https://twitter.com/hampus_s)
who is well connected in Bitcoin Twitter.

According to the website:

> Blixt Wallet is built as an MIT-licensed open-source project.

So next we would have to see if this app is reproducible. We will look into that
once the app gained some more traction.

# Code and Reproducibility

[This app's code](https://github.com/hsjoberg/blixt-wallet) is public and MIT
licensed. Their
[Build Steps for Android](https://github.com/hsjoberg/blixt-wallet#android) are:

> - Install [Node](https://nodejs.org), [Yarn](https://classic.yarnpkg.com) and
    [Android Studio + Android SDK (including NDK)](https://developer.android.com/studio/)
> - If needed, install an emulated android device inside Android Studio
> - Download lnd binary from
    [from the latest Blixt Wallet release](https://github.com/hsjoberg/blixt-wallet/releases)
    and put it in `android/lndmobile`. Alternatively build lnd for Android by
    following the steps in [build-android-aar.md](build-android-aar.md)
> - Get the tor sub-module: `git submodule update --init`
> - Install Node packages: `yarn`
> - Compile the Tor Android lib: `yarn build-tor-lib`
> - Generate proto files: `yarn gen-proto`
> 
> To start the application:
> - Run: `yarn start-metro`
> - Run: `yarn android:mainnet-debug` or `yarn android:testnet-debug`

There is two problems with this.

1. There is no instructions to actually **build** the release file. Only
   instructions to **start** the debug version.
1. We need an lnd binary. So while that can be built from source, there is no
   pinning of the right version to build. Also the compilation of lnd requires
   editing "line 47 of `mobile/gen_bindings.sh`"?

We could maybe guess our way around these issues but this should really be
better documented for smooth build reproduction.

Emanuel already tried to reproduce this app and
[his issue](https://github.com/hsjoberg/blixt-wallet/issues/318) is still open.
So while this app can be compiled from source, the compilation result differs
from what he got from Google play. This app is currently **not verifiable**.
