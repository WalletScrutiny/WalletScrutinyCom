---
title: Cypherock X1
appId: cypherockx1
authors:
- kiwilamb
- danny
- Vipul
- leo
- Mohammad
released: 2022-04-07
discontinued: 
updated: 2024-07-02
version: 0.6.768
binaries: https://github.com/Cypherock/x1_wallet_firmware/releases/
dimensions:
- 30
- 64
- 15
weight: 200
provider: Cypherock
providerWebsite: https://cypherock.com/
website: https://www.cypherock.com/
shop: https://shop.cypherock.com/
country: IN
price: 199USD
repository: https://github.com/Cypherock/x1_wallet_firmware
issue: 
icon: cypherockx1.png
bugbounty: 
meta: ok
verdict: reproducible
date: 2023-05-25
signer: 
reviewArchive:
- data: 2023-04-06
  version: 0.4.2307
  appHash: 09ed533290cdff4ca5f8148597a4d0a924ab5f10010a30ec2866abd39558a62d
  gitRevision: 78a98a9cb67b79f007cd337b1b1f0a6e5550e8fb
  verdict: reproducible
twitter: CypherockWallet
social:
- https://www.linkedin.com/company/cypherockwallet
- https://www.youtube.com/playlist?list=PL0db5IfQ4iyriWCgby_rJKeG31BLoxW7k
features: 

---

**Disclaimer:** Vipul is the main author of this Analysis and also a contributor
at Cypherock.

Cypherock was announced in a Bitcointalk ANN thread on February 14, 2020.

Cypherock X1 uses Shamir Secret Sharing to split the private key into 5 shards. Each of the 5 shards are independently stored on the hardware components, namely the X1 Wallet and 4 NFC enabled X1 cards. By implementing a 2/5 cryptographic threshold, a user only requires the X1 Wallet and 1 X1 card to re-create the private key and conduct transactions. Additionally, users don’t need to maintain any form of seed phrase backup as the hardware components themselves act as recovery tools. Cypherock’s private key management architecture not only eliminates the single point of failure of storing private keys in a singular location, but also solves for risks associated with seed phrase backups.
 
