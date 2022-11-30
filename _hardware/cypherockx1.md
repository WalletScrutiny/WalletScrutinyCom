---
title: Cypherock X1
appId: cypherockx1
authors:
- kiwilamb
- danny
released: 
discontinued: 
updated: 
version: 
binaries: 
dimensions: 
weight: 5
provider: Cypherock
providerWebsite: https://cypherock.com/
website: https://www.cypherock.com/
shop: https://shop.cypherock.com/
country: IN
price: 99USD
repository: 
issue: 
icon: cypherockx1.png
bugbounty: 
meta: ok
verdict: unreleased
date: 2021-12-03
signer: 
reviewArchive: 
twitter: CypherockWallet
social:
- https://www.linkedin.com/company/cypherockwallet
- https://www.facebook.com/cypherock

---

Cypherock was announced in a Bitcointalk ANN thread on February 14, 2020.

It's key innovation point is it makes use of keycards to "divide" the private keys through a process called "sharding". Each keycard has to be scanned or tapped individually on the Cypherock hardware wallet in order to restore a wallet. To protect the private key, the user then has the option to physically locate each "X1 card" in a different location. After tapping the cards, the users can then verify the words by typing on the interface of the device. The users are then prompted with the option to destroy the paper backup.
 
## Private keys can be created offline

> The Cypherock X1 uses 2 of 5 Shamir Secret Sharing (with the option to change the threshold in future) along with tamper-resistant hardware to secure the user’s private keys. Simply put, it is like Multi-sig but for the wallet recovery phrase.The seed phrase gets divided into 4 shards and the device using the 2 of 5 SSS scheme and each of those shards gets stored in a unique X1 cards. The X1 cards can store upto 4 Wallets (read: Seed Phrase), each of which will be able to support multiple coins.

