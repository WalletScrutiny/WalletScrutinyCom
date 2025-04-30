---
title: Eidoo
appId: eidoo
authors:
- danny
released: 2017-10-02
discontinued: 2023-01-25
updated: 
version: 
binaries: 
provider: 
providerWebsite: 
website: https://web.archive.org/web/20220418212420/https://eidoo.io/desktop-download
repository: 
issue: 
icon: eidoo.png
bugbounty: 
meta: defunct
verdict: nosource
date: 2025-04-15
reviewArchive: 
twitter: eidoo_io
social: 
features: 

---

## Analysis

Our investigation revealed multiple related domains with varying statuses:

- eidoo.app (defunct)
- eidoo-wallet.io (current)
- eidoo.io (defunct)

The associated mobile applications previously linked to eidoo {% include walletLink.html wallet='android/io.eidoo.wallet.prodnet' verdict='true' %} and {% include walletLink.html wallet='iphone/io.eidoo.wallet.prodnet' verdict='true' %} have been removed from their respective app stores.

<div class="alertBox"><div>🚩 Examining the eidoo-wallet.io website, we found it promotes an Android DeFi and Web3 application. However, concerning security issues were identified: clicking on the 'Android' option redirects users to an interface requesting seed phrases directly in the browser, which is a significant security risk. Furthermore, some users on reddit have indicated that the website <a href="https://www.reddit.com/r/ethereum/comments/1hlvlhl/help_with_eidoo_wallet">eidoo-wallet.io is a scam:</a>
</div> </div>

> Please do not put your seed phrase into the linked website. This website has all the signs of a scam, trying to lure in desperate former Eidoo users. I also tested it with a dummy seed: definitely a scam. Also make sure to not respond to unsolicited DMs as scammers probably want to get to you.
> 
> Eidoo seems to have closed down about 2 years ago and left many users stranded. 

A thorough search on Google Play using the term 'eidoo' yielded no relevant applications. Further Google searches uncovered an old link to the Android app with ID 'io.eidoo.android.app', but this link is no longer functional.

We also located a GitHub organization named 'Eidoo', but discovered that all repositories have been inactive since January 5, 2004.

Additional evidence of the product's discontinued status came from a Reddit post titled: [Transferring ETH out of (defunct?) Eidoo v2 to another wallet](https://www.reddit.com/r/ethereum/comments/18xhx2p/transferring_eth_out_of_defunct_eidoo_v2_to).

We have attempted to contact the developers via Twitter and [await their response](https://x.com/dannybuntu/status/1907338363033567346), though the likelihood of receiving a reply appears minimal.

Of particular note is the [founder's acquittal](https://www.lexia.it/2023/10/05/riciclaggio-criptovalute-ferrara/) for a money laundering case in Milan. 

Given that the original website hosting the desktop application is no longer accessible, and considering the lack of active development or support, we assume this product to be **defunct**.
