---
title: "KeepKey"
appId: keepKey
authors:
- leo
released: 2014-08-01
discontinued: # date
latestUpdate: 2021-07-13
version: 7.1.7
binaries: https://github.com/keepkey/keepkey-firmware/releases
dimensions: [38, 93.5, 12.2]
weight: 54
website: https://shapeshift.com
shop: https://shapeshift.com/keepkey
country: US
price: 49USD
repository: https://github.com/keepkey/keepkey-firmware
issue: https://github.com/keepkey/keepkey-firmware/issues/283
icon: keepKey.png
bugbounty: 
verdict: reproducible
date: 2021-07-31
signer: 
reviewArchive:


providerTwitter: ShapeShift_io
providerLinkedIn: 
providerFacebook: ShapeShiftPlatform
providerReddit: 
---


**Update 2021-07-31**: Reid Rankin, a contributor to the project
[replied](https://github.com/keepkey/keepkey-firmware/issues/283#issuecomment-888604838)
to our questions about reproducibility and provided instructions on how to
reproduce the firmware after all. Find it [at the end of the Analysis](#upd0731).

{{ page.title }} is a clone of the
{% include walletLink.html wallet='hardware/trezorOne' verdict='true' %}
and as such we will hopefully come to the same conclusions.

> **Stress-Free Security**<br>
  Generate and manage your private keys offline in cold storage, guarded from
  computer vulnerabilities and viruses, while utilizing wallet software for safe
  transactions.

> **Sleek and Simple Display**<br>
  The large display gives clarity to every digital asset sent and received on
  your device. Each transaction must be manually approved using the confirmation
  button, giving you control and visibility over your transactions.

That sounds like it's a hardware wallet by our standards.

On their [help page](https://shapeshift.zendesk.com/hc/en-us/articles/360060952231-Is-KeepKey-Open-Source-)
they also clarify:

> **Is KeepKey Open Source?**<br>
  KeepKey’s firmware is 100% open source.<br>
  Take a look at our source code on [GitHub](https://github.com/keepkey) page!

So, let's see how that goes:

```
$ docker pull kktech/firmware:v5-beta
$ git clone git@github.com:keepkey/keepkey-firmware.git
```

... this command requires a configured github account. This should not be
necessary and work using `git clone https://github.com/keepkey/keepkey-firmware.git`
instead.

```
$ git submodule update --init --recursive
fatal: not a git repository (or any of the parent directories): .git
```

... of course this command works only in the newly created folder:

```
$ cd keepkey-firmware/
$ git submodule update --init --recursive
Submodule 'code-signing-keys' (https://github.com/keepkey/code-signing-keys.git) registered for path 'code-signing-keys'
Submodule 'deps/trezor-firmware' (https://github.com/keepkey/trezor-firmware.git) registered for path 'deps/crypto/trezor-firmware'
Submodule 'deps/device-protocol' (https://github.com/keepkey/device-protocol.git) registered for path 'deps/device-protocol'
Submodule 'googletest' (https://github.com/google/googletest.git) registered for path 'deps/googletest'
Submodule 'deps/python-keepkey' (https://github.com/keepkey/python-keepkey.git) registered for path 'deps/python-keepkey'
Submodule 'deps/qrenc/QR-Code-generator' (https://github.com/keepkey/QR-Code-generator.git) registered for path 'deps/qrenc/QR-Code-generator'
Submodule 'deps/sca-hardening/SecAESSTM32' (https://github.com/keepkey/SecAESSTM32.git) registered for path 'deps/sca-hardening/SecAESSTM32'
Cloning into 'code-signing-keys'...
Cloning into 'deps/crypto/trezor-firmware'...
Cloning into 'deps/device-protocol'...
Cloning into 'deps/googletest'...
Cloning into 'deps/python-keepkey'...
Cloning into 'deps/qrenc/QR-Code-generator'...
Cloning into 'deps/sca-hardening/SecAESSTM32'...
Submodule path 'code-signing-keys': checked out 'a6470bd8598e5e9a7bfc38bf139a5e5a616f05ec'
Submodule path 'deps/crypto/trezor-firmware': checked out '10a177abe2bebec6864ecba21e7cd9e66f6a43a0'
Submodule 'common/defs/ethereum/chains' (https://github.com/ethereum-lists/chains) registered for path 'deps/crypto/trezor-firmware/common/defs/ethereum/chains'
Submodule 'common/defs/ethereum/tokens' (https://github.com/ethereum-lists/tokens.git) registered for path 'deps/crypto/trezor-firmware/common/defs/ethereum/tokens'
Submodule 'crypto/tests/wycheproof' (https://github.com/google/wycheproof) registered for path 'deps/crypto/trezor-firmware/crypto/tests/wycheproof'
Submodule 'vendor/QR-Code-generator' (https://github.com/nayuki/QR-Code-generator.git) registered for path 'deps/crypto/trezor-firmware/vendor/QR-Code-generator'
Submodule 'vendor/fido2-tests' (https://github.com/trezor/fido2-tests.git) registered for path 'deps/crypto/trezor-firmware/vendor/fido2-tests'
Submodule 'legacy/libopencm3' (https://github.com/libopencm3/libopencm3.git) registered for path 'deps/crypto/trezor-firmware/vendor/libopencm3'
Submodule 'vendor/micropython' (https://github.com/trezor/micropython.git) registered for path 'deps/crypto/trezor-firmware/vendor/micropython'
Submodule 'legacy/vendor/nanopb' (https://github.com/nanopb/nanopb.git) registered for path 'deps/crypto/trezor-firmware/vendor/nanopb'
Submodule 'vendor/secp256k1-zkp' (https://github.com/ElementsProject/secp256k1-zkp.git) registered for path 'deps/crypto/trezor-firmware/vendor/secp256k1-zkp'
Cloning into 'deps/crypto/trezor-firmware/common/defs/ethereum/chains'...
Cloning into 'deps/crypto/trezor-firmware/common/defs/ethereum/tokens'...
Cloning into 'deps/crypto/trezor-firmware/crypto/tests/wycheproof'...
Cloning into 'deps/crypto/trezor-firmware/vendor/QR-Code-generator'...
Cloning into 'deps/crypto/trezor-firmware/vendor/fido2-tests'...
Cloning into 'deps/crypto/trezor-firmware/vendor/libopencm3'...
Cloning into 'deps/crypto/trezor-firmware/vendor/micropython'...
Cloning into 'deps/crypto/trezor-firmware/vendor/nanopb'...
Cloning into 'deps/crypto/trezor-firmware/vendor/secp256k1-zkp'...
Submodule path 'deps/crypto/trezor-firmware/common/defs/ethereum/chains': checked out '143a38eee7f5d7072969d25e7cf37760a2503b41'
Submodule path 'deps/crypto/trezor-firmware/common/defs/ethereum/tokens': checked out 'c0fd515d273adf532e9751ca7310e1e1b74975ad'
Submodule path 'deps/crypto/trezor-firmware/crypto/tests/wycheproof': checked out '2904be69e9d666bf3064fdc15093747e695cfae6'
Submodule path 'deps/crypto/trezor-firmware/vendor/QR-Code-generator': checked out '40d24f38aa0a8180b271b6c88be8633f842ed9d4'
Submodule path 'deps/crypto/trezor-firmware/vendor/fido2-tests': checked out '6dcf78409ac439da55a99290eaa6ad268ad6039e'
Submodule path 'deps/crypto/trezor-firmware/vendor/libopencm3': checked out '5617ed466444790b787b6df8d7f21d1611905fd1'
Submodule path 'deps/crypto/trezor-firmware/vendor/micropython': checked out 'f7e780ae16bc62519e6b78672e43ecae9138ed0a'
Submodule 'lib/asf4' (https://github.com/adafruit/asf4) registered for path 'deps/crypto/trezor-firmware/vendor/micropython/lib/asf4'
Submodule 'lib/axtls' (https://github.com/pfalcon/axtls) registered for path 'deps/crypto/trezor-firmware/vendor/micropython/lib/axtls'
Submodule 'lib/berkeley-db-1.xx' (https://github.com/pfalcon/berkeley-db-1.xx) registered for path 'deps/crypto/trezor-firmware/vendor/micropython/lib/berkeley-db-1.xx'
Submodule 'lib/btstack' (https://github.com/bluekitchen/btstack.git) registered for path 'deps/crypto/trezor-firmware/vendor/micropython/lib/btstack'
Submodule 'lib/libffi' (https://github.com/atgreen/libffi) registered for path 'deps/crypto/trezor-firmware/vendor/micropython/lib/libffi'
Submodule 'lib/lwip' (https://git.savannah.gnu.org/r/lwip.git) registered for path 'deps/crypto/trezor-firmware/vendor/micropython/lib/lwip'
Submodule 'lib/mbedtls' (https://github.com/ARMmbed/mbedtls.git) registered for path 'deps/crypto/trezor-firmware/vendor/micropython/lib/mbedtls'
Submodule 'lib/mynewt-nimble' (https://github.com/apache/mynewt-nimble.git) registered for path 'deps/crypto/trezor-firmware/vendor/micropython/lib/mynewt-nimble'
Submodule 'lib/nrfx' (https://github.com/NordicSemiconductor/nrfx.git) registered for path 'deps/crypto/trezor-firmware/vendor/micropython/lib/nrfx'
Submodule 'lib/nxp_driver' (https://github.com/hathach/nxp_driver.git) registered for path 'deps/crypto/trezor-firmware/vendor/micropython/lib/nxp_driver'
Submodule 'lib/stm32lib' (https://github.com/micropython/stm32lib) registered for path 'deps/crypto/trezor-firmware/vendor/micropython/lib/stm32lib'
Submodule 'lib/tinyusb' (https://github.com/hathach/tinyusb) registered for path 'deps/crypto/trezor-firmware/vendor/micropython/lib/tinyusb'
Cloning into 'deps/crypto/trezor-firmware/vendor/micropython/lib/asf4'...
Cloning into 'deps/crypto/trezor-firmware/vendor/micropython/lib/axtls'...
Cloning into 'deps/crypto/trezor-firmware/vendor/micropython/lib/berkeley-db-1.xx'...
Cloning into 'deps/crypto/trezor-firmware/vendor/micropython/lib/btstack'...
Cloning into 'deps/crypto/trezor-firmware/vendor/micropython/lib/libffi'...
Cloning into 'deps/crypto/trezor-firmware/vendor/micropython/lib/lwip'...
Cloning into 'deps/crypto/trezor-firmware/vendor/micropython/lib/mbedtls'...
Cloning into 'deps/crypto/trezor-firmware/vendor/micropython/lib/mynewt-nimble'...
Cloning into 'deps/crypto/trezor-firmware/vendor/micropython/lib/nrfx'...
Cloning into 'deps/crypto/trezor-firmware/vendor/micropython/lib/nxp_driver'...
Cloning into 'deps/crypto/trezor-firmware/vendor/micropython/lib/stm32lib'...
Cloning into 'deps/crypto/trezor-firmware/vendor/micropython/lib/tinyusb'...
Submodule path 'deps/crypto/trezor-firmware/vendor/micropython/lib/asf4': checked out 'd270f79aa16dd8fd4ae3b6c14544283dcb992e9c'
Submodule path 'deps/crypto/trezor-firmware/vendor/micropython/lib/axtls': checked out '43a6e6bd3bbc03dc501e16b89fba0ef042ed3ea0'
Submodule path 'deps/crypto/trezor-firmware/vendor/micropython/lib/berkeley-db-1.xx': checked out '35aaec4418ad78628a3b935885dd189d41ce779b'
Submodule path 'deps/crypto/trezor-firmware/vendor/micropython/lib/btstack': checked out 'c8b9823f68c6af0fa52e2c4e009aba4dbf257232'
Submodule path 'deps/crypto/trezor-firmware/vendor/micropython/lib/libffi': checked out 'e9de7e35f2339598b16cbb375f9992643ed81209'
Submodule path 'deps/crypto/trezor-firmware/vendor/micropython/lib/lwip': checked out '159e31b689577dbf69cf0683bbaffbd71fa5ee10'
Submodule path 'deps/crypto/trezor-firmware/vendor/micropython/lib/mbedtls': checked out '3f8d78411a26e833db18d9fbde0e2f0baeda87f0'
Submodule 'crypto' (https://github.com/ARMmbed/mbed-crypto) registered for path 'deps/crypto/trezor-firmware/vendor/micropython/lib/mbedtls/crypto'
Cloning into 'deps/crypto/trezor-firmware/vendor/micropython/lib/mbedtls/crypto'...
Submodule path 'deps/crypto/trezor-firmware/vendor/micropython/lib/mbedtls/crypto': checked out 'a78c958b17d75ddf63d8dd17255b6379dcbf259f'
Submodule path 'deps/crypto/trezor-firmware/vendor/micropython/lib/mynewt-nimble': checked out '97ce3eacaaa79e8ed6cf71717149ced4f5328ee7'
Submodule path 'deps/crypto/trezor-firmware/vendor/micropython/lib/nrfx': checked out '7a4c9d946cf1801771fc180acdbf7b878f270093'
Submodule path 'deps/crypto/trezor-firmware/vendor/micropython/lib/nxp_driver': checked out 'b618cb1d521cc9e133bdcd0fca154dee2d925dfe'
Submodule path 'deps/crypto/trezor-firmware/vendor/micropython/lib/stm32lib': checked out '58fee7c92bd576814d3f2afd92fbc62990270ecc'
Submodule path 'deps/crypto/trezor-firmware/vendor/micropython/lib/tinyusb': checked out 'a6b916ba85bef6aad50f1652532b02984dfe2484'
Submodule 'hw/mcu/microchip' (https://github.com/hathach/microchip_driver.git) registered for path 'deps/crypto/trezor-firmware/vendor/micropython/lib/tinyusb/hw/mcu/microchip'
Submodule 'hw/mcu/nordic/nrfx' (https://github.com/NordicSemiconductor/nrfx.git) registered for path 'deps/crypto/trezor-firmware/vendor/micropython/lib/tinyusb/hw/mcu/nordic/nrfx'
Submodule 'hw/mcu/nuvoton' (https://github.com/majbthrd/nuc_driver.git) registered for path 'deps/crypto/trezor-firmware/vendor/micropython/lib/tinyusb/hw/mcu/nuvoton'
Submodule 'hw/mcu/nxp' (https://github.com/hathach/nxp_driver.git) registered for path 'deps/crypto/trezor-firmware/vendor/micropython/lib/tinyusb/hw/mcu/nxp'
Submodule 'hw/mcu/sony/cxd56/spresense-exported-sdk' (https://github.com/sonydevworld/spresense-exported-sdk.git) registered for path 'deps/crypto/trezor-firmware/vendor/micropython/lib/tinyusb/hw/mcu/sony/cxd56/spresense-exported-sdk'
Submodule 'hw/mcu/st/st_driver' (https://github.com/hathach/st_driver.git) registered for path 'deps/crypto/trezor-firmware/vendor/micropython/lib/tinyusb/hw/mcu/st/st_driver'
Submodule 'hw/mcu/ti' (https://github.com/hathach/ti_driver.git) registered for path 'deps/crypto/trezor-firmware/vendor/micropython/lib/tinyusb/hw/mcu/ti'
Submodule 'tools/uf2' (https://github.com/microsoft/uf2.git) registered for path 'deps/crypto/trezor-firmware/vendor/micropython/lib/tinyusb/tools/uf2'
Cloning into 'deps/crypto/trezor-firmware/vendor/micropython/lib/tinyusb/hw/mcu/microchip'...
Cloning into 'deps/crypto/trezor-firmware/vendor/micropython/lib/tinyusb/hw/mcu/nordic/nrfx'...
Cloning into 'deps/crypto/trezor-firmware/vendor/micropython/lib/tinyusb/hw/mcu/nuvoton'...
Cloning into 'deps/crypto/trezor-firmware/vendor/micropython/lib/tinyusb/hw/mcu/nxp'...
Cloning into 'deps/crypto/trezor-firmware/vendor/micropython/lib/tinyusb/hw/mcu/sony/cxd56/spresense-exported-sdk'...
Cloning into 'deps/crypto/trezor-firmware/vendor/micropython/lib/tinyusb/hw/mcu/st/st_driver'...
Cloning into 'deps/crypto/trezor-firmware/vendor/micropython/lib/tinyusb/hw/mcu/ti'...
Cloning into 'deps/crypto/trezor-firmware/vendor/micropython/lib/tinyusb/tools/uf2'...
Submodule path 'deps/crypto/trezor-firmware/vendor/micropython/lib/tinyusb/hw/mcu/microchip': checked out '66b5a11995025426224e0ba6f377322e6e8893b6'
Submodule 'samd/asf4' (https://github.com/adafruit/asf4.git) registered for path 'deps/crypto/trezor-firmware/vendor/micropython/lib/tinyusb/hw/mcu/microchip/samd/asf4'
Cloning into 'deps/crypto/trezor-firmware/vendor/micropython/lib/tinyusb/hw/mcu/microchip/samd/asf4'...
Submodule path 'deps/crypto/trezor-firmware/vendor/micropython/lib/tinyusb/hw/mcu/microchip/samd/asf4': checked out '039b5f3bbc3f4ba4421e581db290560d59fef625'
Submodule path 'deps/crypto/trezor-firmware/vendor/micropython/lib/tinyusb/hw/mcu/nordic/nrfx': checked out '7a4c9d946cf1801771fc180acdbf7b878f270093'
Submodule path 'deps/crypto/trezor-firmware/vendor/micropython/lib/tinyusb/hw/mcu/nuvoton': checked out 'dc96fff794d14818c93ea1d4d760d51a014d70c5'
Submodule path 'deps/crypto/trezor-firmware/vendor/micropython/lib/tinyusb/hw/mcu/nxp': checked out 'b618cb1d521cc9e133bdcd0fca154dee2d925dfe'
Submodule path 'deps/crypto/trezor-firmware/vendor/micropython/lib/tinyusb/hw/mcu/sony/cxd56/spresense-exported-sdk': checked out 'b473b28a14a03f3d416b6e2c071bcfd4fb92cb63'
Submodule path 'deps/crypto/trezor-firmware/vendor/micropython/lib/tinyusb/hw/mcu/st/st_driver': checked out '3fc2e0f3db155b33177bb0705e0dd65cadb58412'
Submodule path 'deps/crypto/trezor-firmware/vendor/micropython/lib/tinyusb/hw/mcu/ti': checked out 'ed52d354c99e25a5e9db2376eb5e7058c81c3ebd'
Submodule path 'deps/crypto/trezor-firmware/vendor/micropython/lib/tinyusb/tools/uf2': checked out '19615407727073e36d81bf239c52108ba92e7660'
Submodule 'hidapi' (https://github.com/signal11/hidapi) registered for path 'deps/crypto/trezor-firmware/vendor/micropython/lib/tinyusb/tools/uf2/hidapi'
Cloning into 'deps/crypto/trezor-firmware/vendor/micropython/lib/tinyusb/tools/uf2/hidapi'...
Submodule path 'deps/crypto/trezor-firmware/vendor/micropython/lib/tinyusb/tools/uf2/hidapi': checked out 'a6a622ffb680c55da0de787ff93b80280498330f'
Submodule path 'deps/crypto/trezor-firmware/vendor/nanopb': checked out '2b48a361786dfb1f63d229840217a93aae064667'
Submodule path 'deps/crypto/trezor-firmware/vendor/secp256k1-zkp': checked out 'fac477f822a9d493b0d23cc604d741b24a0c9719'
Submodule path 'deps/device-protocol': checked out '59c86a41a06f1a6c9242be222cc6ce2273f4ff43'
Submodule path 'deps/googletest': checked out '7888184f28509dba839e3683409443e0b5bb8948'
Submodule path 'deps/python-keepkey': checked out 'ea281adc0ed27d0b366efd159016c5c1869825f0'
Submodule 'device-protocol' (https://github.com/keepkey/device-protocol.git) registered for path 'deps/python-keepkey/device-protocol'
Submodule 'keepkeylib/eth/ethereum-lists' (https://github.com/keepkey/ethereum-lists.git) registered for path 'deps/python-keepkey/keepkeylib/eth/ethereum-lists'
Cloning into 'deps/python-keepkey/device-protocol'...
Cloning into 'deps/python-keepkey/keepkeylib/eth/ethereum-lists'...
Submodule path 'deps/python-keepkey/device-protocol': checked out '59c86a41a06f1a6c9242be222cc6ce2273f4ff43'
Submodule path 'deps/python-keepkey/keepkeylib/eth/ethereum-lists': checked out 'e216e92d3f28821b2baea2ff9596e9a6b698f39f'
Submodule path 'deps/qrenc/QR-Code-generator': checked out '6dfbfdad5d9303ed190d1c3cb7bec34b565b6ce8'
Submodule path 'deps/sca-hardening/SecAESSTM32': checked out '71d356a1141624994cf613bd2d2583892e8e6d5a'
```

... that is a truly impressive amount of submodules, many of which are required
due to alt-coins. The bigger the code base, the bigger the attack surface.

The latest binary available on GitHub is `7.1.7`:

```
$ git checkout v7.1.7
$ git submodule update --init --recursive
$ scripts/build/docker/device/release.sh
$ wget https://github.com/keepkey/keepkey-firmware/releases/download/v7.1.7/firmware.keepkey.bin
$ sha256sum firmware.keepkey.bin ; tail -c +257 firmware.keepkey.bin | sha256sum ; tail -c +257 ./bin/firmware.keepkey.bin | sha256sum
2b7edd319536076e0a00058d0cfd1b1863c8d616ba5851668796d04966df8594  firmware.keepkey.bin
5528034fec8334a7ee494c2ec50d5f0368e2e5fe403f4bc29a54c70fa026e2c0  -
14b831edbe0555dd1f1c11f98cf1a42338b4058274496b7f45f0f66d9523ff94  -
```

That's not a match.

A closer look, comparing the two files after the first 256 bytes that are all
`0` in our build and signatures (?) in the signed download:

```
     9  11  15
    13 235 241
    21 235 241
    25 235 241
    49 237 243
    57 237 243
    61 237 243
    65 235 241
    69 235 241
    73 235 241
    77 235 241
    81 235 241
    85 235 241
    89 235 241
    93 235 241
    97 235 241
   101 235 241
   105 235 241
   109 235 241
   113 235 241
   117 235 241
   121 235 241
   125 235 241
   129 235 241
   133 235 241
   137 235 241
   141 235 241
   145 235 241
   149 235 241
   153 235 241
   161 235 241
   165 235 241
   169 235 241
   173 235 241
   177 235 241
   181 235 241
   189 235 241
   193 235 241
   197 235 241
   201 235 241
   205 235 241
   209 235 241
   213 235 241
   217 235 241
   221 235 241
   225 235 241
   229 235 241
   233 235 241
   237 235 241
   241 235 241
   245 235 241
   249 235 241
   253 235 241
   257 235 241
   261 235 241
   265 235 241
   269 235 241
   273 235 241
   277 235 241
   281 235 241
   285 235 241
   289 235 241
   293 235 241
   297 235 241
   301 235 241
   305 235 241
   309 235 241
   313 235 241
   317 235 241
   321 235 241
   325 235 241
   329 235 241
   333 235 241
   337 235 241
   341 235 241
   345 235 241
   349 235 241
   353 235 241
   357 235 241
   361 235 241
   365 235 241
   369 235 241
   373 235 241
   377 235 241
   381 235 241
   385 235 241
   403 150 152
   405  30  31
   407 376   0
   408 377 370
   425  37  41
   435 164 166
   467   6  10
   475 334 336
   495 374 376
   513 217 221
   543 266 270
   549 374   4
   550   2   3
   553  11  21
   589 127 131
   601 217 221
   605 153 155
   615 226 230
   633 215 217
   643 376   0
   644 373 374
   653 337 341
   657  61  63
   661 121 123
   669  25  27
   673 111 113
   687 276 300
   693 311 313
   705 377   1
   706 375 376
   719 274 276
   725 143 145
   735 264 266
   743 152 154
   763 234 236
   791 336 340
   811 246 250
   825 365 371
   837 175 201
   841 375   1
   842 236 237
   857  21  31
   861 174 204
   865 264 274
   869 323 333
   877 217 227
   881 347 357
   885 377   7
   886   3   4
   945  15  17
   ...
$ cmp --ignore-initial=256:256 --verbose firmware.keepkey.bin ./bin/firmware.keepkey.bin | wc -l
cmp: EOF on firmware.keepkey.bin after byte 526748
360449
```

... that's the next 1000 bytes and while some bytes match, 136 bytes don't match
and over the whole file, most bytes don't match. That is not reproducible and
thus **not verifiable**.

<span id="upd0731">But ... as mentione above, a developer provided us with more
instructions on how to reproduce it after all. Let's see ...</span>

We have to start from zero, picking what works from above ...

```
$ git clone https://github.com/keepkey/keepkey-firmware
$ cd keepkey-firmware
$ git checkout v7.1.7
$ git submodule update --init --recursive
$ rm deps/python-keepkey/keepkeylib/eth/ethereum-lists/src/tokens/eth/0x45804880de22913dafe09f4980848ece6ecbaf78.json
$ ./scripts/build/docker/device/release.sh
$ wget https://github.com/keepkey/keepkey-firmware/releases/download/v7.1.7/firmware.keepkey.bin
$ sha256sum firmware.keepkey.bin ; tail -c +257 firmware.keepkey.bin | sha256sum ; tail -c +257 ./bin/firmware.keepkey.bin | sha256sum
2b7edd319536076e0a00058d0cfd1b1863c8d616ba5851668796d04966df8594  firmware.keepkey.bin
5528034fec8334a7ee494c2ec50d5f0368e2e5fe403f4bc29a54c70fa026e2c0  -
5528034fec8334a7ee494c2ec50d5f0368e2e5fe403f4bc29a54c70fa026e2c0  -
```

So that looks better. The firmware we downloaded is the same as in the last
round and the chopped part matches. As all we did was delete a part of the
provided source code, all promises we provide hold true: *If you reviewed the
code and it's all good, the firmware binary is also good.* This product is
**reproducible**.