## Key features
- The code for the X1 Wallet is [open source](https://github.com/Cypherock/x1_wallet_firmware)
- Users can create a new wallet on the device or import their existing BIP39 compatible wallet to Cypherock X1 without connecting to the internet
- The X1 Wallet is the interfacing device on which the seed regeneration and transaction operations are performed. X1 Wallet also stores 1 of the 5 Shamir shares.
- Each of the 4 remaining Shamir shares is stored in a EAL5+ tamper resistant secure element chips. These are the same smart cards that are used in commercial debit and credit cards.
- Private keys can be recovered by tapping any 1 out of the 4 X1 cards on the X1 Wallet. Shamir secret share stored in the X1 cards and X1 Wallet can optionally be protected using a PIN. The recovered keys are stored in a volatile memory on the X1 Wallet which gets wiped out as soon as the operation is done.
- As Cypherock X1 Wallet does not store the private key as a whole, it is impossible to steal crypto assets in rest state.
- X1 Wallet supports upto 4 wallet recovery phrases, which can be used for transactions or even as a backup.
- X1 Wallet user can view the portfolio of all the 4 wallets from a single screen on their PC on the companion Cypherock CySync desktop application.
- X1 Wallet provides increased security against $5 wrench attack by distributing card into different geographical locations.
- X1 Wallet provides a 5 way navigation switch to perform user actions such as screen navigation and text input.

From the [FAQ](https://www.cypherock.com/faq/): Can the company somehow steal the digital assets of the user?
- It is not possible for the company to steal the digital assets of the users. Cypherock X1 Wallet can recreate the private keys without internet access. The device needs to be connected to the internet just for broadcasting the transaction on the blockchain.
- The provider further claims to use entropy from the ATECC608A "secure element" (which is not open to public audit) as well as from the microprocessor which runs the open source code. Thus, it should be able to prevent poor entropy backdoors in the closed source of the ATECC608A.

## Public repository containing source code

- Cypherock X1 Wallet firmware is open sourced, hosted in GitHub repo: [Cypherock/x1_wallet_firmware](https://github.com/Cypherock/x1_wallet_firmware)
- Latest release source code: [Release v0.4.1290](https://github.com/Cypherock/x1_wallet_firmware/releases/tag/v0.4.1290)
- Cypherock X1 Wallet firmware is released in 2 flavors, “***initial firmware***” and “***main firmware***”.
  - ***Initial firmware*** is installed on the device during manufacturing. It provides minimum functionality such as X1 Wallet and X1 Card authentication which checks if the product is genuine or not. This firmware does not support any wallet related functionality. The initial firmware ceases to exist before any wallet activity is initiated.
  - ***Main firmware*** full fledged wallet related functionality and is installed on the device via the companion Cypherock CySync desktop application.

## Reproducibility of the release binary from the source code
- Cypherock X1 Wallet firmware binary is signed by two private keys. The signature and a signed header is appended on top of firmware binary to form the complete Cypherock X1 Wallet firmware image. 
- An important thing to note here is that the Cypherock X1 Wallet firmware release binary is compiled using Docker. 
- Fingerprint (SHA256 digest) of the latest Cypherock X1 Wallet firmware binary (unsigned) can be found on the release page: [Release v0.4.1290](https://github.com/Cypherock/x1_wallet_firmware/releases/tag/v0.4.1290)
- The docker file corresponding to the latest release can be found here: [Dockerfile v0.4.1290](https://github.com/Cypherock/x1_wallet_firmware/blob/v0.4.1290/Dockerfile)
- List of tools required to successfully build the project can be found here: [Building project](https://github.com/Cypherock/x1_wallet_firmware/tree/v0.4.1290#building-project)
- Sequence of commands run on docker can be found here: [Docker commands v0.4.1290](https://github.com/Cypherock/x1_wallet_firmware/blob/v0.4.1290/.github/workflows/containerized-build.yml)

### Reproducing the Cypherock X1 Wallet Initial firmware v0.4.1290 on Windows 11

* On Git Bash Shell, checkout X1 Wallet firmware using tag:
        
```
MINGW64 ~/Desktop/Cypherock/X1_wallet/Firmware/v0.4.1290 ((v0.4.1290)) $ git clone git@github.com:Cypherock/x1_wallet_firmware.git .  --recurse-submodules
MINGW64 ~/Desktop/Cypherock/X1_wallet/Firmware/v0.4.1290 ((v0.4.1290)) $ git checkout v0.4.1290
```

* On Powershell, setup Docker and compile:

```
PS C:\Users\LENEVO\Desktop\Cypherock\X1_wallet\Firmware\v0.4.1290>  docker build . --file Dockerfile --tag x1-wallet-app-env
PS C:\Users\LENEVO\Desktop\Cypherock\X1_wallet\Firmware\v0.4.1290>  mkdir -p build
PS C:\Users\LENEVO\Desktop\Cypherock\X1_wallet\Firmware\v0.4.1290>  docker run -v ${pwd}/build:/out -it x1-wallet-app-env /bin/ash
/home/build/Release # mkdir -p /dist/initial && cd /home
/home/build/Release # cd build/Release/
/home/build/Release # cmake -DDEV_SWITCH=OFF -DDEBUG_SWITCH=OFF -DSIGN_BINARY=OFF -DCMAKE_BUILD_TYPE:STRING=Release -DFIRMWARE_TYPE=Initial -DCMAKE_EXPORT_COMPILE_COMMANDS:BOOL=ON -DCMAKE_BUILD_PLATFORM:STRING=Device -G Ninja ../../
/home/build/Release # ninja
/home/build/Release # sha256sum Cypherock-Initial.bin
dc665362d2bc1c15c5105e129694a2a31c8de1ba0245534244bb15500b8af2ee  Cypherock-Initial.bin
cp Cypherock-*.* /dist/initial && cp -a /dist/. /out
exit
```

* Compare from the Cypherock-Initial.bin (unsigned) [release binary](https://github.com/Cypherock/x1_wallet_firmware/actions/runs/3861423676).

```
MINGW64 ~/Desktop/Cypherock/X1_wallet/Firmware/v0.4.1290 ((v0.4.1290)) $ sha256sum.exe initial-release-outputs/release/Cypherock-Initial.bin
dc665362d2bc1c15c5105e129694a2a31c8de1ba0245534244bb15500b8af2ee *initial-release-outputs/release/Cypherock-Initial.bin
```

***Fingerprint (SHA256 hash) of released unsigned initial X1 Wallet firmware binary and compiled initial X1 Wallet firmware binary matches. Therefore, we conclude that the firmware is reproducible.***


### Reproducing the Cypherock X1 Wallet Main firmware v0.4.1290 on Windows 11
* On Git Bash Shell, checkout X1 Wallet firmware using tag:
        
```
MINGW64 ~/Desktop/Cypherock/X1_wallet/Firmware/v0.4.1290 ((v0.4.1290)) $ git clone git@github.com:Cypherock/x1_wallet_firmware.git . --recurse-submodules
MINGW64 ~/Desktop/Cypherock/X1_wallet/Firmware/v0.4.1290 ((v0.4.1290)) $ git checkout v0.4.1290
```

* On Powershell, setup Docker and compile:

```
PS C:\Users\LENEVO\Desktop\Cypherock\X1_wallet\Firmware\v0.4.1290>  docker build . --file Dockerfile --tag x1-wallet-app-env
PS C:\Users\LENEVO\Desktop\Cypherock\X1_wallet\Firmware\v0.4.1290>  mkdir -p build
PS C:\Users\LENEVO\Desktop\Cypherock\X1_wallet\Firmware\v0.4.1290>  docker run -v ${pwd}/build:/out -it x1-wallet-app-env /bin/ash
/home/build/Release # mkdir -p /dist/main && cd /home
/home/build/Release # cd build/Release/
/home/build/Release # cmake -DDEV_SWITCH=OFF -DDEBUG_SWITCH=OFF -DSIGN_BINARY=OFF -DCMAKE_BUILD_TYPE:STRING=Release -DFIRMWARE_TYPE=Main -DCMAKE_EXPORT_COMPILE_COMMANDS:BOOL=ON -DCMAKE_BUILD_PLATFORM:STRING=Device -G Ninja ../../
/home/build/Release # ninja
/home/build/Release # sha256sum Cypherock-Main.bin
fe5dd33a719eff4e2aa869108ba139e6f87204e6263870b0c5da1113b72ac32c  Cypherock-Main.bin
cp Cypherock-*.* /dist/main && cp -a /dist/. /out
exit
```

* Compare from the Cypherock-Main.bin (unsigned) [release binary](https://github.com/Cypherock/x1_wallet_firmware/actions/runs/3861423676).

```
MINGW64 ~/Desktop/Cypherock/X1_wallet/Firmware/v0.4.1290 ((v0.4.1290))
$ sha256sum.exe main-release-outputs/release/Cypherock-Main.bin
fe5dd33a719eff4e2aa869108ba139e6f87204e6263870b0c5da1113b72ac32c *main-release-outputs/release/Cypherock-Main.bin
```

***Fingerprint (SHA256 hash) of released unsigned main X1 Wallet firmware binary and compiled main X1 Wallet firmware binary matches. Therefore, we conclude that the firmware is reproducible.***

## Installing firmware updates

- The user has the flexibility to install a firmware update or not. The secure bootloader, which forms the root of trust, verifies if the firmware is a newer version than the currently installed version and [verifies the source of the firmware](https://github.com/Cypherock/x1_wallet_firmware/blob/main/docs/bootloader.md) (through 2 signatures).
- Users can view the installed version and the commit hash of the release corresponding to the installed Cypherock X1 Wallet firmware binary and can verify it against the GitHub repository. This cross check should provide enough confidence to the user that the installed firmware binary matches the release binary on the public source. 
- However, based on feedback received from different users, Cypherock X1 Wallet team is planning to add a user configurable functionality, through which SHA256 digest of the newly installed firmware is displayed after a successful firmware update.

## Reproduced above procedure by Leo

Leo independently reproduced version `v0.4.2307` as follows:

```
$ git clone git@github.com:Cypherock/x1_wallet_firmware.git
$ cd x1_wallet_firmware/
$ git checkout v0.4.2307 
$ git submodule update --init --recursive
$ podman run --volume=${PWD}/build:/out --rm -it x1-wallet-app-env /bin/ash -c "\
    mkdir -p /dist/initial && cd /home/build/Release/ ;\
    cmake -DDEV_SWITCH=OFF -DDEBUG_SWITCH=OFF -DSIGN_BINARY=OFF -DCMAKE_BUILD_TYPE:STRING=Release -DFIRMWARE_TYPE=Initial -DCMAKE_EXPORT_COMPILE_COMMANDS:BOOL=ON -DCMAKE_BUILD_PLATFORM:STRING=Device -G Ninja ../../ ; \
    ninja; \
    cp Cypherock-*.* /dist/initial && cp -a /dist/. /out"
$ podman run --volume=${PWD}/build:/out --rm -it x1-wallet-app-env /bin/ash -c "\
    mkdir -p /dist/initial && cd /home/build/Release/ ;\
    cmake -DDEV_SWITCH=OFF -DDEBUG_SWITCH=OFF -DSIGN_BINARY=OFF -DCMAKE_BUILD_TYPE:STRING=Release -DFIRMWARE_TYPE=Main -DCMAKE_EXPORT_COMPILE_COMMANDS:BOOL=ON -DCMAKE_BUILD_PLATFORM:STRING=Device -G Ninja ../../ ; \
    ninja; \
    cp Cypherock-*.* /dist/initial && cp -a /dist/. /out"
$ wget https://github.com/Cypherock/x1_wallet_firmware/releases/download/v0.4.2307/Cypherock-{Initial,Main}.bin
$ sha256sum build/initial/Cypherock-Initial.bin Cypherock-Initial.bin build/initial/Cypherock-Main.bin Cypherock-Main.bin
757d8c49b8f084400e7c8631b7e8f5cbfe4b7d527cfd8a7e056c1f43f9232e63  build/initial/Cypherock-Initial.bin
757d8c49b8f084400e7c8631b7e8f5cbfe4b7d527cfd8a7e056c1f43f9232e63  Cypherock-Initial.bin
09ed533290cdff4ca5f8148597a4d0a924ab5f10010a30ec2866abd39558a62d  build/initial/Cypherock-Main.bin
09ed533290cdff4ca5f8148597a4d0a924ab5f10010a30ec2866abd39558a62d  Cypherock-Main.bin
```
## Reproduced by Mohammad

Mohammad independently reproduced version `v0.4.3075` with this results:

```
$ sha256sum build/Cypherock-Initial.bin Cypherock-Initial.bin build/Cypherock-Main.bin Cypherock-Main.bin
649f94d564c822291080ea27f81815c67ff08e60a3f6f00cd2936851ab9e98dd  build/Cypherock-Initial.bin
649f94d564c822291080ea27f81815c67ff08e60a3f6f00cd2936851ab9e98dd  Cypherock-Initial.bin
656945ae37510bb1b7452c97d27cd5b638ddb0119e44e9af5aa32e02302f458e  build/Cypherock-Main.bin
656945ae37510bb1b7452c97d27cd5b638ddb0119e44e9af5aa32e02302f458e  Cypherock-Main.bin
```
