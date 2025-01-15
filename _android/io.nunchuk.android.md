---
wsId: nunchuk
title: Nunchuk Bitcoin Wallet
altTitle: 
authors:
- leo
- emanuel
- mohammad
- danny
users: 10000
appId: io.nunchuk.android
appCountry: 
released: 2021-11-11
updated: 2025-01-14
version: 1.9.58
stars: 4.6
ratings: 26
reviews: 23
size: 
website: https://nunchuk.io
repository: https://github.com/nunchuk-io/nunchuk-android
issue: https://github.com/nunchuk-io/nunchuk-android/issues/23
icon: io.nunchuk.android.png
bugbounty: 
meta: ok
verdict: nonverifiable
date: 2025-01-15
signer: 
reviewArchive:
- date: 2024-11-19
  version: 1.9.53
  appHash: aaec6e500babbd1931db8485b99205468e426f6157df131f607aa69b6e821708
  gitRevision: b720beb1ee4f9de53638ab013f759690c8e787a4
  verdict: nonverifiable
- date: 2023-07-05
  version: 1.9.32
  appHash: 
  gitRevision: 5e67b0f51e6c67a3e1140ba66a1b4222e8cfe2a4
  verdict: nonverifiable
- date: 2023-01-06
  version: 1.9.23
  appHash: 
  gitRevision: 49d61c1c5807f24ea01ba185a2de6793f8df0d38
  verdict: nonverifiable
- date: 2021-12-15
  version: 1.9.21
  appHash: 
  gitRevision: f9bb0384d334f1ab3cd67824f43ff0053e7e51e7
  verdict: nosource
twitter: nunchuk_io
social:
- https://nunchuk.medium.com/
- >-
  https://join.slack.com/t/nunchukio/shared_invite/zt-xqdlvl5g-xKKohQu_R7IUo7_np8rVaw
redirect_from: 
developerName: Nunchuk Inc
features: 

---

## Update 2025-01-15 for version {{ page.version }}

# Diffs: 

### **armeabi_v7a.apk** - reproducible

```
8f53fa42fc072381ea228314fa421b52a77b33e9fe6029095fc1d13c68fd9b41 - Official
24e13fbf44b47b8dc46c6043fc0383ed59075f97da22489d34f38f02a36616a2 - Built
```

*Signing-related diffs only.*

### **base.apk** - nonverifiable

```
9027651c5ed7dd4a31d6cd073023bb77f38b799d8a0aa0ff0f81a184b1795dd3 - Official
b85a00b1c6ac7b6b2ed068beb3fd134d5386e2f30885e9ab5202c0d5e0d90086 - Built
```

*Signing-related diffs including:*

- baseline.profm
- classes2.dex
- classes3.dex
- classes4.dex
- classes5.dex
- classes6.dex
- classes.dex

### xhdpi.apk - reproducible

```
02c32758930cf0d4d87a44a5985f7bf97550280e1539074276a277866489f022 - Official
0daeee1e46edda5bc66c6878af256c43da2cb5378cdfc944addd8ff0498ac2f8 - Built
```

*Signing-related diffs only*

We have updated the issue with this [note.](https://github.com/nunchuk-io/nunchuk-android/issues/23#issuecomment-2462243428)

```
{% include asciicast %}

With numerous diffs noted in base.apk, we note that:

**What are classes(x).dex Files?**

  - **classes.dex:** This is a Dalvik Executable file that contains compiled code written in Java for the Android platform. It is part of the APK (Android Package) and is executed by the Android Runtime (ART) or Dalvik Virtual Machine.
  - **classes2.dex classes3.dex, etc.:** These additional .dex files are created when the main classes.dex file exceeds the 64K method limit. They contain additional compiled code to support larger applications.

This leads us to conclude that {{ page.title }} version {{ page.version }} is **nonverifiable**.