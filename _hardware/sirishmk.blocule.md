---
title: Sirishmk Blocule Hardware Wallet
appId: sirishmk.blocule
authors:
- danny
released: '2018-05-26'
discontinued: 
updated: '2018-06-27'
version: 
binaries: 
dimensions: 
weight: 
provider: Sirishmk
providerWebsite: 
website: 
shop: 
country: US
price: 
repository: https://github.com/sirishmk/blocule
issue: 
icon: sirishmk.blocule.png
bugbounty: 
meta: defunct
verdict: nobtc
appHashes: 
date: '2022-05-23'
signer: 
reviewArchive: 
twitter: sirish03834828
social: 
features: 

---

## Background 

> ## Hardware Requirements 
- Raspberry Pi Zero W - 
- Adafruit 128x64 OLED Bonnet 
- 5V power supply or microUSB
- MicroSD card - 8,16 or 32 GB works
>
> ## OS
- Download raspbian - https://www.raspberrypi.org/downloads/raspbian/
- Install Guide for Raspbian - https://www.raspberrypi.org/documentation/installation/installing-images/README.md
- Configure Wi-Fi - https://www.raspberrypi.org/documentation/configuration/wireless/wireless-cli.md
>
> ## Install packages
> ## Install Java
> ## Clone Blocule and Compile
> ## Run the LCD wallet interface
> - Open ~/blocule/LCD/tron_trnx.py and add the wallet address, wallet password and the toaddress (This will be replaced in the future)
cd ~/blocule/; make run_disp
- Tron transactions and checking balance
- The current code uses the API from https://api.tronscan.org/api
- You can add the wallet server and the LCD interface script to your initialization. 

## Video 

<iframe width="560" height="315" src="https://www.youtube.com/embed/6e8vpMPB5Ks" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

## Analysis 

This do-it-yourself **TRON hardware wallet** has not been updated in 4 years. 