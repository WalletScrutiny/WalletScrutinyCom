# Scripts for Reproducible Verifications

We need to agree on a set of standards for the scripts used to reproduce verifications to achieve these 2 goals:

1. Verifications need to be reproducible themselves, so they need to be able to be run in our users' computers.
2. We need to be able to run the scripts automatically on the build server when a new version is released.

## Verifications need to be reproducible themselves
Scripts need to be able to be run in our users' computers so they can verify the verifications. The users would think something like this: "Ah, new version of Zeus got released, let's see if WalletScrutiny got it. Yes, they got it! I'll try to repeat the verification of this guy to see if I can get the same result, by downloading his script and running it on my own computer".

While it's impossible to make a script that works on all the computers in the world, we can increase the odds by following some rules:

## Scripts should be able to run automatically on the build server when a new version is released

We need to be able to run the scripts automatically on the build server when a new version is released. This is important because we need to be able to verify the verifications automatically and in a reproducible way when a new version is released.


# Rules

1. Scripts need to be `run as a user`, not root
2. Scripts should `use the directory in which they are executed` as much as possible, so we don't pollute users' computers. If not possible for any reason, we should use standard temporary directories like /tmp, not something like /var/shared
3. We should make it as easy as possible for our users to repeat the verification
4. Users shouldn't need to install dependencies besides `docker/podman`. That way, we can install everything inside the container, so users don't need to install anything else
5. We `cannot rely on our build server` utilities or scripts, as people won't have access to it
6. We `cannot rely on scripts` that are `in the WS gitlab repo`
7. We should use `as little files as possible`, typically only one script per verification, but if needed, all the other assets (Dockerfile, etc) should be uploaded to the verification
8. The script used to launch the build verification process must end with `build.sh`, so it could be `zeus_build.sh`.
9. At the end of the script execution, a file called `COMPARISON_RESULTS.yaml` (preferred) or `COMPARISON_RESULTS.txt` (legacy) must be generated.

**YAML format (recommended):**
```yaml
date: 2025-11-25T09:30:00+0800
script_version: v1.0.0
results:
  - architecture: x86_64-linux-gnu
    files:
      - filename: bitcoin-29.2-x86_64-linux-gnu.tar.gz
        hash: 700b1a110550a5ae69cabe0a75e41554d09b31a72883b3d92b9ff314f6da3b18
        match: true
      - filename: bitcoin-29.2-win64.zip
        hash: fab8b53f735c3287af57c24284939699e5297c0f065b9f64ef6edd7af2e8ee65
        match: false
```

The important parts:
- `architecture`: matches the `--arch` parameter passed to the script
- `files[]`: array of files verified (can be one or multiple files)
  - `filename`: name of the file
  - `hash`: SHA256 hash of the built file
  - `match`: `true` if reproducible, `false` if not

---

## YAML Examples by Platform

### 1. Android - Single APK

When your script builds ONE APK file (standard Android app):

```yaml
date: 2025-11-25T10:00:00+0800
script_version: v1.0.0
results:
  - architecture: arm64-v8a
    files:
      - filename: electrum-4.6.2-arm64-v8a-release.apk
        hash: 896b2242cfcd5feba935406d293a1930c5ddd53076b4f399082dc287f3d70958
        match: true
```

**With types (e.g., bitcoin vs multi-coin wallet):**
```yaml
results:
  - architecture: armeabi-v7a
    files:
      - filename: zengo-bitcoin-2.1.0.apk
        hash: abc123def456...
        match: true
```

---

### 2. Android - Multiple Split APKs (Android App Bundle)

When your app uses AAB and generates **split APKs** (base.apk + config APKs):

```yaml
date: 2025-11-25T10:00:00+0800
script_version: v1.0.0
results:
  - architecture: arm64-v8a
    files:
      - filename: base.apk
        hash: 700b1a110550a5ae69cabe0a75e41554d09b31a72883b3d92b9ff314f6da3b18
        match: true
      - filename: split_config.arm64_v8a.apk
        hash: fab8b53f735c3287af57c24284939699e5297c0f065b9f64ef6edd7af2e8ee65
        match: true
      - filename: split_config.en.apk
        hash: 3c8f9e2a1b7d4e5f6a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0
        match: true
      - filename: split_config.xxhdpi.apk
        hash: 4d9e3b2c1a8f7e6d5c4b3a2f1e0d9c8b7a6f5e4d3c2b1a0f9e8d7c6b5a4f3e2
        match: true
```

**IMPORTANT:** All split APKs for one architecture go under ONE result entry with nested `files:[]` array.

**❌ WRONG - Don't do this:**
```yaml
# This will be REJECTED (duplicate architecture entries):
results:
  - architecture: arm64-v8a
    files:
      - filename: base.apk
        hash: abc...
        match: true
  - architecture: arm64-v8a    # ← DUPLICATE! Build server will reject this!
    files:
      - filename: split_config.arm64_v8a.apk
        hash: def...
        match: true
```

---

### 3. Desktop - Single Binary per Architecture

**Linux x86_64:**
```yaml
date: 2025-11-25T10:00:00+0800
script_version: v1.0.0
results:
  - architecture: x86_64-linux-gnu
    files:
      - filename: bitcoin-29.2-x86_64-linux-gnu.tar.gz
        hash: 700b1a110550a5ae69cabe0a75e41554d09b31a72883b3d92b9ff314f6da3b18
        match: true
```

**Windows:**
```yaml
results:
  - architecture: win64
    files:
      - filename: electrum-4.6.2-setup.exe
        hash: 896b2242cfcd5feba935406d293a1930c5ddd53076b4f399082dc287f3d70958
        match: true
```

