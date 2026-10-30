---
title: Ashigaru Desktop (unofficial)
appId: ashigarudesktop
authors:
- danny
released: 2025-07-02
discontinued: 
updated: 2026-10-29
version: 1.5.1
binaries: https://github.com/linkinparkrulz/ashigaru-desktop/releases
provider: linkinparkrulz (not the Ashigaru Open Source Project)
providerWebsite: https://github.com/linkinparkrulz
website: https://github.com/linkinparkrulz/ashigaru-desktop
repository: https://github.com/linkinparkrulz/ashigaru-desktop
icon: ashigarudesktop.webp
bugbounty: 
meta: ok
verdict: sourceavailable
date: 2026-10-30
twitter: 
social: 
builds: 
features:
- foss
- mix
- TOR

---

<div class="alertBox"><div>⚠️ This app is <b>not</b> made by the Ashigaru Open Source Project. It is an unofficial app published on GitHub by <code>linkinparkrulz</code>. The project's published <a href="https://ashigaru.rs/proof-of-ownership/">Proof of Ownership</a> lists its websites, services and Tor code repositories; this GitHub repository is not listed. The official desktop app is <a href="/desktop/ashigaruterminal/">Ashigaru Terminal</a>.</div></div>

## App Description

Ashigaru Desktop is a self-custodial Bitcoin wallet with a graphical interface, built around Whirlpool coinjoin. Its README calls it "the graphical companion to Ashigaru Terminal and Ashigaru Mobile: receive here, mix through Premix and Postmix, and spend from mobile."

Like Ashigaru Terminal, it is a fork of Sparrow Wallet v1.8.4. It receives and mixes coins and offers "Mix To" to send mixed outputs to another wallet; its README says ordinary spending happens on mobile.

The installers and the app itself are named just "Ashigaru" (for example `Ashigaru-1.5.1.exe`), so it is easy to mistake for an official release.

## Analysis

Version 1.5.1 was released on 2026-10-29 on GitHub for:

- Linux: `.AppImage` (x86_64)
- macOS: `.dmg` for Intel and for Apple M-series
- Windows: `.exe`

The source is public under GPLv3, and tag `v1.5.1` points to commit `bcb4d9c04808`. Its license note still says changes are made "under this Ashigaru Open Source Project code repository", text copied from the official README.

In the v1.5.1 source, the Whirlpool coordinator addresses are the same as in the official Ashigaru Terminal v1.0.0. The PayNym server matches the one on the project's Proof of Ownership.

Earlier releases (v1.4.5 and v1.5.0) include Bitcoin message signatures tied to the fork's BIP47 payment code, separate from the project's PGP release key (`445F 8079 96F7 0586 B715 C7B8 A138 06B1 FA2A 676B`). The v1.5.1 `RELEASE-BIP47-SIGNATURE.txt` contains only the message, with no signature; the v1.5.1 source rejects such a file, so the in-app updater cannot verify this release.

We have not checked whether the published binaries are built from this source.

{% include featureEvidence.html feature="foss" quote="Ashigaru Desktop is released under the Free and Open Source license GNU GPLv3" source="[README](https://github.com/linkinparkrulz/ashigaru-desktop)" %}

{% include featureEvidence.html feature="mix" quote="A privacy-first Bitcoin wallet for the desktop, built around Whirlpool coinjoin." source="[README](https://github.com/linkinparkrulz/ashigaru-desktop)" %}

{% include featureEvidence.html feature="TOR" quote="Built-in Tor." source="[README](https://github.com/linkinparkrulz/ashigaru-desktop)" %}

This app is **source available**: the GPLv3 source is published and tagged for the current release. Its build has not been verified as reproducible yet.
