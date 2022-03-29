---
wsId: Nuri
title: Nuri - Mobile Banking & Crypto
altTitle: 
authors:
- danny
users: 100000
appId: com.bitwala.app
appCountry: gd
released: 2019-07-11
updated: 2022-03-24
version: 2.3.22
stars: 3.8
ratings: 4416
reviews: 2882
size: 91M
website: https://www.nuri.com
repository: 
issue: 
icon: com.bitwala.app.png
bugbounty: 
meta: ok
verdict: nosource
date: 2021-12-22
signer: 
reviewArchive: 
twitter: nuribanking
social: 
redirect_from: 

---

{% include review/bitgo.md %}

## Updated Review and Verdict 2021-12-22

The non-custodial portion of the Nuri Banking app called the "[Nuri Vault](https://support.nuri.com/hc/en-gb/articles/360021669460-How-to-create-a-Nuri-vault-)" requires that users agree to a separate agreement with BitGo, Inc.

> The customer will enter into a separate agreement on the management of the private keys for the customer's cryptocurrencies stored in a non-custodial Bitcoin wallet (the "Bitcoin Vault"). The sole parties to the latter agreement will be the customer and BitGo, Inc. ("BitGo"). The legal relationship between the investor and BitGo will be exclusively governed by the contractual terms, in particular, BitGo's general terms and conditions , as amended from time to time ("BitGo Terms of Use"). 

**[The BitGo Terms and Conditions:](https://www.bitgo.com/legal/terms-of-use/)**

> Section 1.1
>
> The Service requires three private cryptographic keys to be associated with each bitcoin account and BitGo controls only one of these private keys. Two of the three private keys associated with a bitcoin wallet are needed to effect a “transfer” of bitcoin from a bitcoin account (i.e., disassociate bitcoin from one bitcoin wallet and re-associate bitcoin with another bitcoin wallet).
>
> Section 2.3
>
> We reserve the right, to temporarily suspend or terminate your access to the Service at any time in our sole discretion, with or without cause, and with or without notice, without incurring liability of any kind.

We conversed with Nuri via [twitter](https://twitter.com/NuriBanking/status/1430868739625529347). We were only able to get a substantial reply via email. Here is an excerpt:

> In our view, the BitGo wallets are still non-custodial. 
As stated in the BitGo T&Cs, their service "requires three private cryptographic keys to be associated with each bitcoin account and BitGo controls only one of these private keys".
Two of the three private keys associated with a bitcoin wallet are needed to effect a “transfer” of bitcoin from a bitcoin account (i.e., disassociate bitcoin from one bitcoin wallet and re-associate bitcoin with another bitcoin wallet). This means the BitGo private key is not needed to effect a transfer of crypto currencies.
--> So irrespective of whether BitGo has suspended or terminated access to a wallet, a user can still restore the crypto standing to the account of a BitGo wallet with the other two private cryptographic keys. If you need further information how such recovery would work, please do not hesitate to ask us.

Nuri was known as bitwala prior to its re-launch. When it [re-launched in 2018](https://en.wikipedia.org/wiki/Bitwala) as Nuri, its app and web properties also adjusted to the regulatory climate at the time. This may be the reason why Nuri identifies its [GitHub repository as "Nuri (formerly bitwala)"](https://github.com/orgs/bitwala/repositories). This is a crucial clue as Nuri does not claim to be an open source project. 

Rather, despite termination provisions in its third party provider's Terms and Conditions, [it links to a way to recover the user's Vault by linking to BitGo's recovery application](https://support.nuri.com/hc/en-gb/articles/360000988999-How-to-recover-my-Bitcoin-vault-).

We were only able to locate the [BitGo recovery application on GitHub](https://github.com/BitGo/wallet-recovery-wizard/releases), and believe that the Nuri app's source code is not publicly available.


## Previous Review 2021-08-27

From the site description:

> Nuri is the app to manage, save and grow your money. Invest in cryptocurrencies, create savings plans & earn up to 5% interest per year on bitcoin directly from a German bank account.

The app is complicated as it offers both custodial and non-custodial wallets. 

It identifies its non-custodial wallets as ["Vaults"](https://nuri.com/how-to/wallet/)

> The Bitcoin (BTC) VAult is available on both web and mobile devices and is a multi-signature non-custodial wallet. A multi-signature protocol, available for Bitcoin acts as a built-in additional security factor. The wallet is backed up with two seed phrases, which let you recover and access your bitcoin in case you lose access to your Nuri account. Under no circumstances, Nuri or anyone else can access or control your funds or transactions.

More information on the distinction between [Nuri Wallets vs Vaults](https://support.nuri.com/hc/en-gb/articles/360022033460-Wallets-Vaults-What-s-the-difference-)

Nuri also has a [risk and disclosure page](https://nuri.com/uploads/Nuri_Bitcoin_Interest_Account_Risk_Warning_EN_b93582385c.pdf)

> Investors cannot verify whether Celsius Network conducts business activities that will enable it to service the claims of investors from the Bitcoin Interest Account in the future.The business activities carried out by Celsius Network may result in further risks for Nuri investors.

[Identity Verification Criteria](https://support.nuri.com/hc/en-gb/articles/360021577139-What-are-the-verification-criteria-)

> Nuri offers the blockchain banking solution for European residents.

> Resident in the European Union, A valid passport or ID card that contains the required security features, minimum age 18 years,
a proof of address document (POA), in order for the account to be opened successfully, this data is verified during a video call with our partner IDnow.

