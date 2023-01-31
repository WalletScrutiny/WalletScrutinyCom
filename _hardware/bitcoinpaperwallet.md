---
title: BitcoinPaperWallet.com
appId: bitcoinpaperwallet
authors:
- danny
released: 2013-04-14
discontinued: 
updated: 2017-09-22
version: 
binaries: 
dimensions: 
weight: 
provider: 
providerWebsite: 
website: https://bitcoinpaperwallet.com/
shop: 
country: 
price: 
repository: https://github.com/cantonbecker/bitcoinpaperwallet
issue: 
icon: bitcoinpaperwallet.png
bugbounty: 
meta: ok
verdict: plainkey
date: 2022-05-04
signer: 
reviewArchive: 
twitter: 
social: 
features: 

---

## Background 

Originally started by [Canton Becker](https://github.com/cantonbecker/) in 2013, bitcoinpaperwallet used the same code as [bitaddress.org](https://github.com/pointbiz/bitaddress.org). Becker sold it to an unknown buyer in 2018. This has generated some [controversy and warnings](https://www.reddit.com/r/Bitcoin/comments/gl6v7d/vulnerability_discovered_on_bitcoinpaperwalletcom/fqvpo7v/).

The site allowed users to generate public and private key pairs through the website. Users can save a copy of the website and run it on an offline computer. It supports BIP38 and users can put an encrypted password to make the private key more secure. 

Users can also order a "kit" which included a custom Ubuntu Live CD with the {{ page.title }} software, some printing medium and stickers. 

## Analysis 

The site goes to great lengths to explain to the user the risks involved with this approach: 

> The advantage with BIP38 is that if your paper wallet is stolen or compromised, the private key cannot be recovered without your password. Even a very short password adds a strong degree of protection. However, if you encrypt your private key with BIP38 and you lose your password, it will be impossible for you to recover the funds you have sent to this wallet.
>
Also, note that not all Bitcoin wallet applications or web services are able to import or "sweep" BIP38 encrypted keys. In this case, you will have to use the Validate or Decrypt feature on this webpage to reveal the unencrypted Wallet Import Format (WIF) key as an intermediate step before sweeping the balance.
>
WARNING: Before sending any funds to a BIP38-encrypted wallet, first do a test make sure you are able to decrypt the printed private key back to ordinary WIF format.
>
Unless you have a strong understanding of the BIP38 encryption and decryption workflow, click cancel, print your paper wallet without BIP38, and just keep it safe and hidden like you would jewels or cash.

The new owner of the site is unknown. It is possible that the code that generates the key pairs [may be compromised](https://np.reddit.com/r/Bitcoin/comments/6ss91w/seriously_how_are_you_all_generating_your_private/dlf4uhr/). 

Users can order remastered Ubuntu 14.04.1 Live CDs with the code, but we were not able to locate the repository for this remastered version. There's a certain level of trust that is placed towards the anonymous online vendor. 

Finally, once a user is able to run the software in an offline environment, the risk is always there in **leaking the keys during print or later use of the paper wallet**. 