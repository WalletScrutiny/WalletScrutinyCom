---
title: "BitBox02"
appId: bitBox2
authors:
- leo
released: 
discontinued: # date
updated: 2021-09-06
version: 9.7.0
binaries: https://github.com/digitalbitbox/bitbox02-firmware/releases
dimensions: [54.5, 25.4, 9.6]
weight: 12
website: https://shiftcrypto.ch/
shop: https://shiftcrypto.shop/en/products/bitbox02-bitcoin-only-4/
country: CH
price: 119EUR
repository: https://github.com/digitalbitbox/bitbox02-firmware
issue: https://github.com/digitalbitbox/bitbox02-firmware/issues/762
icon: bitBox2.png
bugbounty: 
verdict: reproducible
date: 2021-10-05
signer: 
reviewArchive:
- date: 2021-07-10
  version: "9.6.0"
  appHash: e41917450ef6fb80af9fbe8f85478973763fe593c23cdeaec481e5d5395dd3b9
  gitRevision: deced5af364fdbbf7e613ed48f74171bb4093979
  verdict: reproducible
providerTwitter: ShiftCryptoHQ
providerLinkedIn: shift-crypto
providerFacebook: Shiftcrypto
providerReddit: BitBoxWallet
---


We wrapped the findings from prior reviews in a
[test script](https://gitlab.com/walletscrutiny/walletScrutinyCom/-/blob/master/scripts/test/hardware/bitBox2.sh)
which gave us these results:

```
$ scripts/test/hardware/bitBox2.sh 9.7.0
...
997fa9ab985d61473cb191d1c3bba2a291fb91861e215c005b133aec1e87d493  firmware-btc.v9.7.0.signed.bin
...
59f3442ac524c5e158405fc4710c8d264876c8d7ec82a3d3cc090cdee56689c7  temp/build/bin/firmware-btc.bin
59f3442ac524c5e158405fc4710c8d264876c8d7ec82a3d3cc090cdee56689c7  firmware-btc.v9.7.0.bin
```

The result in summary:

```
appId:        bitBox2
variant:      firmware-btc-only
version:      v9.7.0
fileHash:     997fa9ab985d61473cb191d1c3bba2a291fb91861e215c005b133aec1e87d493
firmwareHash: 59f3442ac524c5e158405fc4710c8d264876c8d7ec82a3d3cc090cdee56689c7
```

Sadly the hash `5f38987cf70ef7978163e6095a27543cd476ca35578ce2f728fa647154dc0ff5`
published by the provider which also can be verified during update on the device
is not as trivially reproducible as advertised
[here](https://github.com/digitalbitbox/bitbox02-firmware/tree/firmware-btc-only/v9.7.0/releases#verify-the-hash-as-shown-by-the-bitbox02-at-startup).

Following these instructions:

```
$ find . | grep describe_sig
./releases/describe_signed_firmware.py
./temp/releases/describe_signed_firmware.py
$ (cd temp/releases/; ./describe_signed_firmware.py ../../firmware-btc.v9.7.0.signed.bin)
bitbox02 module not found; please see bitbox02-firmware/py/README.md
Traceback (most recent call last):
  File "/tmp/bitbox02-firmware/temp/releases/./describe_signed_firmware.py", line 78, in <module>
    sys.exit(main())
  File "/tmp/bitbox02-firmware/temp/releases/./describe_signed_firmware.py", line 45, in main
    magic, sigdata, firmware = parse_signed_firmware(binary)
NameError: name 'parse_signed_firmware' is not defined
$ (cd releases/; ./describe_signed_firmware.py ../firmware-btc.v9.7.0.signed.bin)
bitbox02 module not found; please see bitbox02-firmware/py/README.md
Traceback (most recent call last):
  File "/tmp/bitbox02-firmware/releases/./describe_signed_firmware.py", line 78, in <module>
    sys.exit(main())
  File "/tmp/bitbox02-firmware/releases/./describe_signed_firmware.py", line 45, in main
    magic, sigdata, firmware = parse_signed_firmware(binary)
NameError: name 'parse_signed_firmware' is not defined
$ cat py/README.md
# Python scripts

To use the scripts (`send_message.py`, `load_firmware.py` for example) go into the `bitbox02`
directory and run `pip3 install .`.

If you plan to work on the scripts run `pip3 install -e .` instead.
$ find . | grep '/bitbox02/'
./py/bitbox02/CHANGELOG.md
./py/bitbox02/bitbox02/__init__.py
./py/bitbox02/bitbox02/bitbox02/__init__.py
./src/rust/bitbox02/.gitignore
./temp/py/bitbox02/CHANGELOG.md
./temp/py/bitbox02/bitbox02/__init__.py
./temp/py/bitbox02/bitbox02/bitbox02/__init__.py
./temp/src/rust/bitbox02/.gitignore
$ (cd py/bitbox02; pip3 install )
ERROR: You must give at least one requirement to install (see "pip help install")
$ (cd py/bitbox02/bitbox02; pip3 install )
ERROR: You must give at least one requirement to install (see "pip help install")
$ (cd py/bitbox02/bitbox02/bitbox02; pip3 install )
ERROR: You must give at least one requirement to install (see "pip help install")
```

For the predecessor we worked our way around using the python scripts but those
should also just work. What are we doing wrong?

Anyway, back to manual mode ...

```
$ head -c 588 firmware-btc.v9.7.0.signed.bin > p_head.bin
$ tail -c +589 firmware-btc.v9.7.0.signed.bin > p_firmware.bin
$ cat p_head.bin | tail -c +$(( 8 + 6 * 64 + 1 )) | head -c 4 > p_version.bin
$ cat p_version.bin | xxd -p
17000000
$ wc -c p_firmware.bin
460940 p_firmware.bin
$ echo $(( 884736 - 460940 ))
423796
$ dd if=/dev/zero ibs=1 count=423796 | tr "\000" "\377" > p_padding.bin
423796+0 records in
827+1 records out
423796 bytes (424 kB, 414 KiB) copied, 0.0737553 s, 5.7 MB/s
$ cat p_version.bin p_firmware.bin p_padding.bin | sha256sum | cut -c1-64 | xxd -r -p | sha256sum | cut -c1-64
5f38987cf70ef7978163e6095a27543cd476ca35578ce2f728fa647154dc0ff5
```

So, the result looks good. The {{ page.title }}'s firmware version
`9.7.0` with hash `997fa9ab985d61473cb191d1c3bba2a291fb91861e215c005b133aec1e87d493`
is **reproducible**. The bootloader should show the hash `5f38987cf70ef7978163e6095a27543cd476ca35578ce2f728fa647154dc0ff5` during update.