**macOS (if supported):**
```yaml
results:
  - architecture: arm64-apple-darwin
    files:
      - filename: bitcoin-29.2-arm64-apple-darwin.dmg
        hash: abc123def456...
        match: true
```

---

### 4. Desktop - Multiple Files per Architecture

When you build **multiple artifacts** for the same architecture (e.g., tarball + signature file, or debug symbols):

```yaml
date: 2025-11-25T10:00:00+0800
script_version: v1.0.0
results:
  - architecture: x86_64-linux-gnu
    files:
      - filename: bitcoin-29.2-x86_64-linux-gnu.tar.gz
        hash: 700b1a110550a5ae69cabe0a75e41554d09b31a72883b3d92b9ff314f6da3b18
        match: true
      - filename: bitcoin-29.2-x86_64-linux-gnu-debug.tar.gz
        hash: fab8b53f735c3287af57c24284939699e5297c0f065b9f64ef6edd7af2e8ee65
        match: true
```

**With signature files (if you verify signatures too):**
```yaml
results:
  - architecture: win64
    files:
      - filename: electrum-4.6.2-setup.exe
        hash: 896b2242cfcd5feba935406d293a1930c5ddd53076b4f399082dc287f3d70958
        match: true
      - filename: electrum-4.6.2-setup.exe.asc
        hash: 3c8f9e2a1b7d4e5f6a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0
        match: true
```

---

### 5. Hardware - Single Firmware Binary

**Single firmware file per device:**
```yaml
date: 2025-11-25T10:00:00+0800
script_version: v1.0.0
results:
  - architecture: trezor-model-t
    files:
      - filename: trezor-2.9.1.bin
        hash: 700b1a110550a5ae69cabe0a75e41554d09b31a72883b3d92b9ff314f6da3b18
        match: true
```

---

### 6. Hardware - Multiple Firmware Binaries

**Multiple firmware files for different components or variants:**

```yaml
date: 2025-11-25T10:00:00+0800
script_version: v1.0.0
results:
  - architecture: onekey-mini
    files:
      - filename: firmware-ble-2.5.0.bin
        hash: 700b1a110550a5ae69cabe0a75e41554d09b31a72883b3d92b9ff314f6da3b18
        match: true
      - filename: firmware-stm32-2.5.0.bin
        hash: fab8b53f735c3287af57c24284939699e5297c0f065b9f64ef6edd7af2e8ee65
        match: true
      - filename: bootloader-2.5.0.bin
        hash: 3c8f9e2a1b7d4e5f6a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0
        match: false
```

---

### 7. Mixed Results (Some Match, Some Don't)

When **some files are reproducible** but others aren't:

```yaml
date: 2025-11-25T10:00:00+0800
script_version: v1.0.0
results:
  - architecture: x86_64-linux-gnu
    files:
      - filename: bitcoin-29.2-x86_64-linux-gnu.tar.gz
        hash: 700b1a110550a5ae69cabe0a75e41554d09b31a72883b3d92b9ff314f6da3b18
        match: true
      - filename: bitcoin-29.2-win64.zip
        hash: fab8b53f735c3287af57c24284939699e5297c0f065b9f64ef6edd7af2e8ee65
        match: false    # ← This one doesn't match!
```

**Result:** Build server will mark verification as `not_reproducible` (because not ALL files match).

---

### 8. Legacy Format (Backward Compatibility)

Old scripts using single `hash` field still work:

```yaml
date: 2025-11-25T10:00:00+0800
script_version: v1.0.0
results:
  - architecture: win64
    hash: 896b2242cfcd5feba935406d293a1930c5ddd53076b4f399082dc287f3d70958
    match: true
```

**Note:** This is automatically converted internally to the nested `files:[]` format. New scripts should use the nested format.

---

## Important Rules

1. **ONE architecture entry per result** - If you have multiple files for the same architecture, nest them under `files:[]` array
2. **Duplicate architectures are rejected** - Build server will error if it finds the same architecture multiple times
3. **Overall verdict** - Verification is `reproducible` only if **ALL** files have `match: true`
4. **Hash format** - Must be SHA256 (64 hexadecimal characters)
5. **Architecture naming** - Must match the `--arch` parameter passed to your script

---

**TXT format (legacy, still supported):**
```
bitcoin-29.2.knots20251010-aarch64-linux-gnu.tar.gz - aarch64-linux-gnu - 700b1a110550a5ae69cabe0a75e41554d09b31a72883b3d92b9ff314f6da3b18 - 1 (MATCHES)
bitcoin-29.2.knots20251010-win64-codesigning.tar.gz - win64-codesigning - fab8b53f735c3287af57c24284939699e5297c0f065b9f64ef6edd7af2e8ee65 - 0 (DOESN'T MATCH)
```

Format: `filename - architecture - hash - match_status`

10. The parameters of the script should be:

   `--version`: version of the app (without the v prefix)

   `--arch`: (optional) architecture we want to compile (x86_64-linux-gnu, arm64-apple-darwin, ...)

   `--type`: (optional) type of the app (bitcoin, multi, ...)

   `--apk`: (optional) apk file of the app if it's provided by the user, instead of downloading it from the github/homepage of the app

11. If a smartphone connected to the computer is needed, notify the user at the beginning of the script so he knows what to do

# Wallet files

Wallet files (.md) need to have 2 new fields so the Automated Build Server starts building binaries when a new version is released:

```json
architectures:
- x86_64-linux-gnu
- win64
types:
- bitcoin
- multi
```

Both fields (architectures and types) are optional, meaning that if there is just one type of binary for a wallet, there is no need to put the `types` field.

The Build Server will iterate through all combinations of architectures and types, passing the appropiate `--arch` and `--type` parameters to the build script.