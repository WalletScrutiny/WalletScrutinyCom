---
title: BitNotes
appId: bitnotes
authors:
- danny
released: 2016-09-29
discontinued: 
updated: 
version: 
binaries: 
dimensions: 
weight: 
provider: BitNotes.org (Petr Sobotka) / SOLI.CZ s.r.o.
providerWebsite: http://www.petrsobotka.cz/
website: https://web.archive.org/web/20210301132933/http://www.bitnotes.org/
shop: 
country: CZ
price: 
repository: 
issue: 
icon: bitnotes.png
bugbounty: 
meta: ok
verdict: vapor
date: 2022-04-29
signer: 
reviewArchive: 
twitter: bitnotesorg
social:
- https://www.facebook.com/Icynote-100908298821873
features: 

---

## Product Description 

From [Bitcointalk](https://bitcointalk.org/index.php?topic=1643021.0): 

Bitnotes are:

> - multisig paper wallets
- distributed empty as sheets of 3 notes
- one key is under a tamper-evident scratch-off seal
- second key is added by the customer
- additional digital sig issued by the manufacturer is present if properly issued and backed
>
> Keep it as a cold storage or pay with it. Verify it offline using a mobile app (not yet ready).

Read the [Bitnotes.org whitepaper](https://web.archive.org/web/20191104114703/http://www.bitnotes.org/bitnotes.pdf)<br />
More [pictures](https://imgur.com/gallery/jZfMD) 

## How it works

From the [bitnotes.org archive](https://web.archive.org/web/20210301132933/http://www.bitnotes.org/)

### Issuance

> We provide one key – secured by tamper–evident technology. You provide the second key, the quality of which is up to you.
>
> You charge the resulting 2‐of‐2 multisig address with bitcoins.
>
> The final item is our digital signature, which we generate to confirm that the banknote is genuine and successfully loaded.
>
> Print it on a sheet of BitNotes.
> 
> We act as a trusted authority, but we can't touch your bitcoins.

### Payment 

> While paying, anyone with an appropriate mobile app can verify the digital signature, even if in the offline mode.
>
> Then visually compare the serial number and check the other security elements – similarly to when accepting a banknote.

### Redemption 

> Any holder can scratch the tamper–evident field, scan both QR codes and redeem bitcoins.
>
> Whenever you fear that the backing bitcoins might be endangered, just scratch the field and make a reissuance using your own keys and a new sheet of BitNotes. Or simply redeem the bitcoins and keep them in your electronic wallet.

## Analysis    

The attempt to create the paper equivalent of Bitcoin has seen its share of trials. So far, we've cataloged: 

- {% include walletLink.html wallet='bearer/icynote' verdict='true' %} 
- {% include walletLink.html wallet='bearer/polymerbit' verdict='true' %}
- {% include walletLink.html wallet='bearer/kongcash' verdict='true' %}

Even if the issuers use a multi-sig setup where the user can provide their own key, they still create the conundrum of being a centralized issuer. 

The stated objective for the bitnotes is to come up with a paper solution backed by bitcoins to be used as a medium for exchange. In this regard, it would be difficult to implement for a variety of factors including usability. Moreover, as a centralized issuer, this makes the bitnotes reliant on a trusted third party. 

Verification is also done through an app which we were not able to locate. 

Suffice to say, these difficulties made the project infeasible. This could be the reason why this project **does not exist anymore**. 


 