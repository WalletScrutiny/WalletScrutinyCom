---
title: Dorj One Plus
appId: dorj.one.plus
authors:
- danny
released: 
discontinued: 
updated: 
version: 
binaries: 
dimensions:
weight: 
provider: 
providerWebsite: 
website: https://mydorj.com/
shop: https://dorj.io/product/dorjoneplus/
country: IR
price: 
repository: 
issue: 
icon: dorj.one.plus.png
bugbounty: 
meta: ok
verdict: nosource
date: 2023-04-06
signer: 
reviewArchive: 
twitter: dorjwa
social: 
- https://t.me/dorjwa
---

## Product Description taken from the Dorj homepage

*Note: This was translated from Persian using Google Translate, some segments don't make sense so there were some portions that were heavily editorialized 
according to how we understood it. Some errors may be present.

### What's in the Box 

> - 1x Dorj Model One Plus device
> - 1x Micro USB cable
> - 2x Recovery seed card
> - Dorj, Bitcoin, and ETH stickers

### Further information 

> The Dorj One Plus supports the ERC20 and BEP20 platforms and supports more than 1,500 currencies.
>
> Trezor.io/coins is a list of support currencies 
> 
> Features of - Dorj One Plus
> - Touch buttons
> - Beautiful look
> - Supports Bainens and Atrium and Polygon and Arbitrage 
> - Connect to decentralized exchanges such as (uniswap , pancake swap)
> - Advanced Private Key (passphrase)
> - Connect to Metamask
> - Defi support
> - Hide IP
> - Privacy and non-sanctioning
> - Ability to check private key words with advanced algorithm
> - There is no pre-installed software on the One Plus so that you can install the software with complete security and receive your private key.
> - By setting the advanced private keypassphraseMake sure there are no private keys to other people  

## Analysis 

Like the {% include walletLink.html wallet='hardware/dorj.one' %}, we had some difficulty translating this, but overall some basic premises were assumed: 

- It uses the {% include walletLink.html wallet='hardware/trezorOne' %} software. We just don't know which specific code they're using. 

We engaged in what we believe to be the Dorj TG channel. Here's a copy of the conversation: 

> Dorj, [4/6/23 3:21 PM]
> سلام هر سوالی هست بفرمایید
>
> Dorj, [4/6/23 3:21 PM]
> درج وان پلاس همان درج وان هست با کلید های تاچ همین
>
> Dorj, [4/6/23 3:21 PM]
> تفاوتی در نرم افزارشون نیست
>
> Dorj, [4/6/23 3:22 PM]
> و حتی در طراحی سخت افزار

Translated using Google translate: 

> Dorj, [4/6/23 3:21 PM]
> Hello, if you have any questions, please ask
>
> Dorj, [4/6/23 3:21 PM]
> The OnePlus insert is the same as the One insert with the same touch keys
>
> Dorj, [4/6/23 3:21 PM]
> There is no difference in their software
>
> Dorj, [4/6/23 3:22 PM]
> And even in hardware design

We then asked which specific Trezor repository they are referring to. Most hardware wallet providers fork the Trezor repository into their own repository. But Dorj, from our previous interactions with them, points to the Trezor code itself to make their device work. This would in theory, grant some verdict inheritance, which we believe is not secure, as some modifications could occur, on the hardware level to suit their specific needs or design. Verdict inheritance would do a disservice to the user who may extend the trust granted to the parent verdict owner. 

> اگر شما همان فردی هستید که در توییتر با او صحبت کردیم، پس گفتید که کاربران به مخزن Trezor اشاره می کنند. آیا این دقیق است؟
> 
> If you are the same person we talked with on twitter, then you said that users are pointed to the Trezor repository. Is this accurate?

They replied: 

> بله
>
> Yes. 

For now, while we wait for further information, we'll still mark this as not having publicly available source code. We believe that simply pointing to the repository of another project is not a good practice as the device could have its own alterations - and if this is kept secret, would be insecure. 




