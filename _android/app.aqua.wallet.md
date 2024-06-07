---
wsId: aquaWallet
title: Aqua Wallet
altTitle: 
authors: 
    - bit-aloo
users: 10000+
appId: app.aqua.wallet.md
appCountry: 
released: 2024-01-02
updated: 2024-05-16
version: 0.1.54
stars: 
ratings: 
reviews: 
size: 27.08 MB
website: https://aquawallet.io/
repository: https://github.com/AquaWallet/aqua-wallet
issue: https://github.com/AquaWallet/aqua-wallet/issues/31
icon: aquaWallet.png
bugbounty: 
meta: ok
verdict: ftbfs
date: 2024-06-05
signer: 
reviewArchive: 
twitter: AquaBitcoin
social: 
    - https://x.com/AquaBitcoin
redirect_from: 
developerName: aquawallet-admin
features: 
- ln

---

## App Description from Google Play

> Bitcoin and Layer 2 Wallet
>
> Dive into the Bitcoin Revolution with AQUA: simple saving, spending, and financial empowerment. Be an Aquanaut, surf the waves of freedom, and build your future.
>
>Key Features:
>
>⚡️Native Bitcoin and Layer 2: Seamlessly transact in Bitcoin, Lightning, and Liquid assets including Tether USDt. AQUA is your passport to financial inclusion, designed for Latin America and embraced by Bitcoin Maximalists globally.
>
>🔒 Non-Custodial Core: Own your keys and your assets. AQUA is built on the cornerstone principle of self-sovereignty, giving you control over your Bitcoin and your money as a whole.
>
>🌊 Liquid Network Pioneer: AQUA was one of the first wallets to support Liquid sidechain functionality, enabling native support for Tether USDt and in the future, new assets like Bitcoin Bonds. 👀
>
>💵 Tether USDt on Liquid: Seamlessly transact with USDt - there is no second-best stablecoin. AQUA allows you to send and receive your USDt on Liquid as well as altcoin chains, all while storing your funds securely on the Liquid Network.
>
>🤝 User-Friendly Interface: AQUA's intuitive design ensures a streamlined user experience, making it the ideal wallet for both beginners and Bitcoin enthusiasts. AQUA is the wallet you can orange pill your grandma with!
>
>💧 Purified All-In-One: AQUA filters out the noise, holding only essential assets like Bitcoin and Tether, like an oasis of calm in the crypto jungle. Enjoy USDt without needing an altcoin for gas fees.
>
>💱Move between Bitcoin and Layer 2 Bitcoin with ease. Swap from Layer 2 Bitcoin to USDt instantly in a global peer-to-peer marketplace. AQUA can do it all!
>
>⚙️ Future-Ready Vision: A growing network of Marketplace providers offering different financial products to let you buy Bitcoin and more. We’re committed to continuous evolution, ensuring our users can access the financial tools they need.
>
>🚀 Live the Aquanaut Life: Be the hero of the Bitcoin age. The Aquanaut is a sovereign individual, spreading positivity and helping others become self-sovereign. Join the Aquanaut movement today.
>
>🏄 Download AQUA now and Surf the Waves of Freedom!

## Analysis

- Automatic account creation, with no procedures
- The seed phrase was available to view in advanced settings
- I requested Aqua wallet to provide build instructions using a Docker container. This app is **[for verification](https://github.com/AquaWallet/aqua-wallet/issues/31)**.

# 2024-05-26 Build Attempt

This Dockerfile sets up a development environment suitable for working with the Flutter and Rust technologies. Here is a step-by-step breakdown of each command in the Dockerfile:

## Base Image

- `FROM instrumentisto/flutter:3.10`
  - This command sets up the base image using `instrumentisto/flutter` at version `3.10`. This image is pre-configured with essential tools and libraries for Flutter development.

## Installing Rust

- `RUN curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh -s -- -y`
  - Installs Rust using `curl` to download and execute the Rust installation script from the official source. The `-y` flag automatically agrees to the license agreement and other prompts.
- `RUN source ~/.bashrc`
  - Sources the `.bashrc` file to ensure that the Rust environment variables are correctly set up for subsequent commands.
- `RUN rustup install 1.67.1 1.72.0 1.73.0 -y;`
  - Installs specific versions of Rust (`1.67.1`, `1.72.0`, `1.73.0`) using `rustup`. The `-y` flag is used to confirm installation without manual intervention.
- `RUN rustup default 1.67.1;`
  - Sets Rust `1.67.1` as the default version for the current environment.

## Installing Flutter Version Management (FVM)

- `RUN curl -fsSL https://fvm.app/install.sh | bash;`
  - Installs FVM (Flutter Version Management) using `curl` to download and execute the installation script. This tool helps manage multiple Flutter SDK versions.

## Setting Up the Working Directory

- `WORKDIR /mnt`
  - Sets `/mnt` as the working directory for any RUN, CMD, ENTRYPOINT, COPY, and ADD instructions that follow in the Dockerfile.

## Cloning the Repository

- `RUN git clone https://github.com/AquaWallet/aqua-wallet.git;`
  - Clones the `aqua-wallet` repository from GitHub into the working directory. This repository contains the source code needed for the project.

## Setting Flutter Version with FVM

- `RUN fvm use 3.10.6;`
  - Uses FVM to switch to Flutter version `3.10.6` for this project.

## Project Setup

- `RUN make setup;`
  - Runs the `make setup` command which typically involves setting up the project, installing dependencies, and performing initial configuration.

## Build Command

- `CMD ["flutter","build","apk"]`
  - Specifies the command to run by default when a container is started from the image. This command builds an APK using Flutter.

```
FAILURE: Build failed with an exception.

- What went wrong:
A problem was found with the configuration of task ':app:packageRelease' (type 'PackageApplication').
  - In plugin 'com.android.internal.version-check' type 'com.android.build.gradle.tasks.PackageApplication' property 'signingConfigData.signingConfigData.storeFile' specifies file '/mnt/android/android_keys/keystore.jks' which doesn't exist.

    Reason: An input file was expected to be present but it doesn't exist.

    Possible solutions:
      1. Make sure the file exists before the task is called.
      2. Make sure that the task which produces the file is declared as an input.

    Please refer to <https://docs.gradle.org/7.5/userguide/validation_problems.html#input_file_does_not_exist> for more details about this problem.

- Try:

> Run with --stacktrace option to get the stack trace.
> Run with --info or --debug option to get more log output.
> Run with --scan to get full insights.

- Get more help at <https://help.gradle.org>

BUILD FAILED in 7m 7s
Running Gradle task 'assembleRelease'...                          428.6s
Gradle task assembleRelease failed with exit code 1
```
We raised an issue with them on [GitHub](https://github.com/AquaWallet/aqua-wallet/issues/31).

You can also view our previous attempts to bring this to the product developer's attention [here](https://github.com/AquaWallet/aqua-wallet/issues/9).

Additionally, we contacted the CEO at [x](https://x.com/dannybuntu/status/1798649694236864934), as shown in the link.
