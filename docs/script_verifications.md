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
8. The scripts used to launch the build process must end with `build.sh`, so it could be `zeus_build.sh`.
9. At the end of the script, a file called `COMPARISON_RESULTS.txt` must be generated. It can have a header explaining what's the file for, but it must have lines like this one:

```json
bitcoin-29.2.knots20251010-aarch64-linux-gnu.tar.gz - aarch64-linux-gnu - 700b1a110550a5ae69cabe0a75e41554d09b31a72883b3d92b9ff314f6da3b18 - 1 (MATCHES)
bitcoin-29.2.knots20251010-win64-codesigning.tar.gz - win64-codesigning - fab8b53f735c3287af57c24284939699e5297c0f065b9f64ef6edd7af2e8ee65 - 0 (DOESN'T MATCH)
```

The important parts:
- the `arch` (2nd token) is taken from the `--arch` parameter passed to the script
- the `hash` of the produced file (3rd token)
- the `number` that reflects if it's reproducible (1) or not-reproducible (0) in the (4rd token).

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