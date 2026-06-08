---
layout: archive
title: "WalletScrutiny Automated Build Server"
permalink: /automated-build-server/
---

The **WalletScrutiny Automated Build Server** (ABS) is a service that runs reproducibility build scripts on behalf of the community. When a new wallet binary is registered in the [Asset Registry](/assets/) or a new release is detected, the ABS can automatically download an existing `build.sh` script from Nostr, run it in an isolated environment, and publish a new verification signed by the **WalletScrutiny Bot**.

This lets wallets with a working build script stay up to date without requiring a human to re-run the same steps for every new version.

## How it works

The ABS runs continuously on a dedicated Linux server:

1. **Collect context** — It loads wallet metadata from WalletScrutiny inventory files and fetches existing [build verifications](/verifications/) from Nostr.
2. **Find work** — It looks for assets in the Asset Registry that do not yet have a matching verification, and (when enabled) for new desktop or hardware releases.
3. **Select a script** — For each candidate, it searches prior verifications marked **reproducible** that include a file attachment whose name ends with `build.sh`.
4. **Run the build** — The script is downloaded, made executable, and run inside a dedicated build directory. Execution is recorded with [asciinema](https://asciinema.org/) so anyone can review what happened.
5. **Read the result** — The script must write a `COMPARISON_RESULTS.yaml` file with the verdict (`reproducible`, `not_reproducible`, or `ftbfs`).
6. **Publish to Nostr** — The ABS creates a new verification on Nostr as WalletScrutiny Bot, referencing the original script author, attaching the terminal recording, and stating the outcome.

Jobs for different wallets can run in parallel, but only one job per wallet runs at a time to avoid resource conflicts.

## What triggers an automatic run?

Today the ABS focuses on one case:

- **New asset in the Asset Registry** — When a user registers a binary (for example via the [WalletScrutiny Android app](https://zapstore.dev/apps/naddr1qvzqqqr7pvpzpytvkhls05a4rnhh76mt0a28nvgqrdqpcr5z2k8wrg39qnra2p7fqqtxxmmd9emkzmrvv468xcmjw46xjmne9eshquqr8p5tv) or the [register new asset](/new_asset/) page), the ABS tries to reproduce it if a suitable `build.sh` already exists on Nostr.

In the future, the ABS will be able to detect newly newly published versions for desktop and hardware wallets and run the script for each architecture and binary type defined in the wallet file.

The ABS only reuses scripts from verifications with a **reproducible** verdict. It currently runs on Linux and skips macOS targets.

## Writing scripts for the ABS

To have your script picked up automatically, publish it as an attachment to a manual verification on Nostr and follow the rules in [**Scripts for Reproducible Verifications**](https://gitlab.com/walletscrutiny/walletScrutinyCom/-/blob/master/docs/script_verifications.md) on GitLab.

Users can also download the same script from Nostr and run it locally to verify a binary themselves.

If you are writing your first script, we recommend reaching out on the [WalletScrutiny Discord](https://discord.gg/yCNdcSJw9k) so the community can help you through the process.

### Further reading on GitLab

- [**Binary Verifications via Nostr**](https://gitlab.com/walletscrutiny/walletScrutinyCom/-/blob/master/docs/verifications.md) — How verifications and the Asset Registry work on Nostr.
- [**Build Server README**](https://gitlab.com/walletscrutiny/walletScrutinyCom/-/blob/master/external/build_server/README.md) — Technical details about the ABS service, requirements, and deployment.

## Recognizing ABS verifications

Automatic verifications are published by the **WalletScrutiny Bot**. Their description starts with *"Automatic verification by WalletScrutiny Build Server"* and they reference the human verification whose `build.sh` script was reused. The terminal recording of the run is attached as an asciicast file.

You can browse all verifications from the [Verifications](/verifications/) page or from individual wallet review pages.
