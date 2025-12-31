---
title: Brave Browser
appId: brave.browser
authors:
- danny
released: 2016-01-20
discontinued:
updated: 2025-12-19
version: 1.85.118
binaries: https://brave.com/download/
provider: Brave Software
providerWebsite:
website: https://brave.com
repository: https://github.com/brave/brave-browser
issue: https://github.com/brave/brave-browser/issues/51721
icon: brave.browser.png
bugbounty: https://hackerone.com/brave
meta: ok
verdict: sourceavailable
date: 2025-12-31
twitter: brave
social:
- https://www.reddit.com/r/brave_browser
- https://mastodon.social/@brave
- https://bsky.app/profile/brave.com
- https://www.facebook.com/BraveSoftware/
builds:
features: 

---

## App Description

Note: Bitcoin wallet support was introduced into Brave Browser in 2021 as an integrated feature (Brave Wallet), rather than as part of the browser’s original 2016 release.

Brave Browser is a desktop web browser that includes a built-in, self-custodial Bitcoin wallet as part of its core feature set. The wallet allows users to create or import a Bitcoin wallet and send and receive BTC on-chain without installing a separate application. Private keys are generated and stored locally under user control within the browser environment, but the wallet operates entirely within the browser and does not support the Lightning Network. Because the wallet is embedded in a general-purpose browser, its security and trust model is inseparable from the browser as a whole.

The Brave Browser is built from the main brave-browser repository, which produces the downloadable desktop binaries and pulls in Chromium and Brave-specific components. Wallet functionality, including Bitcoin support, is implemented within Brave’s broader codebase (primarily via brave-core and related repositories) and is not released or verifiable as a standalone wallet application.

## Initial Investigation

We have confirmed that Brave Browser’s Bitcoin wallet is real, compiled, and part of the shipped browser, not a cosmetic feature. The wallet code lives inside the `brave-core` repository under `components/brave_wallet` and `components/brave_wallet_ui`, and it is enabled at build time via the `enable_brave_wallet` flag. Bitcoin-specific functionality is clearly implemented, including address parsing, Bech32/Bech32m encoding, Base58 handling, and Bitcoin transaction serialization, with direct dependencies on Bitcoin Core source files. This shows that the wallet performs genuine Bitcoin-related operations and is not merely a frontend wrapper.

At the same time, the wallet cannot be separated from the browser: it is not a standalone application, cannot be built independently, and inherits the browser’s large attack surface and build process.

## Summary of investigation steps (with commands used)

To verify how Brave’s Bitcoin wallet is implemented, we inspected the actual build and source layout rather than relying on documentation claims.

We first cloned the Brave build repository, which confirmed that it is an orchestration repo that pulls in Chromium and Brave components:

```
git clone https://github.com/brave/brave-browser.git
```

From the `README` and directory structure, we confirmed that `brave-core` is mounted at **src/brave**, so we cloned it in place to inspect Brave-specific functionality:

```
git clone https://github.com/brave/brave-core.git src/brave
```

We then located the wallet components and confirmed they are compiled features, not extensions:

```
ls components | grep -i wallet
```

This revealed brave_wallet and brave_wallet_ui as first-class components. To confirm real Bitcoin functionality, we searched only inside the wallet component for Bitcoin-related code:

```
$ grep -RIn --exclude-dir=.git -E 'bitcoin|btc|bech32|bip32|bip39|bip44|xpub|descriptor|psbt' components/brave_wallet | head -n 60
```

We then confirmed the wallet is compiled into Brave via a dedicated build flag:

```
$ grep -RIn --exclude-dir=.git -E 'enable_brave_wallet' components/brave_wallet/common/buildflags | head -n 60
components/brave_wallet/common/buildflags/buildflags.gni:9:  enable_brave_wallet = !is_brave_origin_branded
components/brave_wallet/common/buildflags/BUILD.gn:13:    "ENABLE_BRAVE_WALLET=$enable_brave_wallet",
```

Together, these steps demonstrate that Brave’s Bitcoin wallet is a genuine, compiled component embedded in the browser, while also confirming that it cannot be independently built or verified outside the Brave Browser itself.

## Conclusion

We did not attempt a like-for-like rebuild of the official Brave binaries, so reproducibility is currently unverified; given the Chromium-scale toolchain and dependency graph, reproducible builds would require explicit upstream support and a dedicated verification effort.

We filed a [GitHub issue](https://github.com/brave/brave-browser/issues/51721) regarding reproducibility in the brave repository. 

This app is **for verification**.
