---
title: "JuBiter Blade"
appId: jubiterblade
authors:
- kiwilamb
- leo
released: 2018-11-01
discontinued: # date
updated: 
version: 
dimensions: [38, 64, 2.5]
weight: 
website: https://www.jubiterwallet.com/index.html
shop: https://www.amazon.com/gp/product/B07K446Y57
company: Feitian Technologies Co.,Ltd.
companywebsite: https://www.ftsafe.com/
country: CH
price: 79USD
repository: 
issue:
icon: jubiterblade.png
bugbounty:
verdict: nosource
date: 2021-09-08
signer:
reviewArchive:


providerTwitter: JuBiterWallet
providerLinkedIn: jubiter-wallet
providerFacebook: JuBiterWallet
providerReddit: 
---

{{ page.title }} is a credit card sized device with buttons and screen that
connects via bluetooth to the companion app.

On mobile, these companion apps are
{% include walletLink.html wallet='android/com.jubiter.app' verdict='true' %}
and
{% include walletLink.html wallet='iphone/com.feitian.jubiterwallet' verdict='true' %}.

The Android app is not available since 2021-09-06 so it's not clear if they are
still in business.

Apparently there was an issue with their firmware so they
[urged people to update it](https://www.jubiterwallet.com/support/index.html#/JuBiterHelp/zh-cn/articles/cateList3-Recent%20news-004-cate004-Important%20announcement:%20Updating%20the%20XRP%20application%20in%20JuBiter%20Blade%20II%20hardware%20wallet):

> 3 days ago<br>
> ...<br>
> Therefore, please update the MISC application (version 1.0.05) in your device
  to the latest version (1.1.08) ...

"3 days ago" would be 2021-09-05 but changing our system date to August and
reloading the page gives us the same "3 days ago", so it's not clear from when
this warning or the firmware update would date.

Their [desktop companion app](https://www.jubiterwallet.com/download.html)
(available only for Windows) was last updated more than a year ago, on 2020-07-01.

Anyway, as there is no source code to be found for any part of the stack, this
product is **not verifiable**.
