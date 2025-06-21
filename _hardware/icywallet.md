---
title: Icy Wallet
appId: icywallet
authors:
- danny
released: 
discontinued: 
updated: 
version: 
binaries: 
dimensions: 
weight: 
provider: NeatNik LLC (Adam Newbold)
providerWebsite: 
website: https://web.archive.org/web/20180107060156/https://icywallet.com/
shop: 
country: US
price: 
repository: https://web.archive.org/web/20201113132658/https://github.com/neatnik/icywallet
issue: 
icon: icywallet.png
bugbounty: 
meta: ok
verdict: vapor
appHashes: 
date: 2022-04-27
signer: 
twitter: neatnikllc
social: 
features: 

---

## Product Description 

> IcyWallet is a Bitcoin cold storage wallet that doesn’t require sight. It aims to be the simplest and most secure Bitcoin cold storage solution with a total emphasis on accessibility. Just plug in headphones and a keyboard, or a refreshable braille display, and get going.

From the [IcyWallet GitHub page archive](https://web.archive.org/web/20180107060156/https://icywallet.com/): 

> IcyWallet is a cold storage solution, emphasizing safe storage of Bitcoin in the most accessible way possible.
>
> The IcyWallet software is designed to run on a Raspberry Pi, specifically one that will never be connected to the internet (a so-called air gapped device). In theory you could run the software on anything, but the Pi is the intended use case. IcyWallet will securely generate private keys and store them on the device, and issue a mnemonic seed for safe and convenient backup.
>
> Spending from IcyWallet isn’t as simple as using a hot wallet, but the process is a reflection of the secure nature of an air gapped setup. To spend coins stored in IcyWallet, the transaction must first be generated on a separate computer connected to the internet (defining how many coins to send, where to send them, and the fee to be used). That transaction is then read by IcyWallet (via USB) and signed with your private key. Finally, the signed transaction can be broadcast from the other internet-connected computer.

The project has been hailed as a display of Bitcoin's inclusivity. This followed Adam Newbold's initial foray into transcribing the [Bitcoin Whitepaper into Braille](https://github.com/neatnik/braille-bitcoin-whitepaper). At the time, the features were: 

> - 100% free and open source
- Boots directly into the wallet app with functioning audio and braille support (via BRLTTY)
- All interactions designed to create the best possible accessible experience
- Generates hierarchical deterministic wallets with mnemonic seeds for safe backup
- Generates SegWit addresses

## Progress

| Item                                      | Status   | Notes                          | Updated    |
| Wallet generation                         | Complete |                                | 2017-11-21 |
| Mnemonic backup seed process              | Complete |                                | 2017-12-23 |
| Speech synthesis process                  | Complete | Combined with localization     | 2017-11-25 |
| Language localization process             | Complete | Combined with speech synthesis | 2017-11-25 |
| Config: Language                          | 10%      |                                | 2017-11-26 |
| Config: Voice speed                       | 10%      |                                | 2017-11-26 |
| Config: Refreshable braille display model | Pending  |                                |            |
| Fee estimation                            | Pending  |                                |            |
| Data movement process                     | Pending  |                                |            |
| Transaction signing                       | Pending  |                                |            |
| Upgrade process                           | Pending  |                                |            |

The last Github post was made on [September 14, 2018](https://web.archive.org/web/20201113132711/https://github.com/neatnik/icywallet/issues/1#issuecomment-421222244). Newbold was optimistic and noted a lot of to-do items. There were no updates after that.

## Verdict 

We [reached out to Adam on twitter](https://twitter.com/BitcoinWalletz/status/1512366804437405702) to ask why the **Github page was deleted** and the project discontinued. ~~While we await his reply~~. 

Adam replied: 

<blockquote class="twitter-tweet"><p lang="en" dir="ltr">I couldn&#39;t develop it safely (to the kind of high standards that I&#39;d expect for a hardware wallet) and ultimately had to give up on the project. There wasn&#39;t any useful code in the repo, so no great loss. I hope someone else is able to eventually offer this.</p>&mdash; Neatnik (@neatnikllc) <a href="https://twitter.com/neatnikllc/status/1512640391123722240?ref_src=twsrc%5Etfw">April 9, 2022</a></blockquote> <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>

With that said, our initial impression got confirmed: this project is **vaporware**.
