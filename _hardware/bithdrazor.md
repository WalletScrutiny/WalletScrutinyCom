---
title: "BITHD Razor"
appId: bithdrazor
authors:
- kiwilamb
- danny
released: 2018-01-01
discontinued: # date
updated:
version:
dimensions: [83, 51, 2.2]
weight: 18
website: https://bithd.com/BITHD-Razor.html
shop: https://bithd.com/BITHD-Razor.html
company: BitHD
companywebsite: https://bithd.com
country: CH
price: 
repository: https://github.com/bithd
issue:
icon: bithdrazor.png
bugbounty:
verdict: wip
date: 2021-07-16
signer:
reviewArchive:


providerTwitter: 
providerLinkedIn: 
providerFacebook: 
providerReddit: 
---


## Private keys can be created offline - ✔️

The [BitHD](https://bithd.com/BITHD-Razor.html) homepage affirms that the private keys are created offline. 

The process goes as follows: 

The BitHD Razor is paired with the BitPie app through bluetooth which can be downloaded on [their website.](https://bitpie.com/android/) and on Google Play.

- {% include walletLink.html wallet='android/com.bitpie' verdict='true' %}

The device then displays the seed phrases.

([Source: video](https://www.youtube.com/watch?v=nGm4_umShlg))

## Private keys are not shared - ✔️

The device has a security seal that displays the word VOID once opened. Since the device has to be paired with the user's app prior to seed generation, we can assume that the manufacturer will not have access to these.  

## Device displays receive address for confirmation - ✔️

Yes. This can be corroborated in the [official documentation](https://docs.bithd.com/en/latest/razor/sendandreceive.html) page on sending and receiving coins.

Note that most of the interaction is done via the BitPie app on the phone. 

## Interface - ✔️

The device has a 128*64 OLED display and two buttons. The display is used to:

1. Confirm transactions
2. Display the seed words 

## Reproducibility

BitHD has other hardware wallets:

{% include walletLink.html wallet='hardware/bithdwatch1' verdict='true' %}<br>
{% include walletLink.html wallet='hardware/bithdwatch2' verdict='true' %}

It claims to have forked from {% include walletLink.html wallet='hardware/trezorOne' verdict='true' %} and this is evident in their [GitHub repository page](https://github.com/bithd?tab=repositories).



