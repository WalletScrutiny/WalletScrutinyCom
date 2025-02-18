---
title: FINNEY
appId: finney
authors:
- kiwilamb
- danny
released: 
discontinued: 
updated: 
version: 
binaries: 
dimensions: 
weight: 
provider: Sirin Labs
providerWebsite: https://sirinlabs.com/
website: https://sirinlabs.com/
shop: https://shop.sirinlabs.com/products/finney
country: UK
price: 999USD
repository: 
issue: 
icon: finney.png
bugbounty: 
meta: ok
verdict: nosource
appHashes: 
date: 2021-12-04
signer: 
reviewArchive: 
twitter: SIRINLABS
social:
- https://www.linkedin.com/company/sirin-labs
- https://www.facebook.com/SirinLabs
features: 

---

<div class="alertBox"><div>
⚠️ Warning: This product is associated with a company with a CEO with lawsuits arising out of the companies' <a href="https://www.coindesk.com/policy/2021/11/18/crypto-heavyweight-moshe-hogeg-reportedly-arrested-in-israel/">involvement with ICOs.</a>
</div> </div>

This app comes from the same providers as {% include walletLink.html wallet='hardware/sirinv3' verdict='true' %}

From [the product page:](https://shop.sirinlabs.com/products/finney)

> State-of-the-art ultra secured Blockchain smartphone. <br />
The FINNEY™ is powered by SIRIN OS™ which includes an outstanding Security Suite Layer, Embedded Cold Storage Wallet, Token Conversion Center and the best of DApp nation featured on Sirin's dCENTER.


On the support page, there is [information](https://shop.sirinlabs.com/pages/support) about the mnemonic.

> The recovery seed contains a sequence of 24 word– - uniquely and securely generated inside your wallet when you first set it up.

## Interface

[A third-party article](https://www.bitcoinmarketjournal.com/should-you-store-your-crypto-in-a-finney-phone/) goes into detail about Finney's "Embedded Cold Storage Wallet:"

> The standout feature of the Finney phone is its Safe Screen, which is a 2-inch PMOLED touch screen that slides up from the back of the phone. When the Safe Screen is hidden, the cryptocurrency wallet is disconnected from the internet and remains fully offline. Sliding the screen up activates the cryptocurrency wallet.
>
> When the Safe Screen is up and the wallet is active it’s possible to send, receive, and convert cryptocurrencies in the wallet. There is support for Bitcoin, Ethereum, and Sirin Labs’ own SRN token. Plans are in the works to add support for additional cryptocurrencies in the future.

FINNEY's whitepaper was deleted from [Sirin Labs website](https://twitter.com/BitcoinWalletz/status/1464219115015397384), although we were able to find a presumed copy.

The [whitepaper](https://cryptorating.eu/whitepapers/SIRIN-LABS/SIRINLABS_-_White_Paper.pdf) also has information on the "Safe Screen."

> FINNEY Wallet comprises an app that you use on your device’s main screen and a hardware Safe Screen that slides up at the top of your device.
> - Send cryptocurrency
> - Receive cryptocurrency
> - Convert cryptocurrency
> - View your cryptocurrency balance
> - See your cryptocurrency transaction history
> - Sign and approve blockchain messages with a private key

## Private keys can be created offline - ❓

The user guide can be downloaded [here.](https://docs.sirinlabs.com/FINNEY-GUIDE.pdf) Initialization involves pulling out or sliding up the “Safe Screen” to begin the initialization process. The FINNEY Wallet app is then installed as well as the firmware. A wallet is then generated with a 24-word seed phrase. The seed phrases are displayed on the Safe Screen and the user can then verify it. 

The user guide then mentions syncing the FINNEY wallet app.

> If the process is completed successfully, you are prompted to reenter your password. After successfully entering your password and if you are connected to a network, FINNEY syncs your wallet. (Page 16 of FINNEY user guide)

We assume that the syncing happens between the embedded cold-storage device and the phone it is attached to. However, since a network connection is needed in order to sync, much question can be raised as to what else happens during the course of syncing.

## Private keys are not shared - ❓

It seems that the FINNEY’s primary security feature is centered on the safe screen. As mentioned:

> Unique Physical Security Switch - turns the wallet power and communication on/off by sliding the safe screen (Page 36 of FINNEY user guide)

This reliance on the Safe Screen is evident on the warnings noted on Page 13. 

> - Both for security and to protect the Safe Screen, you should only open the Safe Screen when needed or when prompted by the wallet app.
>
> - If the Safe Screen has been open for more than 5 minutes with no activity, the power to the Safe Screen turns off. To reactivate the Safe Screen, you will need to slide it down and then up again to power on.
>
> - Whenever you need to enter your password in the Safe Screen, you’ll have up to 10 attempts to enter the password successfully. After a 10th unsuccessful attempt, your wallet will be wiped and you will need to either recover or reconfigure the wallet.

While a screen lock after 10 minutes of inactivity might protect a user who forgot his digital wallet unlocked, it probably won't help if savvy thieves were waiting for their opportunity get their hands on your device.

## Device displays receive address for confirmation

The official youtube channel features [a video](https://youtu.be/lG5l73gwuxs?t=73) in which the wallet sends a transaction. The Safe Screen’s display allows users to view the receiving address for confirmation.

## Verdict

Although FINNEY has a [Github account](https://github.com/sirin-labs), “sirin-labs,” there **does not** appear to be any repository for the firmware of the embedded cold storage wallet attached to the phone.


## Notes

On the Amazon Store, we found the following review:

> [Amazon Customer](https://www.amazon.com/gp/customer-reviews/R1CGBPVU0SHNCG/ref=cm_cr_dp_d_rvw_ttl?ie=UTF8&ASIN=B07KR859ZS)<br>
  ★☆☆☆☆ September 18, 2021 <br>
  Do not buy this phone.<br>
  The custom Sirin OS hasn't been updated in 2 years and is still running off of an old android branch.<br />
  The wallet (the big selling feature!) can not receive transfers, and appears to be completely offline.<br />
  The dCenter app is also offline, so you only have access to the play store.<br />
  Everything they are selling this phone on is no longer supported, and that is not shared anywhere in any of the information about this phone.
