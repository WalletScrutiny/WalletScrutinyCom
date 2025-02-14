---
title: CoinPlus Solo
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
provider: CoinPlus
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
appHashes: 
date: '2022-03-23'
signer: 
reviewArchive: 
twitter: coinplus_sa
social:
- https://www.linkedin.com/organization-guest/company/coinplus
- https://www.facebook.com/coinplus.sa/
- https://www.youtube.com/channel/UCBWhjWyzJ8MhTaP9UnqO6eQ
- https://www.instagram.com/coinplus_solo/
features: 

---

[Here is a video](https://youtube.com/watch?v=qaaQREWK9IY) showing how to redeem the private key on CoinPlus Solo.

CoinPlus also has a [mobile app](https://play.google.com/store/apps/details?id=com.coinplus.mobile) that combines the two secrets to compute the private key.

The two secrets are two printed strings printed on the same card by two different entities. These are initially covered and ideally, can only be known by the user when he is in possession of the card. The two are then entered into a program which then converts the two into a private key.

> CoinPlus involves two different companies to engrave two secrets on the product ensuring that only the buyer will have access to the private key.

[CoinPlus website has a page explaining](https://www.coinplus.com/en/content/18-security) how the wallet is supposed to keep your private key secure. 

> Each company generates a secret using a secure random number generator and derives an asymmetric key pair (public and private) from which it stores only the public key. Then each company engraves its secret on the bar and covers it with a holographic security labels ensuring its safety.
>
> By adding their two ECC public key, the companies can compute a common public key that will be used to generate the BTC/ETH/XRP/LTC/XTZ/BCH address or a PEM/GPG public key of the product. The private key corresponding to the common public key is unknown to both companies and only the end user using the two secrets engraved on the product is able to regenerate this private key.
>
> CoinPlus published the source code for the re-computation of the private key on github under the MIT license. The flaws of process-based solution is easier to identify and to migitage compare to an electronic solution.
>
> Currently, the process works with two companies that create 2 different secrets. But to make it even stronger, other actors could very well get involved in the creation process. We deliver trust because our solution is based on mathematics and not on proprietary technology, which means that everyone can verify the algorithms.

## SOLO Card Pro

The SOLO Card Pro is a more sophisticated solution in that it employs multiple cards thereby creating a 2 out of 3, multi-sig solution.

From its description [on eBay:](https://www.ebay.ca/itm/153654236151?mkevt=1&mkcid=1&mkrid=706-53473-19255-0&campid=5338722076&customid=&toolid=10050)

> The CoinPlus SOLO PRO Card BTC is a set of 3 laser engraved plastic cards for short and medium term use. 
>
> These affordable and secure cards are designed for professionals and individuals, resistant to water and hackers. The SOLO PRO card comes in the form of 3 credit cards.
>
> The 6 different secrets are engraved on the back of the 3 cards and hidden by 2 security labels for each card marked "secret 1" or "secret 2".
>
> The cards contain an NFC chip and a QR Code that allow two things, the storage of the SOLO's public address, and the redirection to any url that is encoded at the beginning of the cards. Secrets are not present in the NFC chip or QR Code. 
>
> These functions do not allow you to make withdrawals or payments from the SOLO, but allow you to share the SOLO public address quickly and easily.https://www.coinplus.com/en/17-solo-bar

On how to "calculate the private key:"

> Only 2 of the 3 cards are required to calculate the private key. The cardholder discovers Secret 1 and 2 of at least 2 cards, then recalculates the private key. The private key can be redialed using the CoinPlus application offline or on gituhub/coinplus.sa.

## SOLO Bar

The Solo Bar is quite similar to the CoinPlus Solo with the exception that the keys are on a bar. [Its description](https://www.coinplus.com/en/17-solo-bar):

> SOLO Bars made of non-precious metal are bars imported from China with the only elements present being the boundaries of the areas in which secrets 1 and 2 will be engraved, the public address and the serial number of the bar. Once received, the bars are checked and stored.
>
> Your SOLO Bar is an elegant ingot presented in its luxury case. Your SOLO Bar comes with its certificate of authenticity. Your public address is present on the ingot and on the certificate by scanning the QR code. Your SOLO Bar will be valid for a hundred years. Place it safely in a safe

The [manufacturing process](https://www.coinplus.com/en/content/11-manufacturing) is described:

> Once the product has been manufactured and delivered to Coinplus. The registration process for cryptographic codes remains to be followed. This process is described in the ‘patent’ section.

The [patent](https://patent.public.lu/fo-eregister-view/search/details/LU100497_NP/0/0/1/10/0/0/0/null_null/KG51bW1lcjooTFUxMDA0OTcpKSBBTkQgcGF0ZW50UmVjb3JkU2VxOjE=#) was registered in Luxembourg, however it was taken off the page of CoinPlus.


The "Partners" page on the CoinPlus website names two companies, [Simplex](https://www.simplex.com/) and [SELP.](https://www.selp.fr/en/home/)


CoinPlus' GitHub page has a repository titled ["CoinPlus Solo Redeem"](https://github.com/coinplus-sa/coinplus-solo-redeem)

The GitHub description states that it is:

> Python code to retrieve the private key from your Coinplus Solo


As quoted above, the provider states that since "CoinPlus involves two different companies to engrave two secrets on the product that ensures only the buyer will have access to the private key." However

* the user still has to trust that the *two* companies behind it do not collude to combine the keys they respectively generate.
* Tamper-evident stickers are not a big challenge for motivated hackers. The company second to print on the cards could probably get around destroying the sticker to gain knowledge of the firstly printed keys.
* Judging by photos provided, both companies use the same type of stickers, so removing and re-applying sticker is trivial.
* Peeking below the sticker is a problem for the entire supply chain after the second key was printed.
