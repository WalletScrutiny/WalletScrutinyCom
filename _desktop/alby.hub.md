---
title: Alby Hub
appId: alby.hub
authors:
- heisenberg
released: 2024-07-05
discontinued: 
updated: 2026-01-12
version: 1.21.4
binaries: https://github.com/getAlby/hub/releases
provider: Alby Inc.
providerWebsite: https://getalby.com
website: https://albyhub.com
repository: https://github.com/getAlby/hub
issue: 
icon: alby.hub.png
bugbounty: 
meta: ok
verdict: sourceavailable
date: 2026-02-09
twitter: getalby
social:
- https://t.me/getAlby
- https://snort.social/p/npub1getal6ykt05fsz5nqu4uld09nfj3y3qxmv8crys4aeut53unfvlqr80nfm
builds: 
features:
- ln
- nostr

---

## App Description

Alby Hub is a self-custodial Bitcoin Lightning node designed for ease of use. As described on their website:

> Alby Hub - Your own Bitcoin Lightning node: easy, connectable, feature-rich. Run anywhere. Become self-sovereign.

Key features include:

- **Embedded LDK node**: Runs a Lightning Development Kit (LDK) node
- **Nostr Wallet Connect (NWC)**: Native NIP-47 support for connecting apps
- **Channel management**: Automated channel opening and management
- **App connections**: Connect to any NWC-compatible app
- **Web dashboard**: Manage your node through a browser interface
- **Multi-platform**: Available for Linux, macOS, Windows, and as Docker image

Alby Hub can be deployed on:
- Personal computers
- Raspberry Pi / home servers
- Cloud VPS
- Start9, Umbrel, and other node platforms

The software is built with Go and uses LDK for Lightning functionality. It enables self-custody by running your own node while maintaining the convenience of connecting to web apps via Nostr Wallet Connect.

Alby Hub is designed as a companion to the Alby browser extension but can be used with any NWC-compatible wallet or application.

