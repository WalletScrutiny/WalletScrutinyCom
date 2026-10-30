---
title: Ashigaru Terminal
appId: ashigaruterminal
authors:
- danny
released: 2025-06-23
discontinued: 
updated: 2025-06-23
version: 1.0.0
binaries: https://ashigaru.rs/download/
provider: Ashigaru Open Source Project
providerWebsite: 
website: https://ashigaru.rs/docs/ashigaru-terminal-overview/
repository: http://ashicodepbnpvslzsl2bz7l2pwrjvajgumgac423pp3y2deprbnzz7id.onion/Ashigaru/Ashigaru-Terminal
icon: ashigaruterminal.webp
bugbounty: 
meta: stale
verdict: sourceavailable
date: 2026-10-30
twitter: 
social: 
builds: 
features:
- foss
- mix

---

## App Description

Ashigaru Terminal is a self-custodial Bitcoin wallet with a text interface (TUI). It runs on a desktop or on a headless server. Its [overview](https://ashigaru.rs/docs/ashigaru-terminal-overview/) calls it "a companion application for interacting with Ashigaru Whirlpool to make coinjoin transactions".

It is a fork of Sparrow Wallet v1.8.4 without Sparrow's graphical interface. The [v1.0.0 release notes](https://ashigaru.rs/news/release-terminal-v1-0-0/) say it "only allows users to broadcast Tx0 transactions" and "does not allow users to create and broadcast ordinary spends". Users spend mixed coins with another wallet, such as Sparrow Wallet or [Ashigaru Mobile](/mobile/com.ashigaru.wallet/).

A separate graphical app, [Ashigaru Desktop (unofficial)](/desktop/ashigarudesktop/), is published on GitHub by another developer. It is not made by the Ashigaru Open Source Project.

The downloads are on the project's own git server, which is reachable **over Tor only**. Its address is in the Source code link at the top of the page. [ashigaru.rs/download](https://ashigaru.rs/download/) links to the files and publishes a PGP-signed SHA-256 of each one.

## Analysis

Version 1.0.0 was released on 2025-06-23 for:

- Linux: `.deb`, `.rpm` and a standalone `.tar.gz` (x86_64)
- macOS: `.dmg` for Intel and for Apple M-series
- Windows: `.zip`

The source is public under GPLv3. Tag `v1.0.0` points to commit `0bbed17ea513` ("Ashigaru Terminal v1.0.0"). The project publishes [reproducible build instructions](http://ashicodepbnpvslzsl2bz7l2pwrjvajgumgac423pp3y2deprbnzz7id.onion/Ashigaru/Ashigaru-Terminal/src/branch/main/docs/ReproducibleBuilds.md) for the Linux standalone binary. We have not checked them yet.

There has been no release since v1.0.0 in June 2025, so the app was last updated more than a year ago.

{% include featureEvidence.html feature="foss" quote="Ashigaru Terminal is released under the Free and Open Source license GNU GPLv3" source="README (Ashigaru-Terminal repository, Tor only)" %}

{% include featureEvidence.html feature="mix" quote="Ashigaru Terminal is a non-custodial, dedicated Ashigaru Whirlpool client" source="[Release notes v1.0.0](https://ashigaru.rs/news/release-terminal-v1-0-0/)" %}

This app is **source available**: the GPLv3 source is published and tagged for the current release. Its build has not been verified as reproducible yet.
