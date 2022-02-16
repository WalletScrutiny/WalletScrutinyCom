---
title: "Icy Note"
appId: icynote
authors:
- danny
released: 2021-04-27
discontinued: # date
updated: 2021-07-11
version: 0.7
dimensions: 
weight: 
website: https://www.icynote.ch/
shop: 
company: SMD Security Printing Sàrl
companywebsite: https://www.smd-safe.com/
country: CH
price: 
repository: 
issue:
icon: icynote.png
bugbounty:
meta: ok
verdict: prefilled
date: 2022-01-01
signer:
reviewArchive:


providerTwitter: icynoteofficial
providerLinkedIn: 
providerFacebook: Icynote-100908298821873
providerReddit: 
---

## UPDATE 2022-02-16

The company claims that it is impossible for the providers to take a copy of the keys without damaging the product. However, as the keys already come **prefilled** by the company, the verdict must still be updated to reflect that.


# Old Review 2022-01-01

## Private keys can be created offline 

Since we are talking about physical bitcoin notes, we'd have to assume that they are printed somewhere physically.

The Icynote process in printing [involves the following](https://www.icynote.ch/faq):

**Icynote physical note printing**

> work offline so any hacking must be performed physically. We print using a just-in-time process, so the cold wallets only exist 10 minutes from creation to deletion. Each new cold wallet file is erased by the next cold wallet. At the end of the process, a security company analyzes the printer hard drives and deletes any information related to the printing process. We not only delete the files, we also have the hard drive destroyed by a secure company.

> We generate them in a clean room, under the supervision of a Swiss notary and an auditing company. Each Icynote is unique, the private key is printed only once and no copies are kept. If you lose your Icynote, you lose your assets. We respect the NIST SP800-22 Test Suite compliance standard for the random number generator which creates the cold wallet. 

## Private keys are not shared 

The company claims that: 

> Every Icynote fabricated by us is unique, nobody can see it from creation to printing. The only way anyone can see the private key is by scratching-off the Icynote. This is an irreversible process. So, you can see and feel whether the banknote has been “opened” and is therefore compromised.

Physically transferring one Icynote to another is the whole gist of paper notes. Icynote asserts that there is no way to view the private key without destroying its tamper seal. 

> 3.1 How can I be sure that the previous owner of the banknote has not read the private key?
>
> It is your decision whether you accept the Icynote or not. If you accept it, you must check that the banknote is neither broken, scratched-off nor damaged and that you receive it from a secure source. This wallet is protected by two layers, one metallic and the other is a polymer, both of which reflect light, even from lasers, thus making it impossible to see what is printed inside. It is also impossible to scan it with a magnetic, X-ray or static scanner. Anyway, if your transaction is of a substantial nature, it is better to scratch-off the Icynote and transfer the assets from one Icynote to another Icynote, ensuring that your counterpart will transfer you the expected amount.

## Code and Reproducibility  

Is it a physical note, a hardware wallet or a cold wallet? Lumping this unique product in any classification would do it a great disservice. It is all of the above.

The app's primary purpose is to verify the authenticity of the Icynote. The Icynote app does not indicate anywhere that it is open source. Searching for the Android appID 'ch.smd.icynote' yields [0 results in GitHub](https://github.com/search?q=ch.smd.icynote&type=code).
