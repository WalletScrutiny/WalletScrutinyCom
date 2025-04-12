---
title: libbitcoin explorer
appId: libbitcoin.explorer
authors:
- danny
released: 2014-12-14
discontinued: 
updated: 2023-08-18
version: 3.8.0
binaries: 
provider: 
providerWebsite: 
website: https://libbitcoin.info
repository: https://github.com/libbitcoin/libbitcoin-explorer
issue: 
icon: libbitcoin.explorer.png
bugbounty: 
meta: stale
verdict: nowallet
date: 2025-04-12
reviewArchive: 
twitter: 
social: 
features: 

---

## App Description

> ​Libbitcoin Explorer (BX) is a command-line utility designed for Bitcoin-related operations, such as key generation and transaction management. It is part of the Libbitcoin suite, a collection of C++ libraries aimed at developers building Bitcoin applications. While BX offers extensive functionality, it is **not a wallet** in the traditional sense; it does not manage or store user funds directly. Instead, it provides tools that can be used to create and manage wallets. 

## Milk Sad Vulnerability CVE-2023-39910

> However, it's important to note that a significant security vulnerability was identified in BX's seed command, which was used for generating wallet seeds. This vulnerability, known as "Milk Sad," compromised the randomness of generated seeds, potentially exposing wallets to unauthorized access. The issue has been documented under CVE-2023-39910, and users who utilized the bx seed command are advised to move their funds to secure wallets immediately. ​