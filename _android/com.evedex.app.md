---
wsId: evedexCrypto
title: EVEDEX・Crypto Trade & Exchange
altTitle: 
authors:
- danny
users: 10000
appId: com.evedex.app
appCountry: 
released: Dec 26, 2024
updated: 2025-10-01
version: 1.7.4
stars: 3.857143
ratings: 
reviews: 5
website: https://evedex.com/
repository: 
issue: 
icon: com.evedex.app.png
bugbounty: 
meta: ok
verdict: nobtc
appHashes: 
date: 2025-11-14
signer: 
twitter: EVEDEX
social: 
redirect_from: 
developerName: EVEDEX Ltd.
features: 

---

## App Description

EVEDEX is a self-custodial trading wallet built on an EVM smart-contract architecture that uses account abstraction and on-chain settlement.
It does not support native Bitcoin; all trading pairs, including BTC/USD, operate on EVM-based token representations rather than Bitcoin’s UTXO chain.
The app integrates a centralized off-chain matching engine combined with smart-contract–enforced settlement for user-controlled assets.
Account abstraction enables features such as contract-level recovery options, 2FA controls, and gas-abstracted execution flows.

## Analysis

When we downloaded the app, we were provided the seed phrases after wallet creation. The only denomination we could find was of a USDT wallet. However, one of the menus, Exchange, allowed
us to see an exchange-like interface with a USDT-BTC pair. We were able to get information through the documentation to confirm that BTC/USD trading pairs exist and repeatedly describes the platform as supporting “derivatives,” “synthetic assets,” and “perpetual trading.”

Because the system runs entirely on EVM smart contracts, any BTC market must be either a wrapped BTC token or a synthetic representation—not actual Bitcoin.

A more in-depth description of this could be found [here:](https://docs.evedex.com/key-features-and-components/trading-platform-and-matching-engine/deposit-and-withdraw#understanding-the-temporary-wallet)


```
Our solution features what we call a "personal deposit contract" in essence, operates as a smart contract deployed on the Arbitrum network, designed to securely hold funds before they are routed to the appropriate bridge based on available liquidity. Unlike a traditional temporary hot wallet, which requires a private key, our system uses a smart contract that can only transfer tokens to a specified bridge, ensuring maximum security and eliminating the need for private key management. The contract’s code is open-source and audited, allowing anyone to verify its integrity and operations. This innovative approach enhances both security and usability without compromising decentralization.

Key advantages:

Smart Contract-Based: Instead of a traditional wallet with private keys, our temporary wallet is a smart contract deployed on the Arbitrum network. This smart contract temporarily receives your funds when you make a deposit.

Seamless Fund Transfer: Once your funds are in the temporary wallet, they are automatically transferred to the appropriate liquidity bridge. The bridge selection depends on the current liquidity, ensuring that your assets are efficiently routed to your final trading account.

Enhanced Security: The smart contract is designed to send tokens only to a pre-specified bridge address and destination address to boost security.

Transparency and Trust: The code for our smart contracts is fully open-source and has undergone rigorous audits. This means anyone can review and verify exactly how your funds are handled, providing complete transparency.

In summary, our temporary wallet marries the convenience of centralized systems with the security and transparency inherent to decentralized technology, ensuring a safe and user-friendly experience for all your transactions.
```

This app does **not offer native Bitcoin support**.