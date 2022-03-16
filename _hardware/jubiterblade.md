---
title: "JuBiter Blade"
appId: jubiterblade
authors:
- kiwilamb
- leo
released: 2018-11-01
discontinued: 
updated: 
version: 
binaries: 
dimensions: [38, 64, 2.5]
weight: 
provider: "Feitian Technologies Co.,Ltd."
providerWebsite: https://www.ftsafe.com/
website: https://www.jubiterwallet.com/index.html
shop: https://www.amazon.com/gp/product/B07K446Y57
country: CN
price: 79USD
repository: 
issue: 
icon: jubiterblade.png
bugbounty: 
meta: ok
verdict: nosource
date: 2021-12-12
signer: 
reviewArchive: 
twitter: JuBiterWallet
social: 
- https://www.linkedin.com/company/jubiter-wallet
- https://www.facebook.com/JuBiterWallet
- https://github.com/JubiterWallet
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

Anyway, as there is no hardware wallet source code to be found, this
product is **not verifiable**.
