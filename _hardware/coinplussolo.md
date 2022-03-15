---
title: "CoinPlus Solo"
appId: coinplussolo
authors:
- danny
released: 
discontinued: 
updated: 
version: 
binaries: 
dimensions: 
weight: 
provider: "CoinPlus"
providerWebsite: https://www.coinplus.com/en/
website: 
shop: 
country: LU
price: 
repository: 
issue: 
icon: coinplussolo.png
bugbounty: 
meta: ok
verdict: prefilled
date: 2022-03-14
signer: 
reviewArchive: 
twitter: coinplus_sa
social: 
  - https://www.linkedin.com/organization-guest/company/coinplus
  - https://www.facebook.com/coinplus.sa/
  - https://www.youtube.com/channel/UCBWhjWyzJ8MhTaP9UnqO6eQ
  - https://www.instagram.com/coinplus_solo/
---


[Here is a video](youtube.com/watch?v=qaaQREWK9IY) showing how to redeem the private key on CoinPlus Solo.

CoinPlus also has a [mobile app](https://play.google.com/store/apps/details?id=com.coinplus.mobile) that combines the two secrets to compute the private key.

[CoinPlus website has a page explaining](https://www.coinplus.com/en/content/18-security) how the wallet is supposed to keep your private key secure.

> CoinPlus involves two different companies to engrave two secrets on the product ensuring that only the buyer will have access to the private key.
>
> Each company generates a secret using a secure random number generator and derives an asymmetric key pair (public and private) from which it stores only the public key. Then each company engraves its secret on the bar and covers it with a holographic security labels ensuring its safety.
>
> By adding their two ECC public key, the companies can compute a common public key that will be used to generate the BTC/ETH/XRP/LTC/XTZ/BCH address or a PEM/GPG public key of the product. The private key corresponding to the common public key is unknown to both companies and only the end user using the two secrets engraved on the product is able to regenerate this private key.
>
> CoinPlus published the source code for the re-computation of the private key on github under the MIT license. The flaws of process-based solution is easier to identify and to migitage compare to an electronic solution.
>
> Currently, the process works with two companies that create 2 different secrets. But to make it even stronger, other actors could very well get involved in the creation process. We deliver trust because our solution is based on mathematics and not on proprietary technology, which means that everyone can verify the algorithms.

The "Partners" page on the CoinPlus website names two companies, [Simplex](https://www.simplex.com/) and [SELP.](https://www.selp.fr/en/home/)

CoinPlus' GitHub page has a repository titled ["CoinPlus Solo Redeem"](https://github.com/coinplus-sa/coinplus-solo-redeem)

The GitHub description states that it is:

> Python code to retrieve the private key from your Coinplus Solo

As the cards are **prefilled** it means the user still has to trust that the companies behind it do not have a way to take a copy. 
