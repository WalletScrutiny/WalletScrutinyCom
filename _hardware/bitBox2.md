---
title: BitBox02
appId: bitBox2
authors:
- leo
- Joko Ono
- Mohammad Rafigh
- danny
- keraliss
released: 2019-09-25
discontinued: 
updated: 2024-09-26
version: 9.21.0-Multi
binaries: https://github.com/BitBoxSwiss/bitbox02-firmware/releases
dimensions:
- 55
- 25
- 9.6
weight: 12
provider: 
providerWebsite: 
website: https://shiftcrypto.ch/
shop: https://shiftcrypto.shop/en/products/bitbox02-bitcoin-only-4/
country: CH
price: 149EUR
repository: https://github.com/BitBoxSwiss/bitbox02-firmware
issue: 
icon: bitBox2.png
bugbounty: 
meta: ok
verdict: sourceavailable
appHashes:
- 36895857c346c1fbd0d206853b7031e985c1a959e9f7f9396a7ae94dfffa9679
date: 2024-11-05
signer: 
twitter: ShiftCryptoHQ
social:
- https://www.linkedin.com/company/shift-crypto
- https://www.facebook.com/Shiftcrypto
- https://www.reddit.com/r/BitBoxWallet
features: 

---

```
$ scripts/test/hardware/bitBox2.sh 9.21.0
...
[100%] Linking C executable ../bin/firmware-btc.elf

Generating binary firmware-btc.bin
   text	   data	    bss	    dec	    hex	filename
 541768	  19172	 191064	 752004	  b7984	firmware-btc.elf
make[4]: Leaving directory '/bb02/build'
[100%] Built target firmware-btc.elf
make[3]: Leaving directory '/bb02/build'
make[2]: Leaving directory '/bb02/build'
make[1]: Leaving directory '/bb02/build'
firmware.bin created at:
/home/dannybuntu/wsTest/bitbox02-firmware/temp/build/bin/firmware.bin
or
/home/dannybuntu/wsTest/bitbox02-firmware/temp/build/bin/firmware-btc.bin
Hashes of
signed download             ff35982362faa1c6ca5066d1c4b4309eea52a4a14aa31f7a7fa413cbef5ac9a3  firmware-btc.v9.21.0.signed.bin
signed download minus sig.  36895857c346c1fbd0d206853b7031e985c1a959e9f7f9396a7ae94dfffa9679  p_firmware-btc.bin
built binary                36895857c346c1fbd0d206853b7031e985c1a959e9f7f9396a7ae94dfffa9679  temp/build/bin/firmware-btc.bin
firmware as shown in device 4b851096907dbd168f1d3873f7be1adc8c43d779d3015b3f3bbf5038842980b1
                           (The latter is a double sha256 over version,
                            firmware and padding)
```

Version 9.21.0 is **reproducible**.

{% include asciicast %}