Source: [Bitcointalk ANN thread](https://bitcointalk.org/index.php?topic=5225800.0)

## Private keys are not shared 

> - The code for the X1 wallet **is** open source
> - Each shard will be stored in a EAL6+ tamper resistant secure element chips. As comparison, an iPhone has the same level of security chip for securing fingerprints.
> - Nothing will be stored in the X1 Wallet on which the computation will be done.
> - Keys can be recovered by tapping any 2 out of the 4 X1 cards on the X1 Wallet. Each X1 card can also be protected by a PIN just like any other hardware wallet. The recovered keys are stored in a volatile memory on the X1 Wallet which gets wiped out as soon as the operation is done.
> - The user can store 4 wallet recovery phrases in a single product.
> - The X1 cards can be distributed around different places to increase security of the funds and protect against $5 wrench attacks.

From the [FAQ](https://www.cypherock.com/faq/): Can the company somehow steal the digital assets of the user?

> It is not possible for the company to steal the digital assets of the users. You can use Cypherock X1 without internet access. The device would need to be connected to an internet connected device just for broadcasting the transaction. The private keys need not ever come in contact with an internet connected device.

## Interface

The device has a screen and one circular button that allows users to select the letters. It is quite tedious as the single button is very limited in the number of letters it can select with one push of this button. This is evident in the [video shown here](https://www.youtube.com/watch?v=VadX0ERgEn0).

## Public repository containing source code:
> - Cypherock X1 wallet firmware is open sourced, hosted in GitHub repo: [Cypherock/x1_wallet_firmware](https://github.com/Cypherock/x1_wallet_firmware)
> - Latest release source code: [Release v0.4.773](https://github.com/Cypherock/x1_wallet_firmware/releases/tag/v0.4.773)
> - Cypherock X1 wallet firmware is released in 2 flavors, “***initial firmware***” and “***main firmware***”.
    > - ***Initial firmware*** is installed on the device during manufacturing. It provides minimum functionality such as device authentication and card authentication which checks the genuinity of the product. This firmware does not support any wallet related functionality. The initial firmware ceases to exist before any wallet activity is initiated.
   > - ***Main firmware provides*** full fledged wallet related functionality and is installed on the device via the companion Cypherock CySync desktop application.
## Fingerprint of the latest release binary: 
> - Fingerprint (SHA256 digest) of the latest Cypherock X1 wallet firmware binary (unsigned) can be found on the release page: [Release v0.4.773](https://github.com/Cypherock/x1_wallet_firmware/releases/tag/v0.4.773)

## Reproducibility of the release binary from the source code
> - Cypherock X1 wallet firmware binary is signed by two private keys. The signature and a signed header is appended on top of firmware binary to form the complete Cypherock X1 wallet firmware image. 
> - An important thing to note here is that the Cypherock X1 wallet firmware release binary is compiled using Docker, so, the binary will be reproducible only if the environment settings match. 
> - The docker file corresponding to the latest release can be found here: [Dockerfile v0.4.773](https://github.com/Cypherock/x1_wallet_firmware/blob/v0.4.773/Dockerfile)
> - List of tools required to successfully build the project can be found here: [Building project](https://github.com/Cypherock/x1_wallet_firmware/tree/v0.4.773#building-project)
> - Sequence of commands run on docker can be found here: [Docker commands v0.4.773](https://github.com/Cypherock/x1_wallet_firmware/blob/v0.4.773/.github/workflows/containerized-build.yml)

Alternatively, one can follow below commands in a *powershell* window to build the Cypherock X1 wallet firmware:
* For Initial firmware - unsigned binary will be generated at build/initial/Cypherock-Initial.bin
        
        docker build . --file Dockerfile --tag x1-wallet-app-env
        mkdir -p build
        docker run -v ${pwd}/build:/out -it x1-wallet-app-env /bin/ash
        mkdir -p /dist/initial && cd /home
        cd build/Release/
        cmake -DDEV_SWITCH=OFF -DDEBUG_SWITCH=OFF -DSIGN_BINARY=OFF -DCMAKE_BUILD_TYPE:STRING=Release -DFIRMWARE_TYPE=Initial -DCMAKE_EXPORT_COMPILE_COMMANDS:BOOL=ON -DCMAKE_BUILD_PLATFORM:STRING=Device -G Ninja ../../
        ninja
        cp Cypherock-*.* /dist/initial && cp -a /dist/. /out
        exit

* For Main firmware - unsigned binary will be generated at build/main/Cypherock-Main.bin
        
        docker build . --file Dockerfile --tag x1-wallet-app-env
        mkdir -p build
        docker run -v ${pwd}/build:/out -it x1-wallet-app-env /bin/ash
        mkdir -p /dist/main && cd /home
        cd build/Release/
        cmake -DDEV_SWITCH=OFF -DDEBUG_SWITCH=OFF -DSIGN_BINARY=OFF -DCMAKE_BUILD_TYPE:STRING=Release -DFIRMWARE_TYPE=Main -DCMAKE_EXPORT_COMPILE_COMMANDS:BOOL=ON -DCMAKE_BUILD_PLATFORM:STRING=Device -G Ninja ../../
        ninja
        cp Cypherock-*.* /dist/main && cp -a /dist/. /out
        exit
## User action before firmware update
> - The user has the flexibility to install a firmware update or not. The secure bootloader, which forms the root of trust, verifies if the firmware is a newer version than the currently installed version and [verifies the source of the firmware](https://github.com/Cypherock/x1_wallet_firmware/blob/main/docs/bootloader.md) (through 2 signatures).
> - Users can view the installed version and the commit hash of the release corresponding to the installed Cypherock X1 wallet firmware binary and can verify it against the GitHub repository. This cross check should provide enough confidence to the user that the installed firmware binary matches the release binary on the public source. 
> - However, based on feedback received from different users, Cypherock X1 wallet team is planning to add a user configurable functionality, through which SHA256 digest of the newly installed firmware is displayed after a successful firmware update.