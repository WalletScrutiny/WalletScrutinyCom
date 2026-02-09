---
title: LNbits
appId: lnbits
authors:
- heisenberg
released: 2019-12-09
discontinued: 
updated: 2026-02-03
version: 1.4.2
binaries: https://github.com/lnbits/lnbits/releases
provider: LNbits
providerWebsite: 
website: https://lnbits.com
repository: https://github.com/lnbits/lnbits
issue: 
icon: lnbits.png
bugbounty: 
meta: ok
verdict: sourceavailable
date: 2026-02-09
twitter: lnbits
social:
- https://t.me/lnbits
builds: 
features:
- ln

---

## App Description

LNbits is a free and open-source Lightning wallet and accounts system. It can be self-hosted or used via public instances. As described on their website:

> LNbits is a lightning accounts system. You can run it on top of a funding source such as LND, CLN, LNPay, OpenNode, Eclair, LNTXBot and more.

Key features include:

- **Multi-tenant accounts**: Create multiple wallet accounts on a single Lightning node
- **Extension system**: Modular extensions for various use cases (point-of-sale, paywall, LNURL, etc.)
- **Self-hostable**: Run your own instance connected to your Lightning node
- **API-first**: Full REST API for integration with other applications
- **LNURL support**: Full LNURL protocol implementation

LNbits is commonly used by:
- Node operators wanting to share their node with family/friends
- Businesses needing multiple Lightning accounts
- Developers building Lightning applications
- Educators teaching about Lightning

The software is written in Python using FastAPI and is available on GitHub under the MIT license. It can be installed via Docker, pip, or manual installation. The project has an active community of contributors and maintains extensive documentation.

This is a self-hosted solution rather than a traditional wallet app. Users must either run their own instance or trust a third-party hosted instance.

