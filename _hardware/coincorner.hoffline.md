---
title: CoinCorner Hoffline
appId: coincorner.hoffline
authors:
- danny
released: 
discontinued: 
updated: 
version: 
binaries: 
dimensions: 
weight: 
provider: CoinCorner
providerWebsite: https://www.coincorner.com/
website: 
shop: 
country: UK
price: 
repository: 
issue: 
icon: coincorner.hoffline.png
bugbounty: 
meta: ok
verdict: vapor
appHashes: 
date: 2023-01-20
signer: 
reviewArchive: 
twitter: CoinCorner
social: 
features: 

---

**Update 2023-01-20**: As
[confirmed by Danny Scott](https://twitter.com/CoinCornerDanny/status/1596604740070035456)
this product is "shelved".

## Previous Review 2022-05-17

The {{ page.title }} was [presented on twitter](https://twitter.com/CoinCornerDanny/status/1405184528822460428?ref_src=twsrc%5Etfw%7Ctwcamp%5Etweetembed%7Ctwterm%5E1405184528822460428%7Ctwgr%5E%7Ctwcon%5Es1_&ref_url=https%3A%2F%2Fpublish.twitter.com%2F%3Fquery%3Dhttps3A2F2Ftwitter.com2FCoinCornerDanny2Fstatus2F1405184528822460428widget%3DTweet) by Danny Scott on June 16, 2021. Danny Scott is the CEO of coincorner.com. 

<blockquote class="twitter-tweet"><p lang="en" dir="ltr">1/<br><br>Introducing “Hoffline”<br><br>The 1st automated <a href="https://twitter.com/hashtag/Bitcoin?src=hash&amp;ref_src=twsrc%5Etfw">#Bitcoin</a> hot wallet where the private keys never go online, fully air-gapped.<br><br>Take a look at the video and I’ll explain below 👇 <a href="https://t.co/k9aWFMAqv8">pic.twitter.com/k9aWFMAqv8</a></p>&mdash; Danny Scott ⚡ (@CoinCornerDanny) <a href="https://twitter.com/CoinCornerDanny/status/1405184528822460428?ref_src=twsrc%5Etfw">June 16, 2021</a></blockquote> <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>

## Description from the twitter thread

> High level device overview:
> 1x Offline (Blue)
   - Raspberry pi
   - Screen
   - Camera
   - Bitcoin wallet - private keys
> 1x Online (Orange)
   - Raspberry pi
   - Screen
   - Camera
   - Ethernet cable
   - Bitcoin wallet - watch only
>
> High level how it works:
> Online Device:
   - Gets transactions to send from database
   - Creates unsigned transaction
   - Displays QR code with unsigned transaction data
> 
> Offline device
   - camera automatically scans QR code
> 
> Offline Device
   - Validates request and signs transaction
   - Displays QR code containing signed transaction data
> 
> Online Device
   - Camera automatically scans QR code
   - Broadcasts signed transaction
 
## Analysis 

Apart from the twitter thread there's been sparse information regarding the development of the {{ page.title }}. This product is still in the early stages of its development. We [reached out to Danny](https://twitter.com/BitcoinWalletz/status/1521416135249256448) to ask about the development status. We'll mark this as **unreleased**.   