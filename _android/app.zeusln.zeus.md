---
wsId: zeusln
title: ZEUS Wallet
altTitle: 
authors:
- leo
- mohammad
- danny
- keraliss
users: 10000
appId: app.zeusln.zeus
appCountry: 
released: 2020-07-07
updated: 2026-01-24
version: 0.12.2
reviews: 37
website: https://zeusln.com
repository: https://github.com/ZeusLN/zeus
issue: 
icon: app.zeusln.zeus.png
bugbounty: 
meta: ok
verdict: sourceavailable
appHashes:
- 9c141c38553a9bfb2df11ca05921775a04a000d84328988f7d3bf5b3a9112e4d
date: 2025-03-13
signer: cbcc8ccfbf89c002b5fed484a59f5f2a6f5c8ad30a1934f36af2c9fcdec6b359
twitter: ZeusLN
social:
- https://iris.to/zeus@zeusln.app
- https://t.me/ZeusLN
redirect_from:
- /app.zeusln.zeus/
- /posts/app.zeusln.zeus/
developerName: Atlas 21 Inc.
builds: 
features:
- ln

---

## App Description

ZeusLN is a mobile application that functions as both a Bitcoin and Lightning Network wallet, enabling users to connect to remote `lnd` or Core Lightning nodes. The codebase is implemented in TypeScript using React Native, supporting both Android and iOS platforms. It provides extensive support for Lightning features such as LNURL, Taproot, MPP/AMP, and keysend. The application integrates with several full-node solutions including StartOS, Umbrel, RaspiBlitz, and payment platforms like BTCPay Server and LNBits. It supports self-custodial operation, connection over Tor, and advanced functionality like coin control, external signers, and watch-only accounts.

From a development perspective, the project maintains clear build instructions for both Android and iOS, highlighting requirements such as Node.js ≥ 18.18, proper ADB setup, and native dependency installation via CocoaPods. The repository actively supports reproducible builds and encourages contributors to verify code integrity using its signed releases and commits. Localization is managed through Transifex, and developers are advised against editing locale files directly. Contributions are expected to pass type checks, automated tests, and formatting rules. The project follows AGPLv3 licensing and maintains PGP-signed commits from verified maintainers.


