---
title: Brave Browser
appId: brave.browser
authors:
- danny
released: 2016-01-20
discontinued: 
updated: 2026-05-20
version: 1.90.124
binaries: https://brave.com/download/
provider: Brave Software
providerWebsite: 
website: https://brave.com
repository: https://github.com/brave/brave-browser
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

Note: Bitcoin wallet support was introduced in 2021 as Brave Wallet, not part of the original 2016 release.

Brave Browser is a desktop web browser with a built-in, self-custodial Bitcoin wallet. Users can create or import a wallet and send/receive BTC on-chain. Private keys are stored locally. The wallet does not support Lightning Network.

## Initial Investigation

The wallet code lives in `brave-core` under `components/brave_wallet` and is enabled via the `enable_brave_wallet` build flag. Bitcoin-specific functionality includes address parsing, Bech32/Bech32m encoding, Base58 handling, and transaction serialization with dependencies on Bitcoin Core source files.

The wallet cannot be built or verified independently—it inherits the browser's full attack surface and build process.

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

An issue has been opened at [https://github.com/brave/brave-browser/issues/51721](https://github.com/brave/brave-browser/issues/51721)
