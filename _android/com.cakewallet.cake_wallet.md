---
wsId: 'cake'
title: 'Cake Wallet'
altTitle: 
authors:
- 'leo'
- 'keraliss'
users: 100000
appId: 'com.cakewallet.cake_wallet'
appCountry: 
released: '2020-01-01'
updated: 2025-02-02
version: '4.23.0'
stars: 4.7
ratings: 730
reviews: 480
website: 'https://cakewallet.com'
repository: 'https://github.com/cake-tech/cake_wallet'
issue: 'https://github.com/cake-tech/cake_wallet/issues/337'
icon: 'com.cakewallet.cake_wallet.jpg'
bugbounty: 
meta: 'ok'
verdict: 'nonverifiable'
appHashes: []
date: '2025-01-14'
signer: 
reviewArchive:
- date: '2024-12-25'
  version: '4.21.0'
  appHashes: []
  gitRevision: 'c5fd94bf4c89189529bbb9a0265239acf4f53f35'
  verdict: 'nonverifiable'
- date: '2024-07-26'
  version: '4.19.1'
  appHashes: []
  gitRevision: '71ff3b4fadbd0c5156f39ee8296ddaa8047fb6fe'
  verdict: 'ftbfs'
- date: '2022-11-02'
  version: '4.4.0'
  appHashes: []
  gitRevision: '58eb9afc078bac8a5a23d3af42a18f3ad543887c'
  verdict: 'nonverifiable'
- date: '2021-04-14'
  version: '4.1.4'
  appHashes: []
  gitRevision: '3f57101209712caf0bf7dae6466ce81d29359fca'
  verdict: 'nonverifiable'
twitter: 'cakewallet'
social:
- 'https://www.facebook.com/cakewallet'
- 'https://www.reddit.com/r/cakewallet'
redirect_from: 
developerName: 'Cake Labs'
features: 

---

## Update 2024-12-25:
We attempted to verify the reproducibility of the Cake Wallet build by comparing the official APK with our built version using split APKs.

Source of APKs:
- Official APKs obtained via adb from a device:
  - base.apk
  - split_config.arm64_v8a.apk
  - split_config.en.apk
  - split_config.hdpi.apk
- Built APKs generated using bundletool from the app bundle:
  - base-master.apk
  - base-arm64_v8a.apk
  - base-en.apk
  - base-xxhdpi.apk

Build Environment:
- Docker build using cake.dockerfile
- Base image: instrumentisto/flutter:3.24.0 
- Generated App Bundle (.aab) and used bundletool to create split APKs
- Device spec configuration:
```json
{
  "supportedAbis": ["arm64-v8a"],
  "supportedLocales": ["en"],
  "screenDensity": 480,
  "deviceFeatures": [],
  "sdkVersion": 30
}
```

Comparison Method:
```bash
# Extract APKs
mkdir -p fromOfficial fromBuild
cd official_apks
unzip -qqd ../fromOfficial *.apk
cd ..
cd build/splits
unzip -qqd ../../fromBuild *.apk
cd ../..

# Compare directories
diff --recursive fromOfficial fromBuild 
```

here are the diffs 
```
Binary files fromOfficial/assets/dexopt/baseline.prof and fromBuild/assets/dexopt/baseline.prof differ
Binary files fromOfficial/assets/dexopt/baseline.profm and fromBuild/assets/dexopt/baseline.profm differ
Binary files fromOfficial/assets/flutter_assets/AssetManifest.bin and fromBuild/assets/flutter_assets/AssetManifest.bin differ
Binary files fromOfficial/assets/flutter_assets/NOTICES.Z and fromBuild/assets/flutter_assets/NOTICES.Z differ
Binary files fromOfficial/classes2.dex and fromBuild/classes2.dex differ
Binary files fromOfficial/classes3.dex and fromBuild/classes3.dex differ
Binary files fromOfficial/classes4.dex and fromBuild/classes4.dex differ
Binary files fromOfficial/classes5.dex and fromBuild/classes5.dex differ
Binary files fromOfficial/lib/arm64-v8a/libapp.so and fromBuild/lib/arm64-v8a/libapp.so differ
Binary files fromOfficial/lib/arm64-v8a/libgojni.so and fromBuild/lib/arm64-v8a/libgojni.so differ
Binary files fromOfficial/lib/arm64-v8a/libmonero_libwallet2_api_c.so and fromBuild/lib/arm64-v8a/libmonero_libwallet2_api_c.so differ
Binary files fromOfficial/lib/arm64-v8a/libsp_scanner.so and fromBuild/lib/arm64-v8a/libsp_scanner.so differ
Binary files fromOfficial/lib/arm64-v8a/libwownero_libwallet2_api_c.so and fromBuild/lib/arm64-v8a/libwownero_libwallet2_api_c.so differ
Only in fromOfficial/res: drawable-ldrtl-hdpi-v17
Only in fromBuild/res: drawable-ldrtl-xxhdpi-v17
Only in fromBuild/res: drawable-xhdpi-v4
Only in fromBuild/res: drawable-xxhdpi-v4
Binary files fromOfficial/resources.arsc and fromBuild/resources.arsc differ
Only in fromOfficial: stamp-cert-sha256
```

Key Differences Found:

1. Core Application Code:
- Binary differences in classes2.dex through classes5.dex
- Native libraries (.so files) differences:
  ```
  libapp.so
  libgojni.so
  libmonero_libwallet2_api_c.so
  libsp_scanner.so
  libwownero_libwallet2_api_c.so
  ```

2. Build Generated Files:
- Profile files (baseline.prof, baseline.profm)
- Resource table (resources.arsc)
- Asset manifests (AssetManifest.bin, NOTICES.Z)

3. Resource Organization:
```
Different resource directories:
- drawable-ldrtl-hdpi-v17 vs drawable-ldrtl-xxhdpi-v17
- drawable-xhdpi-v4
- drawable-xxhdpi-v4
```

4. Signing Related (Expected):
```
Only in fromOfficial: stamp-cert-sha256
```

## Conclusion:
The Cake Wallet build is currently not reproducible. While we successfully generated split APKs matching the official release format, there are still significant differences in:
1. Core application binaries (dex files)
2. Native libraries 
3. Resource organization
4. Build-generated assets

For this reason, for now cake wallet is **not verifiable**.

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
