---
wsId: mojitoWallet
title: Mojito wallet
altTitle: 
authors:
- danny
- keraliss
users: 5000
appId: com.mojitowallet
appCountry: 
released: 
updated: 2024-12-15
version: 0.4.1
stars: 
ratings: 
reviews: 
website: https://www.mintlayer.org/en/mojito-wallet/
repository: https://github.com/mintlayer/mojito_mobile_wallet
issue: https://github.com/mintlayer/mojito_mobile_wallet/issues/101
icon: com.mojitowallet.png
bugbounty: 
meta: ok
verdict: sourceavailable
appHashes: []
date: 2024-12-21
signer: 
reviewArchive: 
twitter: mintlayer
social:
- https://t.me/mintlayer
- https://www.linkedin.com/company/mintlayer
- https://discord.gg/gkZ4h8McBT
- https://www.facebook.com/MintlayerOfficial
- https://www.youtube.com/channel/UCVVpaPry8xZS47pPBmS4rnA/videos
redirect_from: 
developerName: RBB SRL
features: 

---

**Update 2024-12-21:**

# Mojito Wallet Reproducibility Review

## Summary
The Mojito mobile wallet's build process has critical reproducibility issues that prevent successful compilation from source code. The project fails at the initial dependency installation stage, making it impossible to verify the published binaries against the source code.

## Build Attempt Details

### Environment
- Ubuntu Linux
- Node.js 16.14.2 (as specified in requirements)
- npm latest version
- JDK 11

### Build Process Issues

1. **Initial Dependencies Installation**
   - Basic `npm install` fails with dependency conflicts
   - Cleaning (`rm -rf node_modules package-lock.json`) and reinstalling fails
   - Even with `--legacy-peer-deps` flag, installation fails

2. **Dependency Access Issues**
   - Project depends on private/inaccessible git repositories:
     - BlueWallet/react-native-document-picker
     - BlueWallet/react-native-qrcode-local-image
   - No public alternatives specified in package.json

3. **Version Conflicts**
   - ESLint version conflicts between dependencies
   - React (17.0.2) and React Native (0.64.2) version mismatch
   - Multiple peer dependency conflicts

## Conclusion

  We were unable to build the wallet due to dependency installation failures and inaccessible private repositories. For that, the wallet is **not reproducable** for now!

## App Description from Google Play

> The Mojito wallet allows you to create multiple Bitcoin wallets in one, simple interface.
>
> Mojito is a MIT licensed cryptocurrency wallet built around the Bitcoin ecosystem.
> 
> With the Mojito wallet, you can:
>
> - Create BTC wallets to store, send and receive BTC
> - Retain full control of your private keys
> - No account creation necessary
> - Ensure that your private key never leaves your phone
> - Create BIP39 compliant seed phrases (mnemonic seed phrases)
> - Restore BTC wallets from seed phrase
> - Create BIP84 addresses
> - Create BIP49 addresses
> - Send and receive BTC from any generated addresses
> - Connect to your own node for increased privacy

## Analysis 

- The app provided a BTC wallet and the seed phrases. We helped generate entropy by drawing a cat. 

This app was previously [due to be verified](https://gitlab.com/walletscrutiny/walletScrutinyCom/-/issues/502), however [Leo](../authors/leo) issued the following commentary:

  > The build instructions are not very strict about tools to be used, making reproducibility unlikely. The repository did not use tags or releases, making finding matching versions difficult. Given this commit incremented the version from 0.2.7 to 0.2.10 with Google Play featuring version v0.2.9, we can say with certainty that reproducing the version on Google Play is impossible.
  >
  > A **nonverifiable** verdict is warranted until we check if compilation works at all.
