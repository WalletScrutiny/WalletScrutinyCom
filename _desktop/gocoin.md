---
title: Gocoin
appId: gocoin
authors:
- danny
released: 2016-04-06
discontinued: 
updated: 2025-03-23
version: 1.10.4
binaries: 
provider:  Piotr Narewski
providerWebsite: 
website: https://gocoin.pl/gocoin_manual_wallet.html
repository: https://github.com/piotrnar/gocoin
issue: 
icon: gocoin.png
bugbounty: 
meta: ok
verdict: diy
date: 2025-04-25
twitter: 
social: 
features: 

---

## App Description 

Gocoin describes itself as: 

> Gocoin is a full Bitcoin solution written in Go language (golang).

Binaries for Windows, macOS and Linux are available. We tested the Linux variant. Once unpacked, there are at least 2 executables in the root directory: client and wallet. 

**Client** as described in the [repository:](https://github.com/piotrnar/gocoin#about-gocoin)

> The client (p2p node) is an application independent from the wallet. It keeps the entire UTXO set in RAM, providing an instant access to all its records and - in consequece - an extraordinary blochchain processing performance.

This might explain the computer slowdown. The LLM estimates that 32GB would be needed, we only had 16GB. As of 2025-04-25, there are 181.99 million UTXO's in the Bitcoin blockchain. 

**Wallet** 

> The wallet is designed to be used offline. It is deterministic and password seeded. As long as you remember the password, you do not need any backups ever. Wallet can be used without the client, but with the provided balio tool instead.

To get it to show the seedphrases, we invoke:

> dannybuntu@MS-7978:~/Downloads/gocoin-1.10.4-linux-amd64$ ./wallet -type=4 -bip39=12 -words
>
> Gocoin Wallet version 1.10.4
> This program comes with ABSOLUTELY NO WARRANTY
>
> Using config file wallet.cfg
> BIP39: only mom reform weather lunch lawsuit desk employ useless audit gather nice

Show the wallet addresses:

> dannybuntu@MS-7978:~/Downloads/gocoin-1.10.4-linux-amd64$ ./wallet -l\
> Gocoin Wallet version 1.10.4\
> This program comes with ABSOLUTELY NO WARRANTY
> 
> Using config file wallet.cfg
>
> 1FbzEUNPPUoiSPAoNCqiWf9rYZmZyDE7Nt TypC 1\
> 1Kd31dxUv5hzYcv9rrE6LMDakGpm2FrXL5 TypC 2\
> 1FfKeQ4t1GGmDCW4UnDTaPynkFNao9vckR TypC 3\
> 1GsNnNDsVg8m5oqfh4imbpP3qpTCKjw2Wa TypC 4\
> 1DaTPKEJzDd6yAS3bGwknyCvfLbiz75DhP TypC 5\
> 1CzY8KC6nKAbfeRjQj1xZGcDCB4A6MWrBU TypC 6

There are currently binaries distributed through their releases, but the developers still recommend building from source, for the latest versions. As such, this can still be considered as a **do-it-yourself** project. 