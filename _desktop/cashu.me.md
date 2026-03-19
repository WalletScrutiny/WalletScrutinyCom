---
title: Cashu.me
appId: cashu.me
authors:
- heisenberg
released: 2023-02-27
discontinued: 
updated: 2026-01-30
version: 
binaries: 
provider: Cashu
providerWebsite: https://cashu.space
website: https://cashu.me
repository: https://github.com/cashubtc/cashu.me
icon: cashu.me.png
bugbounty: 
meta: ok
verdict: sourceavailable
date: 2026-02-09
twitter: CashuBTC
social:
- https://t.me/CashuBTC
builds: 
features:
- cashu
- foss
- ln

---

## App Description

Cashu.me is a Progressive Web App (PWA) wallet for Cashu ecash. It provides a user-friendly interface for managing Cashu tokens in the browser. The wallet is available at https://cashu.me and can be installed as a PWA on mobile devices.

Key features include:

- **Multi-mint support**: Connect to multiple Cashu mints
- **Token management**: Send, receive, and manage ecash tokens
- **Lightning integration**: Mint tokens from Lightning, redeem to Lightning
- **Offline capable**: PWA can work offline for viewing balances and tokens
- **QR code support**: Scan and generate QR codes for token transfers
- **Nostr contacts**: Send tokens to Nostr public keys

Cashu.me is built with Vue.js and TypeScript. As a web wallet, it stores tokens in browser local storage. Users should back up their tokens regularly.

**Important privacy note**: Cashu provides strong privacy for transactions through blind signatures, but the mint operator has custody of the underlying Bitcoin. Users must trust the mint to redeem their tokens.

{% include featureEvidence.html feature="foss" quote="quasar build -m pwa" source="GitHub README" comment="The repository is publicly available on GitHub. However, the License file returned 404: Not Found, so FOSS cannot be confirmed per rules." %}