---
wsId: 
title: BISPEX(비스펙스)
altTitle: 
authors:
- danny
users: 1000
appId: com.bispex.bispex
appCountry: 
released: 2019-12-04
updated: 2020-04-14
version: 1.1.1
stars: 4.3
ratings: 
reviews: 
website: https://www.bispex.com/
repository: 
issue: 
icon: com.bispex.bispex.png
bugbounty: 
meta: removed
verdict: custodial
appHashes: 
date: 2024-09-25
signer: 
reviewArchive: 
twitter: 
social: 
redirect_from: 
developerName: bispex
features: 

---

## App Description from Google Play 

> Bispex mobile application provides cryptocurrency trading services such as coin trading, indefinite contract, insurance trading, and asset management and withdrawal services that are linked to them.
Bispex also has its own coin BPX optimized for various trade mining services with its own blockchain technology.

### Terms 

> 6. “BISPEX Wallet” means a cryptocurrency wallet used to store cryptocurrency associated with a BISPEX user's BISPEX ID. Users can exchange cryptocurrency with an “external cryptocurrency address” through the “BISPEX Wallet”.
>
> The company's wallet can only be used by users who have registered an account with their own information. The company reserves the right to suspend or close the account and wallet if it is used by another person's account.
> 
> The trader can create an account and wallet in BISPEX, deposit the cryptocurrency before the transaction and proceed with the transaction. In addition, you may request the withdrawal of cryptocurrency in accordance with the restrictions set forth in the Terms.

## Analysis 

- [(Screenshots)](https://twitter.com/BitcoinWalletz/status/1656905209678036993)
- This is a cryptocurrency exchange 
- We were able to find an option to deposit/withdraw BTC option on the platform 
- We were not able to locate the option for backing up the private keys.
- As the terms suggests, the wallet of the user is tied to the BISPEX account. Withdrawals also need the "request" of users. These are the hallmarks of a **custodial provider.**
- Custodial services are permissioned services, hence, another proof that this is custodial is that when we tried to deposit BTC, it showed an error: 

> Service Error!
>
> [74006] Temporary error creating wallet. Please try again later. (Trcode: 77623)
>
> Temporarily Suspended
>
> - BTC deposit feature has been suspended
> - Apologies for the inconvenience caused
>
> We will try to resume the feature as soon as possible.

If this were a self-custodial app, the wallet address would be available and no provider can **suspend** it.