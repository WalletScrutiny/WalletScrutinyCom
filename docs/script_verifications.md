# Scripts for Reproducible Verifications

If you plan on creating a script to reproduce a Bitcoin wallet and attach it to a verification inside WalletScrutiny, you need to follow these rules. That way, our Automated Build Server will be able to run the script automatically when a new binary of the wallet is registered by users using [our Android app](https://zapstore.dev/apps/naddr1qvzqqqr7pvpzpytvkhls05a4rnhh76mt0a28nvgqrdqpcr5z2k8wrg39qnra2p7fqqtxxmmd9emkzmrvv468xcmjw46xjmne9eshquqr8p5tv).

Users will also be able to download the script and run it on their own computer to perform the verification themselves.

If you plan on creating a script to reproduce a Bitcoin wallet, we recommend that you go to the [WalletScrutiny Discord](https://discord.gg/yCNdcSJw9k) and tell us about it so we can advise you with the process.

# Rules

1. Scripts must use `podman` or `docker` to run the build process, so it is self-contained, repeatable, and reproducible. Thus, having podman or docker installed must be the only requirement. "sudo" is not allowed.
2. The script name must end with `build.sh`.
3. Build scripts must never need a smartphone connected to the computer.
4. At the end of the script execution, a file called `COMPARISON_RESULTS.yaml` must be generated with the result of the verification. See the `Results File` section below for details.
5. Build scripts for `hardware` or `desktop` wallet types must be able to handle multiple combinations of architectures and types for the same application. See the `Wallet files` section below for details on how to define the combinations.
6. The call parameters for the script must be the following:

* For `android`, `desktop` or `hardware` wallets when a binary file is provided by the user:
  - `--binary`: path to the binary file of the app to test (or directory containing the binary files)

* For `desktop` or `hardware` wallets, when a new version of the app is released (no binary file is provided by the user):
  - `--version`: version of the app (without the v prefix)
  - `--arch`: architecture we want to compile (x86_64-linux-gnu, arm64-apple-darwin, ...)
  - `--type`: type of the app (bitcoin, multi, ...)

7. Several combinations of architectures and types for the same application will be launched in parallel. The script must use different names for resources specific to each combination to avoid conflicts.
8. If the script needs to download assets from GitHub, like dependencies or other files, it can use the GitHub token that the Automated Build Server provides. An environment variable called `GITHUB_TOKEN` will be available to the script.
9. Ensure the script does not surpass 48,235 bytes so it fits in the content field of the file attachment event once base64 encoded.

# Results File

The results file should be named `COMPARISON_RESULTS.yaml` and be in the same directory as the script. It should be in YAML format and contain the following information:

```yaml
script_version: v0.8.0
verdict: reproducible
notes: |
  Uses the upstream build.sh script for reproducible builds.
  Expected differences (do not affect reproducibility verdict):
  - META-INF/*: Google Play signing files
  - stamp-cert-sha256: Certificate stamp from Google Play
```

- `script_version`: the version of the script
- `verdict`: the verdict of the verification
- `notes`: (optional) any note that could be useful to understand the verdict, or a description of the differences that were expected to be reproducible, but did not affect the reproducibility verdict

Possible values for `verdict`:
  - `reproducible`: Reproducible
  - `not_reproducible`: Not Reproducible
  - `ftbfs`: Failed to Build from Source

# Wallet files

In WalletScrutiny, wallet files contain the information about each wallet. You can find them in our [GitLab repository](https://gitlab.com/walletscrutiny/walletScrutinyCom), inside the directory corresponding to the wallet category (`_android`, `_iphone`, `_desktop`, `_hardware`, etc).

If you want your build script to be automatically run by the Automated Build Server when a binary appears on Nostr, you need to add the `builds` parameter to the wallet file. For `hardware` and `desktop` wallet types, you need to add the combinations of architectures and types that your script is able to test.

```yaml
builds:
  - arch: win64
    types:
      setup
      - "*.msi"
      portable
      - "*.portable.exe"
      standalone
      - "*.exe"
  - arch: x86_64-linux-gnu
    types:
      tarball:
      - "*-x86_64.tar.gz"
      deb:
      - "*_amd64.deb"
```

If the Automated Build Server is trying to reproduce a new version of the app, it will pass the `--version` parameter to the build script, and it will iterate through all the combinations of architectures and types defined in the `builds` array, passing the appropriate `--arch` and `--type` parameters to the build script.

If it's reproducing a binary file, it will pass the `--version` and `--binary` parameters to the build script. `binary` will be the path to the binary file provided by the user. If there are more than one binary, the directory containing the binary files will be passed. It will also pass the `--arch` and `--type` parameters corresponding to the binary file to the build script. For that to work correctly, you have to correctly add the file patterns to the `builds` array.
