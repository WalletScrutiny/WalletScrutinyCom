---
title: Ryder
appId: id.ryder.ryderone
meta: fewusers
verdict: nowallet
archivedFrom: _android/id.ryder.ryderone.md
archivedCommit: a09b07d3125103dc8a4839c17ce954b17ef80435

---

## App Description

Ryder is a mobile companion app for the {% include walletLink.html wallet='hardware/ryder.one' verdict='true' %} hardware wallet. The Play Store listing says the app pairs with the hardware wallet over NFC and supports asset management, sending, and receiving for Bitcoin, Ethereum, Stacks, Solana, and other networks.

## Analysis

We tested the app and posted the video on [X.com](https://x.com/BitcoinWalletz/status/2051580646066434549). All available wallet actions require pairing with the Ryder One hardware wallet device.

This confirms that the app is a companion interface for the Ryder One hardware wallet, not a standalone wallet. The Play Store listing is consistent with this, as it says the app pairs with the hardware wallet by NFC and that private keys remain offline.

Ryder's own documentation says private keys are generated and stored inside the Ryder One secure element, while the app is used for NFC pairing, account management, and transaction initiation. The Ryder One hardware wallet is reviewed separately as {% include walletLink.html wallet='hardware/ryder.one' verdict='true' %}.

Because the mobile app cannot create or use a wallet without the Ryder One hardware device, it does **not function as a standalone Bitcoin wallet**.
