---
wsId: cake
title: Cake Wallet
altTitle: 
authors:
- leo
- keraliss
users: 100000
appId: com.cakewallet.cake_wallet
appCountry: 
released: 2020-01-01
updated: 2024-11-16
version: 4.21.0
stars: 4.7
ratings: 730
reviews: 453
size: 
website: https://cakewallet.com
repository: https://github.com/cake-tech/cake_wallet
issue: https://github.com/cake-tech/cake_wallet/issues/337
icon: com.cakewallet.cake_wallet.jpg
bugbounty: 
meta: ok
verdict: nonverifiable
date: 2024-11-26
signer: 
reviewArchive:
- date: 2024-07-26
  version: 4.19.1
  appHash: 
  gitRevision: 71ff3b4fadbd0c5156f39ee8296ddaa8047fb6fe
  verdict: ftbfs
- date: 2022-11-02
  version: 4.4.0
  appHash: 
  gitRevision: 58eb9afc078bac8a5a23d3af42a18f3ad543887c
  verdict: nonverifiable
- date: 2021-04-14
  version: 4.1.4
  appHash: 
  gitRevision: 3f57101209712caf0bf7dae6466ce81d29359fca
  verdict: nonverifiable
twitter: cakewallet
social:
- https://www.facebook.com/cakewallet
- https://www.reddit.com/r/cakewallet
redirect_from: 
developerName: Cake Labs
features: 

---

## Update 2024-11-26:

We attempted to verify the reproducibility of the Cake Wallet build by comparing the official APK with our built version. 

