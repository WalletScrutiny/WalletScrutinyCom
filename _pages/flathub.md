---
layout: archive
title: "How we check Flathub packages"
permalink: /flathub/
---

Many desktop wallets are also on [Flathub](https://flathub.org). A Flathub package
is built from a public manifest in `github.com/flathub/<app id>`. For wallets
we review, the manifest does one of three things:

* **Repackage.** It downloads an official release file, for example
  `Bisq-64bit-1.10.9.deb`, pinned to a sha256, and copies its contents into the
  package. `flatpak-builder` refuses to build if the hash does not match, and the
  package ships the exact manifest it was built from as `/app/manifest.json`.
* **Extra data.** The package contains only an installer. Your computer downloads
  the official file from the developer's server during installation and checks
  the sha256 in the manifest.
* **Source.** Flathub compiles the wallet on its own build servers. The result is a
  different binary from the official downloads and needs its own verification.

A Flathub package can be published by the wallet's developers (Flathub shows it as
*verified*) or by someone else (a *community* package). Wallet pages tell you which.

## Which official file does my package use?

This reads the signed manifest of the current Flathub release without installing
the wallet. It downloads about 60 KB into your user installation:

```sh
flatpak remote-add --user --if-not-exists flathub https://dl.flathub.org/repo/flathub.flatpakrepo
flatpak install --user --no-deploy --no-deps --no-related --subpath=/manifest.json flathub network.bisq.Bisq
grep -rh -A1 Bisq-64bit ~/.local/share/flatpak/repo/objects
```

If the wallet is already installed, read the manifest directly:

```sh
F=$(flatpak info --show-location network.bisq.Bisq)/files
grep -A1 Bisq-64bit "$F/manifest.json"
```

Look the printed `sha256` up on our [asset page]({{ site.baseurl }}/asset/). If we
verified that file as reproducible, your Flathub package wraps a reproducible build.

This relies on Flathub's build servers doing what the manifest says. Nobody outside
Flathub can watch those builds.

## Checking without trusting Flathub

For a repackage, you can compare the installed files with the official download.
Flathub strips debug information from ELF binaries, so those files differ byte for
byte. They become identical once both copies are stripped the same way:

```sh
F=$(flatpak info --show-location network.bisq.Bisq)/files
curl -LO https://bisq.network/downloads/v1.10.9/Bisq-64bit-1.10.9.deb
sha256sum Bisq-64bit-1.10.9.deb      # must be the hash you looked up
mkdir deb && cd deb && ar x ../Bisq-64bit-1.10.9.deb && tar xf data.tar.* && cd opt/bisq
for p in bin/Bisq $(find lib -type f); do
  cmp -s "$p" "$F/$p" && continue
  strip --strip-all -R .gnu_debuglink -R .comment -o /tmp/a "$p" 2>/dev/null
  strip --strip-all -R .gnu_debuglink -R .comment -o /tmp/b "$F/$p" 2>/dev/null
  cmp -s /tmp/a /tmp/b || echo "DIFFERS: $p"
done
```

No output means every file of the official release is in the package unchanged.
For Bisq 1.10.9 (Flathub commit `1b2f9468`), 143 files were byte-identical and the
other 43 matched after stripping. The package also adds icons, a `.desktop` file and
an OpenJDK that the Bisq launcher does not use. Its runtime libraries come from the
Flathub runtime, in the same way the `.deb` uses your distribution's libraries.

Every Flathub update is a new pull request to the manifest, so this holds for one
version at a time.
