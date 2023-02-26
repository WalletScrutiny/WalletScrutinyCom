---
title: Waltonchain Bamboo Hardware Wallet
appId: waltonchain.bamboo
authors:
- danny
released: 2019-03-26
discontinued: 
updated: 2019-11-06
version: v1.2
binaries: https://github.com/WaltonChain/BambooWallet/blob/master/BambooWallet_v1.2.exe
dimensions:
- 47
- 32
- 10
weight: 
provider: Waltonchain
providerWebsite: https://www.waltonchain.org/
website: 
shop: 
country: CN
price: 90 USD
repository: https://github.com/WaltonChain/BambooWallet/
issue: 
icon: waltonchain.bamboo.png
bugbounty: 
meta: obsolete
verdict: vapor
date: 2022-12-07
signer: 
reviewArchive: 
twitter: Waltonchain
social:
- https://www.reddit.com/r/waltonchain
- https://weibo.com/waltonchain
- https://t.me/waltonchaincommunity_cn
features: 

---

## Updated Verdict 2022-12-07

Given the lack of a product plus some scam accusations on social media, this product is best categorized as vaporware.

## Background

Waltonchain is a cryptocurrency project with its own corresponding cryptocurrency ($WTC). 

> There are only 200 Bamboo Wallets available; however, we will release other hardware wallets in the future.

You can find this information on their [whitepaper](https://www.waltonchain.org/pdf/5ee1c6b5b10cf.pdf).

> Waltonchain has its own mainnet (parent chain) and works on its extension and
development. We have a blockchain explorer, user terminals, management tools and, on top of that, core hardware equipment of our own. We consider expansion of the existing technological base, ideas and architecture into a wider space.

There are currently no links that sell the {{ page.title }} from the Waltonchain page. This [FAQ](https://waltonchain-en.medium.com/waltonchain-bamboo-wallet-faq-1c8c323d761d) enlightens:

> **Why is Bamboo Wallet sold like this? Why don’t you setup an Alibaba/Spotify type online store?**
>
> A: Waltonchain prepares to obtain an ICP license of the Chinese Ministry of Industry and Information Technology to make its website commercial and sell goods online. Besides that, a new Electronic Commerce Law came into effect on January 1, 2019. We are working on regulatory compliance right now and will open the online store functionality once all is good.
>
> **Will Bamboo Wallet become open source?**
>
> A: At present, there is no plan for making Bamboo Wallet open source; we will consider it later.

## Product specifications

Information was taken from this [Medium post](https://waltonchain-en.medium.com/waltonchain-bamboo-wallet-faq-1c8c323d761d):
>
- Color: gold
- Material: aluminum + acryl
- Screen size: 0.96 in
- Screen type: OLED (128*64 px, blue)
- Connection: Micro USB
- Main control chip: ARM Cortex M3
- Input method: physical buttons
- Mnemonic phrase: 24-word mnemonic phrase supported
- Supported language: English
- Working voltage: 5 V DC
- Power consumption: ≤60 mA

## Video 

<blockquote class="twitter-tweet"><p lang="en" dir="ltr">Q: What&#39;s so unique about Bamboo Wallet?<a href="https://twitter.com/hashtag/WTCAnswer?src=hash&amp;ref_src=twsrc%5Etfw">#WTCAnswer</a>:<br>1. Encrypted chip with no Internet access to protect your private key<br>2. Currently the only hardware wallet to support mainnet WTC<br>3. No fees except gas<br>4. Only 200 pieces available<a href="https://t.co/4Q7ZyIDWhE">https://t.co/4Q7ZyIDWhE</a><a href="https://twitter.com/hashtag/Waltonchain?src=hash&amp;ref_src=twsrc%5Etfw">#Waltonchain</a> <a href="https://twitter.com/search?q=%24WTC&amp;src=ctag&amp;ref_src=twsrc%5Etfw">$WTC</a> <a href="https://t.co/q0bWMkFrnU">pic.twitter.com/q0bWMkFrnU</a></p>&mdash; Waltonchain (@Waltonchain) <a href="https://twitter.com/Waltonchain/status/1105453386818818048?ref_src=twsrc%5Etfw">March 12, 2019</a></blockquote> <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>

## Analysis 

We were not able to find a working "shop" link for the {{ page.title }}. Production was limited to 200 units. A [medium post](https://waltonchain-en.medium.com/waltonchain-bamboo-wallet-limited-pre-sale-da7381abb89e) previously linked to a dedicated page of the device, but that page is now broken.

![image](https://github.com/WaltonChain/BambooWallet/raw/master/pic/8.jpeg)

## Can you create the private keys offline? - ❓

> Bamboo Wallet is a hardware wallet used to store blockchain token account data. It connects to the host via USB, obtains account information and supports token transactions. Account data locates in the secured storage and will not be lost if the wallet gets disconnected from the power supply. It supports transactions with various tokens through the app. 

This tutorial makes it appear like it is: 

![image](https://github.com/WaltonChain/BambooWallet/raw/master/pic/6.jpeg)

> Create Wallet
> 
1. Select 'New Wallet' and confirm;
2. Enter PIN;
3. Write down your mnemonic phrase (scroll up and down)
4. Select your mnemonic words in the right order and confirm to enter the account. 

## Are the private keys shared? - ❌

From this tutorial, it seems the device is dependent on the PC app to perform transfers: 

![image](https://github.com/WaltonChain/BambooWallet/raw/master/pic/7.jpeg)

> Transfer
> 
1. Open the wallet client in the PC app;
2. Select the currency to use on Bamboo Wallet;
3. Select the corresponding currency in the PC app and click 'Get Account';
4. Enter amount, address, gas rate and click 'Send'.

## Does the device display the receiving address for confirmation? - ❌

Nothing in the user manual indicates the device performs this function.

## Does the interface have a display screen and buttons which allows the user to confirm transaction details? - ❓

There is a display on the device, but there is nothing to show that physical confirmation is needed to perform transactions. 

![image](https://github.com/WaltonChain/BambooWallet/raw/master/pic/8.jpeg)

## Is it reproducible? - ❌ 

The repository only contains the .exe files, the manual, and some images. It does not contain the source. We embedded a video from a third party to show how the firmware is updated.

<iframe width="560" height="315" src="https://www.youtube.com/embed/-CSJSSNFi08" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

## ANALYSIS

As noted above, there are many factors that give us pause when it comes to this device. The most glaring of these issues is the need for the device to **stay connected with an online Windows computer**. The project's social media account is still posting, but it seems that the Bamboo wallet is no longer promoted. Furthermore, the product has not been updated for over 2 years making it **obsolete**. 

