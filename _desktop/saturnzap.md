---
title: SaturnZap
appId: saturnzap
authors:
- danny
released: 2026-04-17
discontinued: 
updated: 2026-04-23
version: 1.3.1
binaries: https://github.com/lqwdtech/SaturnZap/releases
provider: LQWD Technologies Corp.
providerWebsite: https://lqwdtech.com
website: https://github.com/lqwdtech/SaturnZap
repository: https://github.com/lqwdtech/SaturnZap
icon: saturnzap.png
bugbounty: 
meta: ok
verdict: sourceavailable
appHashes:
date: 2026-05-08
signer: 
twitter: LQWDTech
social:
builds:
features:
- hd
- ln
- foss

---

## App Description

SaturnZap is a non-custodial Bitcoin wallet focused on Lightning payments. It also supports
on-chain Bitcoin addresses and sends for funding or sweeping the wallet. It runs its own
[LDK](https://lightningdevkit.org/) node locally — no external Lightning node or Bitcoin full
node required.

> A lightweight, non-custodial Lightning wallet for AI agents. Self-sovereign — runs its own
> LDK node, keys stay local. MCP server for Claude, Cursor, and VS Code. L402 auto-pay —
> agents buy paid API calls themselves.

The wallet generates a BIP39 seed on the agent's machine and stores it encrypted using Fernet
encryption. The passphrase is supplied via the `SZ_PASSPHRASE` environment variable. Keys
never leave the device; there is no external key escrow or backup service.

Chain synchronization uses Esplora REST API with automatic fallback: LQWD infrastructure →
Blockstream → mempool.space.

## Installation Note

The release ships a vendored `ldk_node-0.7.0-py3-none-any.whl` because ldk-node 0.7.0 is not
on PyPI. Installation requires `--find-links` pointing to the GitHub Release:

```
uv tool install saturnzap \
  --find-links https://github.com/lqwdtech/SaturnZap/releases/expanded_assets/v1.3.1
```

{% include featureEvidence.html feature="hd" quote="BIP39 seed phrase management. Seeds are generated via the mnemonic library and stored encrypted locally." source="[GitHub README](https://github.com/lqwdtech/SaturnZap)" %}

{% include featureEvidence.html feature="ln" quote="A lightweight, non-custodial Lightning wallet for AI agents." source="[GitHub README](https://github.com/lqwdtech/SaturnZap)" %}

{% include featureEvidence.html feature="foss" quote="MIT License" source="[GitHub repository](https://github.com/lqwdtech/SaturnZap/blob/main/LICENSE)" %}

## Verification

The verification target is `saturnzap-{version}-py3-none-any.whl`, built from the
`pyproject.toml` configuration. The release also includes `saturnzap-{version}.tar.gz`
(source distribution) and the vendored `ldk_node-0.7.0-py3-none-any.whl` dependency.
No reproducibility verification has been performed yet.