**Source of APKs:**
- Official APKs were obtained using our [apkextractor_sync.sh](https://gitlab.com/walletscrutiny/walletScrutinyCom/-/blob/master/apkextractor_sync.sh?ref_type=heads) script from a USB-connected phone. This extracted `base.apk` and various split APKs.
- Built APK was generated using a Dockerfile (`cakeRELEASE.Dockerfile`) provided by Justxd22 from [Cake_wallet_DOCKER_xD](https://github.com/Justxd22/Cake_wallet_DOCKER_xD/blob/main/cakeRELEASE.Dockerfile)

**Directory Structure (All Extracted and Built APKs):**
```
.
├── builtapks
│   ├── app-arm64-v8a-release.apk
│   ├── app-arm64-v8a-release.apk.sha1
│   ├── app-armeabi-v7a-release.apk
│   ├── app-armeabi-v7a-release.apk.sha1
│   ├── app-x86_64-release.apk
│   ├── app-x86_64-release.apk.sha1
│   └── build_output.zip
├── cake.dockerfile
└── official_apks
    ├── base.apk
    ├── split_config.arm64_v8a.apk
    ├── split_config.bn.apk
    ├── split_config.en.apk
    ├── split_config.gu.apk
    ├── split_config.hdpi.apk
    ├── split_config.hi.apk
    ├── split_config.kn.apk
    ├── split_config.mr.apk
    ├── split_config.ta.apk
    └── split_config.te.apk
```

For our comparison, we selected the ARM64-v8a versions as this is the most common architecture for modern Android devices. From the official APKs, we needed both `base.apk` (which contains the main application code) and `split_config.arm64_v8a.apk` (which contains the architecture-specific native libraries) to match the contents of our built `app-arm64-v8a-release.apk`. The other split APKs (bn, en, gu, etc.) are language-specific resources that aren't relevant for verifying the core application build.

**APKs Compared:**
- Built APK: `app-arm64-v8a-release.apk`
- Official APKs: `base.apk` + `split_config.arm64_v8a.apk`

**Command Used:**
```bash
# Extract both APKs
mkdir -p fromOfficial fromBuild
(cd official_apks && unzip -qqd ../fromOfficial base.apk && unzip -qqd ../fromOfficial split_config.arm64_v8a.apk)
(cd builtapks && unzip -qqd ../fromBuild app-arm64-v8a-release.apk)

# Compare directories excluding .png and .xml files
diff --recursive fromBuild fromOfficial
```

**Output**: This is the output of the command, excluding png and xml files, which we had around 700+
```
Only in fromOfficial/META-INF: BNDLTOOL.RSA
Only in fromOfficial/META-INF: BNDLTOOL.SF
Only in fromOfficial/META-INF: MANIFEST.MF
Only in fromOfficial/res: anim
Only in fromOfficial/res: animator
Only in fromOfficial/res: animator-v21
Only in fromOfficial/res: anim-v21
Only in fromOfficial/res: drawable
Only in fromOfficial/res: drawable-anydpi-v23
Only in fromOfficial/res: drawable-hdpi-v4
Only in fromOfficial/res: drawable-night-v8
Only in fromOfficial/res: drawable-v21
Only in fromOfficial/res: drawable-v23
Only in fromOfficial/res: drawable-watch-v20
Only in fromOfficial/res: interpolator
Only in fromOfficial/res: interpolator-v21
Only in fromOfficial/res: layout
Only in fromOfficial/res: layout-land
Only in fromOfficial/res: layout-sw600dp-v13
Only in fromOfficial/res: layout-v21
Only in fromOfficial/res: layout-v26
Only in fromOfficial/res: layout-watch-v20
Only in fromOfficial/res: menu
Only in fromOfficial/res: mipmap-anydpi-v26
Only in fromOfficial/res: mipmap-hdpi-v4
Only in fromOfficial/res: mipmap-mdpi-v4
Only in fromOfficial/res: mipmap-xhdpi-v4
Only in fromOfficial/res: mipmap-xxhdpi-v4
Only in fromOfficial/res: mipmap-xxxhdpi-v4
Only in fromOfficial/res: xml
Only in fromOfficial: stamp-cert-sha256
```

**Differences Noted:**
The comparison revealed several differences:

1. Signing-related files (expected differences):
```
Only in fromOfficial/META-INF: BNDLTOOL.RSA
Only in fromOfficial/META-INF: BNDLTOOL.SF
Only in fromOfficial/META-INF: MANIFEST.MF
Only in fromOfficial: stamp-cert-sha256
```

2. Resource directory structure differences:
```
Only in fromOfficial/res: anim
Only in fromOfficial/res: animator
Only in fromOfficial/res: animator-v21
Only in fromOfficial/res: anim-v21
Only in fromOfficial/res: drawable
Only in fromOfficial/res: drawable-anydpi-v23
Only in fromOfficial/res: drawable-hdpi-v4
Only in fromOfficial/res: drawable-night-v8
Only in fromOfficial/res: drawable-v21
Only in fromOfficial/res: drawable-v23
Only in fromOfficial/res: drawable-watch-v20
Only in fromOfficial/res: interpolator
Only in fromOfficial/res: interpolator-v21
Only in fromOfficial/res: layout
Only in fromOfficial/res: layout-land
Only in fromOfficial/res: layout-sw600dp-v13
Only in fromOfficial/res: layout-v21
Only in fromOfficial/res: layout-v26
Only in fromOfficial/res: layout-watch-v20
Only in fromOfficial/res: menu
Only in fromOfficial/res: mipmap-anydpi-v26
Only in fromOfficial/res: mipmap-hdpi-v4
Only in fromOfficial/res: mipmap-mdpi-v4
Only in fromOfficial/res: mipmap-xhdpi-v4
Only in fromOfficial/res: mipmap-xxhdpi-v4
Only in fromOfficial/res: mipmap-xxxhdpi-v4
Only in fromOfficial/res: xml
```

**Conclusion:**
While signing-related differences are expected, the significant differences in resource directory structure suggest indicates The Cake Wallet build is currently **not verifiable**.

---

**Update 2024-07-26**: 


### Review: Build Issue with Cake Wallet

During the build process, we are encountering an error using the command:

```
sudo docker build -t cake_wallet -f cake.dockerfile .
```

#### Error Message:
```
Resolving dependencies...

Note: intl is pinned to version 0.19.0 by flutter_localizations from the flutter SDK.

See https://dart.dev/go/sdk-version-pinning for details.

Because cake_wallet depends on flutter_localizations from sdk which depends on intl 0.19.0, intl 0.19.0 is required.

So, because cake_wallet depends on intl ^0.18.0, version solving failed.

You can try the following suggestion to make the pubspec resolve:

* Try an upgrade of your constraints: flutter pub upgrade --major-versions

The command '/bin/sh -c mkdir -p /opt/android && cd scripts/android && ./install_ndk.sh && bash -c "source ./app_env.sh cakewallet && ./app_config.sh && ./build_all.sh" && cd ../../ && flutter pub get && flutter pub upgrade --major-versions && flutter packages pub run tool/generate_new_secrets.dart && flutter packages pub run tool/generate_android_key_properties.dart keyAlias=key storeFile=/root/key.jks storePassword=your_store_password keyPassword=your_key_password && flutter packages pub run tool/generate_localization.dart && ./model_generator.sh && flutter build apk --release' returned a non-zero code: 1
```

#### Issue Breakdown:
The root cause of the problem is a version conflict in the `pubspec.yaml` file. The `flutter_localizations` package requires `intl` version `0.19.0`, whereas `cake_wallet` depends on `intl` version `^0.18.0`. This mismatch prevents the dependency resolution from succeeding.

#### Attempted Solutions:

1. **Updating `pubspec.yaml` and Removing `pubspec.lock`:**
   ```sh
   # Remove pubspec.lock to avoid conflicts
   RUN find . -name pubspec.lock -exec rm -f {} \;

   # Modify pubspec.yaml to fix intl dependency issue (more flexible regex)
   RUN find . -name pubspec.yaml -print -exec sed -i 's/intl:.*$/intl: 0.19.0/' {} \; && \
       echo "pubspec.yaml files updated" && \
       grep -R "intl: 0.19.0" . || echo "Failed to update intl version"
   ```
   This approach didn't resolve the issue.

2. **Deleting `pubspec.lock`:**
   ```sh
   RUN find . -name pubspec.lock -exec rm -f {} \;
   ```
   This also did not work.

3. **Lowering the Flutter Version:**
   ```sh
   RUN git clone https://github.com/flutter/flutter.git ${FLUTTER_ROOT} && \
       cd ${FLUTTER_ROOT} && \
       git fetch --tags && \
       git checkout 2.10.0 && \
       flutter doctor
   ```
   Hoping that using an older Flutter version would lower the `intl` requirement, we tried this method. However, the lower version was not compatible with the Dart SDK, leading to a different error:
   ```
   [ 98%] Built target wallet
   Scanning dependencies of target wallet_api
   [100%] Linking CXX static library ../../../lib/libwallet_api.a
   [100%] Built target wallet_api
   Running "flutter pub get" in app...
   The current Dart SDK version is 2.16.0.

   Because cake_wallet requires SDK version >=3.1.0 <4.0.0, version solving failed.
   pub get failed (1; Because cake_wallet requires SDK version >=3.1.0 <4.0.0, version solving failed.)
   ```

### Verdict:
At this point, it seems like cake wallet is **not verifiable** . 


**Update 2024-02-25**: The provider
[closed the issue](https://github.com/cake-tech/cake_wallet/issues/337#event-11912194300)
as **not planned**.
This product is and will remain **not verifiable**.

**Update 2022-11-02**: Apparently this product fails to build from source. The
relatively old
[issue](https://github.com/cake-tech/cake_wallet/issues/337) was not closed yet.
We have to assume this product remains to be **not verifiable**.

**Update 2021-04-14**: They now do have a public issue tracker and
[emanuel](/authors/emanuel) tried to build with
[slightly more success](https://github.com/cake-tech/cake_wallet/issues/112)
but the verdict remains the same.

> Cake Wallet allows you to safely store, send receive and exchange your XMR /
> Monero and BTC / Bitcoin.

is an implicit claim of this being a non-custodial Bitcoin wallet but:

> -You control your own seed and keys

is more explicit about the non-custodial part.

On their website we read:

> **FEATURES**<br>
> ...<br>
> Open source

and indeed, there is [a source code repo](https://github.com/cake-tech/cake_wallet).

There is no claim about reproducibility or build instructions. As the app uses
[Flutter](https://flutter.dev/) and we have no experience with that, we have to
stop here. Usually at this point we open issues on the code repository but they
have no public issue tracker.
