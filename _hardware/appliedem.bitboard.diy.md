---
title: bitboard by AppliedEM DIY Hardware Wallet
appId: appliedem.bitboard.diy
authors:
- danny
released: 2018-03-03
discontinued: 
updated: 2018-03-28
version: 
binaries: 
dimensions: 
weight: 
provider: AppliedEM, Michael van Dyk, John Easton
providerWebsite: 
website: 
shop: 
country: 
price: 
repository: https://github.com/littledivy/arienai
issue: 
icon: appliedem.bitboard.diy.png
bugbounty: 
meta: obsolete
verdict: diy
date: 2022-05-23
signer: 
reviewArchive: 
twitter: 
social: 

---

**Warning:** Provider indicates that project is a work-in-progress, users should use at their own risk.

## Device Description 

> An open-source arduino-based bitcoin hardware wallet
>
> This set of programs is a tool designed to allow anyone with a few extra units of dumb paper money store all their valuable bitcoin in a secure location. It consists of two parts:
>
> 1. The firmware that runs on the espressif esp-12 chip. 
> 2. The python frontend that runs all the tasty networking and crypto algos.
>
> ## INSTALLATION: 
> 1. Install python 
> 2. Connect the esp-12 D1 chip to your computer via usb. Make sure there are no other USB-Serial converters connected to your computer. 
> 3. In the ./barebones/esptool/ directory there will be an "upload.py" program. Run it and follow the directions. 
> 4. In the ./complete/dist/bitboard directory there will be a file called "bitboard.exe" you should be able to execute it and run the program!
>
> **USAGE**: This is a very basic program. As such, there are only three functions.
>
> 1. Send Allows you to send bitcoin to another address. Enter the public key of the address you want to send it to, how much you want to send, and the fee (usually 300-5000 satoshi) and hit the button! 
>
> 2. Import Allows you to import bitcoin from a WIF (Wallet Import Format) key, that can be generated using a number of tools. As an example, here is one such tool: https://www.bitaddress.org/ 
> 
> 3. Receive Allows you to request bitcoin from another wallet or client. Hitting this button will copy your bitcoin address to your clipboard, which you can paste wherever you choose.
>
> When conducting a transaction, the output will be displayed at the bottom of the screen. If it begins with "Success: True", your transaction was successful. If not, you might need to try again, and maybe consider increasing the fee.
>
> The checkbox to the side of the balance switches the client to testnet mode, and is primarily for development purposes.

## Analysis 

The Github page for this simple wallet states that it is "arduino-based" and contains instructions on how to build and run the program. This {{ page.title }} is a DIY project and is not available for sale.

As for the repository, it has not been updated since 2018, meaning that this program qualifies as **obsolete.**