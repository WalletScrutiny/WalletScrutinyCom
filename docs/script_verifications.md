# Scripts for Reproducible Verifications

We need to agree on a set of standards for the scripts used to reproduce verifications to achieve this 2 goals:

1. Verifications need to be reproducible themselves, so they need to be able to be ran in our users' computers.
2. We need to be able to run the scripts automatically on the build server when a new version is released.

## Verifications need to be reproducible themselves
Scripts need to be able to be ran in our users' computers so they can verify the verifications. The users would think something like this: "Ah, new version of Zeus got released, let's see if WalletScrutiny got it. Yes, they got it! I'll try to repeat the verification of this guy to see if I can get the same result, by downloading his script and running it on my own computer".

While it's impossible to make a script that works on all the computers in the world, we can increase the odds by following these some rules:

## Scripts should be able to run automatically on the build server when a new version is released

We need to be able to run the scripts automatically on the build server when a new version is released. This is important because we need to be able to verify the verifications automatically and in a reproducible way when a new version is released.


# Rules

1. Scripts need to be `run as a user`, not root
2. Scripts should `use the directory in which they are executed` as much as possible, so we don't pulute users' computers. If not possible for any reason, we should use standard temporary directories like /tmp, not something like /var/shared
3. We should make it as easy as possible for our users to repeat the verification
4. Users shouldn't need to install dependencies besides `docker/podman`. That way, we can install everything inside the container, so users don't need to install anything else
5. We `cannot rely on our build server` utilities or scripts, as people won't have access to it
6. We `cannot rely on scripts` that are `in the WS gitlab repo`
7. We should use `as little files as possible`, typically only one script per verification, but if needed, all the other assets (Dockerfile, etc) should be uploaded to the verification
8. The script used to launch the build verification process must end with `build.sh`, so it could be `zeus_build.sh`.
9. Several combinations of architectures and types for the same application will be launched in parallel, so the script should be able to handle this using different names for resources that are specific to each combination. The execution of each script will be done in a different directory, but shared resources like containers should be named accordingly to the combination they are for.
10. At the end of the script execution, a file called `COMPARISON_RESULTS.yaml` must be generated.

```yaml
date: 2025-11-24T09:03:00+0000
script_version: v0.8.0
build_type: standalone
results:
  - architecture: linux64
    files:
      - filename: base.apk
        hash: abc123...
        match: true
      - filename: config.arm64_v8a.apk
        hash: def456...
        match: true
  - architecture: x86_64-linux
    files:
      - filename: config.en.apk
        hash: ghi789...
        match: true
      - filename: config.xxhdpi.apk
        hash: jkl012...
        match: false
```

The important parts:
- the `architecture` is taken from the `--arch` parameter passed to the script
- the `hash` of the produced file (3rd token)
- the `match` that reflects if it's reproducible (true) or not-reproducible (false) in the (4rd token).

11. The call parameters for the script should be:

`--version`: version of the app (without the v prefix)

`--arch`: (optional) architecture we want to compile (x86_64-linux-gnu, arm64-apple-darwin, ...)

`--type`: (optional) type of the app (bitcoin, multi, ...)

`--apk`: (optional, Android-only) APK file supplied by the user instead of downloading from a store. Desktop/hardware scripts may omit this parameter.

12. If a smartphone connected to the computer is needed, notify the user at the beginning of the script so he knows what to do

# Results File

The results file should be created by the build script after compilation. It should be named `COMPARISON_RESULTS.yaml` and be in the same directory as the script. It should be in YAML format and contain the following information:

- `date`: the date and time of the verification
- `script_version`: the version of the script
- `build_type`: the type of the build (standalone, bundle, etc)
  - **CLARIFICATION (2025-12-02):** This field should contain the **package type** from the `--type` CLI parameter (e.g., `deb`, `tarball`, `zip`, `msi`, `appimage`), NOT the literal string "standalone". The term "standalone" refers to standalone scripts vs bundle mode, but the actual YAML value should be the package type. See: ~/work/ws-notes/script-notes/desktop/wasabi/wasabi-yaml-compliance-fix-v1.3.2.md
- `results`: an array of objects with the following information:
  - `- filename`: the name of the binary file that was compiled
  - `architecture`: the architecture of the file (must match what was passed as a parameter to the script)
  - `status`: the status of the verification (reproducible, not_reproducible, ftbfs, spam, notag, nosource, warning, obfuscated)
  - `match`: true if the hash of the binary file matches the hash of the compiled file, false otherwise
  - `hash`: an array with the hashes of the files
    - **CLARIFICATION (2025-12-02):** This description is ambiguous. The correct implementation is: when using the `files:` array structure, each file entry has a **scalar** `hash:` field (e.g., `hash: abc123...`), NOT a nested array. The "array" refers to multiple file entries in the `files:` array, each with its own scalar hash. See authoritative examples in ~/work/ws-notes/script-notes/yaml-output-guidelines.md v2.1.0

**NOTE:** For detailed YAML structure with concrete examples, see ~/work/ws-notes/script-notes/yaml-output-guidelines.md v2.1.0 (2025-11-27), which supersedes the brief descriptions above.

# Wallet files

Wallet files (.md) need to have 2 new fields so the Automated Build Server starts building binaries when a new version is released:

```yaml
builds:
  - arch: win64
    types: [setup, portable, standalone]
  - arch: x86_64-linux-gnu
    types: [appimage, tarball]
```

Both fields (architectures and types) are optional, meaning that if there is just one type of binary for a wallet, there is no need to put the `types` field.

The Build Server will iterate through all combinations of architectures and types, passing the appropiate `--arch` and `--type` parameters to the build script.
